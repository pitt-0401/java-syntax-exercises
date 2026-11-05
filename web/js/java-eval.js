// A tiny evaluator for Java *expressions* (and simple assignments) with int / double / boolean.
// It follows Java's rules where students trip up: int / int truncates, int % int,
// division by zero throws, casts, && || !, comparisons, and Math.* helpers.
// Used for Part B: the student's expression is evaluated with the given values
// AND with other values, so a hard-coded or int-division answer is caught.
(function (global) {
  'use strict';

  class JavaError extends Error {}

  // ---------- tokenizer ----------
  const OPS = ['&&', '||', '==', '!=', '<=', '>=', '+=', '-=', '*=', '/=', '%=', '++', '--',
               '+', '-', '*', '/', '%', '<', '>', '!', '(', ')', '?', ':', '=', ',', '.', ';'];

  function tokenize(src) {
    const tokens = [];
    let i = 0;
    while (i < src.length) {
      const ch = src[i];
      if (/\s/.test(ch)) { i++; continue; }
      const num = /^(\d+\.\d*|\.\d+|\d+)([eE][+-]?\d+)?([dDfFlL])?/.exec(src.slice(i));
      if (num) {
        const text = num[0];
        const isDouble = /[.eEdDfF]/.test(text);
        if (/[lL]$/.test(text)) {
          tokens.push({ t: 'num', type: 'int', v: parseInt(text, 10) });
        } else {
          tokens.push({ t: 'num', type: isDouble ? 'double' : 'int', v: parseFloat(text.replace(/[dDfF]$/, '')) });
        }
        i += text.length;
        continue;
      }
      const id = /^[A-Za-z_$][\w$]*/.exec(src.slice(i));
      if (id) { tokens.push({ t: 'id', v: id[0] }); i += id[0].length; continue; }
      if (ch === '"' || ch === "'") throw new JavaError('Strings and chars are not needed here — use numbers and variables.');
      const op = OPS.find(o => src.startsWith(o, i));
      if (!op) throw new JavaError(`Unexpected character "${ch}".`);
      tokens.push({ t: 'op', v: op });
      i += op.length;
    }
    tokens.push({ t: 'eof' });
    return tokens;
  }

  // ---------- values ----------
  const int = v => ({ type: 'int', v: v | 0 });
  const dbl = v => ({ type: 'double', v });
  const bool = v => ({ type: 'boolean', v: !!v });

  function needNumber(x, op) {
    if (x.type === 'boolean') throw new JavaError(`bad operand type boolean for "${op}".`);
  }
  function needBool(x, op) {
    if (x.type !== 'boolean') throw new JavaError(`bad operand type ${x.type} for "${op}" (needs a boolean).`);
  }

  function arith(op, a, b) {
    needNumber(a, op); needNumber(b, op);
    const isD = a.type === 'double' || b.type === 'double';
    switch (op) {
      case '+': return isD ? dbl(a.v + b.v) : int(a.v + b.v);
      case '-': return isD ? dbl(a.v - b.v) : int(a.v - b.v);
      case '*': return isD ? dbl(a.v * b.v) : int(Math.imul(a.v, b.v));
      case '/':
        if (isD) return dbl(a.v / b.v);
        if (b.v === 0) throw new JavaError('ArithmeticException: / by zero');
        return int(Math.trunc(a.v / b.v));
      case '%':
        if (isD) return dbl(a.v % b.v);
        if (b.v === 0) throw new JavaError('ArithmeticException: / by zero');
        return int(a.v % b.v);
    }
  }

  function compare(op, a, b) {
    if (op === '==' || op === '!=') {
      if ((a.type === 'boolean') !== (b.type === 'boolean')) throw new JavaError(`incomparable types: ${a.type} and ${b.type}`);
      const eq = a.v === b.v;
      return bool(op === '==' ? eq : !eq);
    }
    needNumber(a, op); needNumber(b, op);
    switch (op) {
      case '<': return bool(a.v < b.v);
      case '>': return bool(a.v > b.v);
      case '<=': return bool(a.v <= b.v);
      case '>=': return bool(a.v >= b.v);
    }
  }

  const MATH = {
    abs: { n: 1, f: a => (a.type === 'int' ? int(Math.abs(a.v)) : dbl(Math.abs(a.v))) },
    max: { n: 2, f: (a, b) => (a.type === 'int' && b.type === 'int' ? int(Math.max(a.v, b.v)) : dbl(Math.max(a.v, b.v))) },
    min: { n: 2, f: (a, b) => (a.type === 'int' && b.type === 'int' ? int(Math.min(a.v, b.v)) : dbl(Math.min(a.v, b.v))) },
    pow: { n: 2, f: (a, b) => dbl(Math.pow(a.v, b.v)) },
    sqrt: { n: 1, f: a => dbl(Math.sqrt(a.v)) },
    round: { n: 1, f: a => int(Math.floor(a.v + 0.5)) },
    floor: { n: 1, f: a => dbl(Math.floor(a.v)) },
    ceil: { n: 1, f: a => dbl(Math.ceil(a.v)) },
  };

  // ---------- parser + evaluator (Pratt) ----------
  // env: { name: {type, v} }   -> returns {value, usedVars:Set}
  function evaluate(src, env, opts = {}) {
    const tokens = tokenize(src);
    let pos = 0;
    const used = new Set();
    const peek = () => tokens[pos];
    const next = () => tokens[pos++];
    const isOp = v => peek().t === 'op' && peek().v === v;
    const expect = v => {
      if (!isOp(v)) throw new JavaError(`Expected "${v}"` + (peek().t === 'eof' ? ' at the end.' : ` before "${peek().v}".`));
      next();
    };

    const BIN = { '||': 1, '&&': 2, '==': 3, '!=': 3, '<': 4, '>': 4, '<=': 4, '>=': 4, '+': 5, '-': 5, '*': 6, '/': 6, '%': 6 };

    function expr() { return ternary(); }

    function ternary() {
      const c = binary(1);
      if (isOp('?')) {
        next();
        needBool(c, '?');
        const a = expr();
        expect(':');
        const b = expr();
        return c.v ? a : b;
      }
      return c;
    }

    function binary(minPrec) {
      let left = unary();
      for (;;) {
        const tok = peek();
        if (tok.t !== 'op' || !(tok.v in BIN) || BIN[tok.v] < minPrec) return left;
        const op = next().v;
        // short circuit is irrelevant (no side effects), but keep type checks
        const right = binary(BIN[op] + 1);
        if (op === '&&' || op === '||') {
          needBool(left, op); needBool(right, op);
          left = bool(op === '&&' ? left.v && right.v : left.v || right.v);
        } else if (BIN[op] >= 5) {
          left = arith(op, left, right);
        } else {
          left = compare(op, left, right);
        }
      }
    }

    function unary() {
      if (isOp('-')) { next(); const x = unary(); needNumber(x, '-'); return x.type === 'int' ? int(-x.v) : dbl(-x.v); }
      if (isOp('+')) { next(); const x = unary(); needNumber(x, '+'); return x; }
      if (isOp('!')) { next(); const x = unary(); needBool(x, '!'); return bool(!x.v); }
      // cast: ( double ) / ( int )
      if (isOp('(') && tokens[pos + 1].t === 'id' && ['double', 'int', 'float', 'long'].includes(tokens[pos + 1].v)
          && tokens[pos + 2].t === 'op' && tokens[pos + 2].v === ')') {
        next(); const type = next().v; next();
        const x = unary();
        needNumber(x, '(' + type + ')');
        return type === 'int' || type === 'long' ? int(Math.trunc(x.v)) : dbl(x.v);
      }
      return primary();
    }

    function primary() {
      const tok = next();
      if (tok.t === 'num') return { type: tok.type, v: tok.v };
      if (tok.t === 'op' && tok.v === '(') { const x = expr(); expect(')'); return x; }
      if (tok.t === 'id') {
        if (tok.v === 'true' || tok.v === 'false') return bool(tok.v === 'true');
        if (tok.v === 'Math') {
          expect('.');
          const name = next();
          if (name.t !== 'id' || !(name.v in MATH)) throw new JavaError(`Math.${name.v || '?'} is not supported here.`);
          expect('(');
          const args = [expr()];
          while (isOp(',')) { next(); args.push(expr()); }
          expect(')');
          const m = MATH[name.v];
          if (args.length !== m.n) throw new JavaError(`Math.${name.v} takes ${m.n} argument(s).`);
          args.forEach(a => needNumber(a, 'Math.' + name.v));
          return m.f(...args);
        }
        if (!(tok.v in env)) throw new JavaError(`cannot find symbol: ${tok.v}` + (opts.hintVars ? ` (the variables are: ${Object.keys(env).join(', ')})` : ''));
        used.add(tok.v);
        return { ...env[tok.v] };
      }
      if (tok.t === 'eof') throw new JavaError('The expression ends too early.');
      throw new JavaError(`Unexpected "${tok.v}".`);
    }

    // statement forms: [type] name = expr ;   name op= expr ;   name++ ;
    let assignTo = null, assignOp = null, declared = null;
    if (peek().t === 'id' && ['int', 'double', 'boolean'].includes(peek().v) && tokens[pos + 1].t === 'id') {
      declared = next().v;   // e.g., double result = ...
    }
    if (peek().t === 'id' && tokens[pos + 1].t === 'op' && ['=', '+=', '-=', '*=', '/=', '%='].includes(tokens[pos + 1].v)) {
      assignTo = next().v;
      assignOp = next().v;
      if (declared) {
        if (assignTo in env) throw new JavaError(`variable ${assignTo} is already defined`);
        if (assignOp !== '=') throw new JavaError(`variable ${assignTo} might not have been initialized`);
        env = { ...env, [assignTo]: { type: declared, v: 0 } };
      } else if (!(assignTo in env)) {
        throw new JavaError(`cannot find symbol: ${assignTo}`);
      }
    } else if (declared) {
      throw new JavaError('Expected "=" after the variable name.');
    }
    const value = expr();
    if (isOp(';')) next();
    if (peek().t !== 'eof') throw new JavaError(`Unexpected "${peek().v}" — is an operator missing?`);

    if (assignTo) {
      const target = env[assignTo];
      let result = value;
      if (assignOp !== '=') {
        used.add(assignTo);
        result = arith(assignOp[0], target, value);
      } else if (target.type === 'int' && value.type === 'double') {
        throw new JavaError(`incompatible types: possible lossy conversion from double to int`);
      } else if ((target.type === 'boolean') !== (value.type === 'boolean')) {
        throw new JavaError(`incompatible types: ${value.type} cannot be converted to ${target.type}`);
      }
      if (target.type === 'double') result = dbl(+result.v);
      else if (target.type === 'int') result = int(result.v);
      return { value: result, usedVars: used, assignTo, declared, statement: true };
    }
    return { value, usedVars: used, assignTo: null, statement: false };
  }

  // Java-style printing of a value: 40.0, 3, true, 1.0E7
  function format(x) {
    if (x.type === 'boolean') return String(x.v);
    if (x.type === 'int') return String(x.v);
    const v = x.v;
    if (!isFinite(v)) return isNaN(v) ? 'NaN' : (v > 0 ? 'Infinity' : '-Infinity');
    const a = Math.abs(v);
    if (a !== 0 && (a >= 1e7 || a < 1e-3)) {
      const [m, e] = v.toExponential().split('e');
      return (m.includes('.') ? m : m + '.0') + 'E' + parseInt(e, 10);
    }
    const s = String(v);
    return s.includes('.') ? s : s + '.0';
  }

  function sameValue(a, b) {
    if (a.type === 'boolean' || b.type === 'boolean') return a.type === b.type && a.v === b.v;
    return Math.abs(a.v - b.v) <= 1e-9 * Math.max(1, Math.abs(a.v), Math.abs(b.v));
  }

  global.JavaEval = { evaluate, format, sameValue, JavaError };
})(typeof window !== 'undefined' ? window : globalThis);
