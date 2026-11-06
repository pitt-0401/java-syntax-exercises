// A tiny evaluator for Java *expressions* (and simple assignments) as used in Part B.
// Types: int, double, boolean, String, int[], double[], String[].
// It follows Java's rules where students trip up: int / int truncates, % on ints,
// division by zero, casts, && || !, String + (left to right), == on Strings,
// array indexes out of bounds, .length vs .length() vs .size().
// The student's expression is evaluated with the given values AND with other values,
// so a hard-coded or int-division answer is caught.
(function (global) {
  'use strict';

  class JavaError extends Error {}

  // ---------- tokenizer ----------
  const OPS = ['&&', '||', '==', '!=', '<=', '>=', '+=', '-=', '*=', '/=', '%=', '++', '--',
               '+', '-', '*', '/', '%', '<', '>', '!', '(', ')', '[', ']', '?', ':', '=', ',', '.', ';'];

  function tokenize(src) {
    const tokens = [];
    let i = 0;
    while (i < src.length) {
      const ch = src[i];
      if (/\s/.test(ch)) { i++; continue; }
      const num = /^(\d+\.\d*|\.\d+|\d+)([eE][+-]?\d+)?([dDfFlL])?/.exec(src.slice(i));
      if (num) {
        const text = num[0];
        if (/[lL]$/.test(text)) tokens.push({ t: 'num', type: 'int', v: parseInt(text, 10) });
        else tokens.push({ t: 'num', type: /[.eEdDfF]/.test(text) ? 'double' : 'int', v: parseFloat(text.replace(/[dDfF]$/, '')) });
        i += text.length;
        continue;
      }
      if (ch === '"') {
        let j = i + 1, s = '';
        while (j < src.length && src[j] !== '"') {
          if (src[j] === '\\' && j + 1 < src.length) { const e = src[j + 1]; s += e === 'n' ? '\n' : e === 't' ? '\t' : e; j += 2; } else s += src[j++];
        }
        if (j >= src.length) throw new JavaError('unclosed string literal: a " is missing.');
        tokens.push({ t: 'str', v: s });
        i = j + 1;
        continue;
      }
      if (ch === "'") throw new JavaError('Use double quotes for text: "..." (single quotes are for one char).');
      if (ch === '{' || ch === '}') throw new JavaError('Array literals { … } are not needed here. Use the variables.');
      const id = /^[A-Za-z_$][\w$]*/.exec(src.slice(i));
      if (id) { tokens.push({ t: 'id', v: id[0] }); i += id[0].length; continue; }
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
  const str = v => ({ type: 'String', v: String(v) });
  const isNum = x => x.type === 'int' || x.type === 'double';
  const isArr = x => x.type.endsWith('[]');

  function needNumber(x, op) {
    if (!isNum(x)) throw new JavaError(`bad operand type ${x.type} for "${op}".`);
  }
  function needBool(x, op) {
    if (x.type !== 'boolean') throw new JavaError(`bad operand type ${x.type} for "${op}" (needs a boolean).`);
  }

  function arith(op, a, b) {
    if (op === '+' && (a.type === 'String' || b.type === 'String')) {
      if (isArr(a) || isArr(b)) throw new JavaError('Adding an array to a String prints its reference, e.g., [I@1b6d3586, not the values.');
      return str(format(a) + format(b));
    }
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
      if (a.type === 'String' || b.type === 'String') {
        throw new JavaError('== on Strings compares references (same object?), not the text → use equals(...).');
      }
      if (isArr(a) || isArr(b)) throw new JavaError('== on arrays compares references, not the values.');
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

  // String methods taught in the course (+ a few harmless extras)
  const needStr = (x, m) => { if (x.type !== 'String') throw new JavaError(`${m}(...) needs a String argument.`); };
  const STRING_METHODS = {
    length: { n: 0, f: s => int(s.v.length) },
    equals: { n: 1, f: (s, x) => bool(x.type === 'String' && s.v === x.v) },
    equalsIgnoreCase: { n: 1, f: (s, x) => bool(x.type === 'String' && s.v.toLowerCase() === x.v.toLowerCase()) },
    contains: { n: 1, f: (s, x) => { needStr(x, 'contains'); return bool(s.v.includes(x.v)); } },
    toUpperCase: { n: 0, f: s => str(s.v.toUpperCase()) },
    toLowerCase: { n: 0, f: s => str(s.v.toLowerCase()) },
    concat: { n: 1, f: (s, x) => { needStr(x, 'concat'); return str(s.v + x.v); } },
    replace: { n: 2, f: (s, a, b) => { needStr(a, 'replace'); needStr(b, 'replace'); return str(s.v.split(a.v).join(b.v)); } },
    isEmpty: { n: 0, f: s => bool(s.v.length === 0) },
    trim: { n: 0, f: s => str(s.v.trim()) },
  };

  // ---------- parser + evaluator (Pratt) ----------
  // env: { name: {type, v} }   -> returns {value, usedVars:Set, assignTo, statement}
  function evaluate(src, env, opts = {}) {
    const tokens = tokenize(src);
    let pos = 0;
    const used = new Set();
    const peek = (k = 0) => tokens[pos + k];
    const next = () => tokens[pos++];
    const isOp = (v, k = 0) => peek(k).t === 'op' && peek(k).v === v;
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
        if (op === '&&' || op === '||') {
          needBool(left, op);
          // short-circuit, like Java: the right side only runs when needed
          if ((op === '&&' && !left.v) || (op === '||' && left.v)) { skipOperand(BIN[op] + 1); continue; }
          const right = binary(BIN[op] + 1);
          needBool(right, op);
          left = bool(right.v);
        } else {
          const right = binary(BIN[op] + 1);
          left = BIN[op] >= 5 ? arith(op, left, right) : compare(op, left, right);
        }
      }
    }

    // Parse the right operand of a short-circuited && / || without throwing runtime errors.
    function skipOperand(prec) {
      const save = { used: new Set(used) };
      try { binary(prec); } catch (e) {
        if (!(e instanceof JavaError) || !/^(ArrayIndexOutOfBoundsException|ArithmeticException)/.test(e.message)) throw e;
        // a runtime error (e.g., index out of bounds) in the skipped part: Java never runs it → fine.
        // re-sync: skip tokens until an operator of lower precedence or the end
        let depth = 0;
        while (peek().t !== 'eof') {
          const t = peek();
          if (t.t === 'op' && (t.v === '(' || t.v === '[')) depth++;
          if (t.t === 'op' && (t.v === ')' || t.v === ']')) { if (depth === 0) break; depth--; }
          if (depth === 0 && t.t === 'op' && (t.v in BIN) && BIN[t.v] < prec) break;
          if (depth === 0 && t.t === 'op' && (t.v === '?' || t.v === ':' || t.v === ';')) break;
          next();
        }
      }
      save.used.forEach(u => used.add(u));
    }

    function unary() {
      if (isOp('-')) { next(); const x = unary(); needNumber(x, '-'); return x.type === 'int' ? int(-x.v) : dbl(-x.v); }
      if (isOp('+')) { next(); const x = unary(); needNumber(x, '+'); return x; }
      if (isOp('!')) { next(); const x = unary(); needBool(x, '!'); return bool(!x.v); }
      // cast: ( double ) / ( int )
      if (isOp('(') && peek(1).t === 'id' && ['double', 'int', 'float', 'long'].includes(peek(1).v) && isOp(')', 2)) {
        next(); const type = next().v; next();
        const x = unary();
        needNumber(x, '(' + type + ')');
        return type === 'int' || type === 'long' ? int(Math.trunc(x.v)) : dbl(x.v);
      }
      return postfix(primary());
    }

    function args() {
      expect('(');
      const list = [];
      if (!isOp(')')) {
        list.push(expr());
        while (isOp(',')) { next(); list.push(expr()); }
      }
      expect(')');
      return list;
    }

    function postfix(x) {
      for (;;) {
        if (isOp('[')) {
          next();
          const idx = expr();
          expect(']');
          if (!isArr(x)) throw new JavaError(`array required, but ${x.type} found: only arrays use [ ].`);
          if (idx.type !== 'int') throw new JavaError(`incompatible types: an index must be an int, not ${idx.type}.`);
          if (idx.v < 0 || idx.v >= x.v.length) throw new JavaError(`ArrayIndexOutOfBoundsException: Index ${idx.v} out of bounds for length ${x.v.length}`);
          const elemType = x.type.slice(0, -2);
          x = { type: elemType, v: x.v[idx.v] };
          continue;
        }
        if (isOp('.')) {
          next();
          const name = next();
          if (name.t !== 'id') throw new JavaError('Expected a method or field name after ".".');
          const call = isOp('(');
          if (isArr(x)) {
            if (name.v === 'length' && !call) { x = int(x.v.length); continue; }
            if (name.v === 'length') throw new JavaError('Arrays have .length without () → length() is for Strings.');
            if (name.v === 'size') throw new JavaError('size() is for ArrayLists. Arrays have .length.');
            throw new JavaError(`cannot find symbol: ${name.v} (arrays only have .length).`);
          }
          if (x.type === 'String') {
            if (name.v === 'length' && !call) throw new JavaError('Strings have length() with () → .length (no parentheses) is for arrays.');
            if (name.v === 'size') throw new JavaError('size() is for ArrayLists. Strings have length().');
            const m = STRING_METHODS[name.v];
            if (!m) throw new JavaError(`String.${name.v}(...) is not covered here. Use one of these: ${Object.keys(STRING_METHODS).join('(), ')}().`);
            if (!call) throw new JavaError(`${name.v} is a method → ${name.v}(...)`);
            const a = args();
            if (a.length !== m.n) throw new JavaError(`${name.v}(...) takes ${m.n} argument${m.n === 1 ? '' : 's'}.`);
            x = m.f(x, ...a);
            continue;
          }
          throw new JavaError(`${x.type} is a primitive type → it has no methods or fields (".${name.v}").`);
        }
        return x;
      }
    }

    function primary() {
      const tok = next();
      if (tok.t === 'num') return { type: tok.type, v: tok.v };
      if (tok.t === 'str') return str(tok.v);
      if (tok.t === 'op' && tok.v === '(') { const x = expr(); expect(')'); return x; }
      if (tok.t === 'id') {
        if (tok.v === 'true' || tok.v === 'false') return bool(tok.v === 'true');
        if (tok.v === 'Math') {
          expect('.');
          const name = next();
          if (name.t !== 'id' || !(name.v in MATH)) throw new JavaError(`Math.${name.v || '?'} is not supported here.`);
          const a = args();
          const m = MATH[name.v];
          if (a.length !== m.n) throw new JavaError(`Math.${name.v} takes ${m.n} argument(s).`);
          a.forEach(v => needNumber(v, 'Math.' + name.v));
          return m.f(...a);
        }
        if (!(tok.v in env)) throw new JavaError(`cannot find symbol: ${tok.v}` + (opts.hintVars ? ` (the variables are: ${Object.keys(env).join(', ')})` : ''));
        used.add(tok.v);
        return { ...env[tok.v] };
      }
      if (tok.t === 'eof') throw new JavaError('The expression ends too early.');
      throw new JavaError(`Unexpected "${tok.v}".`);
    }

    // statement forms: [type] name = expr ;   name op= expr ;
    let assignTo = null, assignOp = null, declared = null;
    const TYPES = ['int', 'double', 'boolean', 'String'];
    if (peek().t === 'id' && TYPES.includes(peek().v) && peek(1).t === 'id') {
      declared = next().v;   // e.g., double result = ...
    }
    if (peek().t === 'id' && peek(1).t === 'op' && ['=', '+=', '-=', '*=', '/=', '%='].includes(peek(1).v)) {
      assignTo = next().v;
      assignOp = next().v;
      if (declared) {
        if (assignTo in env) throw new JavaError(`variable ${assignTo} is already defined`);
        if (assignOp !== '=') throw new JavaError(`variable ${assignTo} might not have been initialized`);
        env = { ...env, [assignTo]: { type: declared, v: declared === 'String' ? '' : 0 } };
      } else if (!(assignTo in env)) {
        throw new JavaError(`cannot find symbol: ${assignTo}`);
      }
    } else if (declared) {
      throw new JavaError('Expected "=" after the variable name.');
    }
    const value = expr();
    if (isOp(';')) next();
    if (peek().t !== 'eof') throw new JavaError(`Unexpected "${peek().v}". Is an operator missing?`);

    if (assignTo) {
      const target = env[assignTo];
      if (isArr(target)) throw new JavaError(`${assignTo} is an array → assign to one element, e.g., ${assignTo}[i] = …`);
      let result = value;
      if (assignOp !== '=') {
        used.add(assignTo);
        result = arith(assignOp[0], target, value);
      } else if (target.type === 'int' && value.type === 'double') {
        throw new JavaError('incompatible types: possible lossy conversion from double to int');
      } else if (target.type !== value.type && !(target.type === 'double' && value.type === 'int')) {
        throw new JavaError(`incompatible types: ${value.type} cannot be converted to ${target.type}`);
      }
      if (target.type === 'double') result = dbl(+result.v);
      else if (target.type === 'int') result = int(result.v);
      return { value: result, usedVars: used, assignTo, declared, statement: true };
    }
    return { value, usedVars: used, assignTo: null, statement: false };
  }

  // Java-style printing of a value (what println shows): 40.0, 3, true, 1.0E7, Ana
  function format(x) {
    if (x.type === 'boolean' || x.type === 'int' || x.type === 'String') return String(x.v);
    if (isArr(x)) return '{' + x.v.map(e => format({ type: x.type.slice(0, -2), v: e })).join(', ') + '}';
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
  // For feedback: Strings in quotes, so "Ana Lopez" vs "AnaLopez" is visible
  function display(x) {
    if (x.type === 'String') return JSON.stringify(x.v);
    if (x.type === 'String[]') return '{' + x.v.map(e => JSON.stringify(e)).join(', ') + '}';
    return format(x);
  }

  function sameValue(a, b) {
    if (a.type === 'String' || b.type === 'String') return a.type === b.type && a.v === b.v;
    if (a.type === 'boolean' || b.type === 'boolean') return a.type === b.type && a.v === b.v;
    if (isArr(a) || isArr(b)) return a.type === b.type && a.v.length === b.v.length && a.v.every((e, i) => e === b.v[i]);
    return Math.abs(a.v - b.v) <= 1e-9 * Math.max(1, Math.abs(a.v), Math.abs(b.v));
  }

  global.JavaEval = { evaluate, format, display, sameValue, JavaError };
})(typeof window !== 'undefined' ? window : globalThis);
