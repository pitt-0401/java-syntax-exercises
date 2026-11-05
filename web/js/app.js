// Catch-up practice: renders SECTIONS / EXERCISES (exercises.js), checks answers,
// and remembers answers + progress in this browser (localStorage).
(function () {
  'use strict';
  const { evaluate, format, sameValue } = window.JavaEval;
  const SECTIONS = window.SECTIONS;
  const EXERCISES = window.EXERCISES;
  const STORE_KEY = 'cmpinf0401-catchup-v1';

  // ------------------------------------------------------------ state
  let state = { answers: {}, results: {}, checklist: {} };
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (saved) state = { ...state, ...saved };
  } catch (e) { /* private mode: progress lives only in this tab */ }
  let saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
    }, 150);
  }

  // ------------------------------------------------------------ helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  const sectionOf = id => SECTIONS.find(s => s.id === id);
  const exIndex = id => EXERCISES.findIndex(e => e.id === id);
  const partKey = (ex, i) => `${ex.id}#${i}`;

  const KW = new Set(('abstract boolean break byte case catch char class continue default do double else extends final finally ' +
    'float for if implements import int interface long new null package private protected public return short static super ' +
    'switch this throw throws true false try void while').split(' '));
  function highlight(code) {
    const re = /(\/\/[^\n]*)|("(?:\\.|[^"\\\n])*")|('(?:\\.|[^'\\\n])')|(@\w+)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|([\s\S])/g;
    return code.replace(re, (m, com, str, chr, ann, num, id, other) => {
      if (com) return `<span class="tk-c">${esc(com)}</span>`;
      if (str || chr) return `<span class="tk-s">${esc(m)}</span>`;
      if (ann) return `<span class="tk-a">${esc(ann)}</span>`;
      if (num) return `<span class="tk-n">${num}</span>`;
      if (id) return KW.has(id) ? `<span class="tk-k">${id}</span>` : /^[A-Z]/.test(id) ? `<span class="tk-t">${id}</span>` : id;
      return esc(other);
    });
  }
  function codeBlock(code, lang) {
    const pre = el('pre', 'code');
    pre.innerHTML = lang === 'text' ? esc(code) : highlight(code);
    return pre;
  }

  async function copyText(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = el('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e2) { /* ignore */ }
      ta.remove();
    }
    const old = btn.textContent; btn.textContent = 'Copied ✓';
    setTimeout(() => { btn.textContent = old; }, 1200);
  }

  // ------------------------------------------------------------ UML
  function umlClass(c) {
    const box = el('div', 'uml-class' + (c.role ? ' ' + c.role : ''));
    if (c.tag || c.role === 'given') box.appendChild(el('span', 'uml-tag', c.tag ? '✎ ' + esc(c.tag) : 'given'));
    box.appendChild(el('div', 'uml-name', esc(c.name)));
    const member = (m, hl) => {
      const isStatic = m.startsWith('_');
      const text = esc(isStatic ? m.slice(1) : m);
      return `<div class="uml-member${hl ? ' hl' : ''}">${isStatic ? `<u>${text}</u>` : text}</div>`;
    };
    const hl = c.hl || {};
    box.appendChild(el('div', 'uml-attrs', (c.attrs || []).map((m, i) => member(m, (hl.attrs || []).includes(i))).join('') || '&nbsp;'));
    box.appendChild(el('div', 'uml-methods', (c.methods || []).map((m, i) => member(m, (hl.methods || []).includes(i))).join('') || '&nbsp;'));
    return box;
  }
  function umlDiagram(spec) {
    const wrap = el('div', 'uml uml-' + (spec.layout || 'single'));
    const [a, b] = spec.classes;
    wrap.appendChild(umlClass(a));
    if (spec.layout === 'extends') {
      wrap.appendChild(el('div', 'uml-link', '<svg viewBox="0 0 20 44" width="20" height="44" aria-label="extends"><line x1="10" y1="44" x2="10" y2="14"/><polygon points="10,1 2,14 18,14"/></svg>'));
      wrap.appendChild(umlClass(b));
    } else if (spec.layout === 'aggregation') {
      wrap.appendChild(el('div', 'uml-link',
        `<svg viewBox="0 0 110 24" width="110" height="24" aria-label="has many"><polygon class="open" points="1,12 11,6 21,12 11,18"/><line x1="21" y1="12" x2="107" y2="12"/><polyline class="head" points="98,6 108,12 98,18"/></svg><span class="uml-mult">${esc(spec.mult || '')}</span>`));
      wrap.appendChild(umlClass(b));
    }
    return wrap;
  }

  // ------------------------------------------------------------ checking
  // spacing is ignored; a trailing ; or { is optional
  function normLine(s) {
    return s.trim().replace(/\s+/g, ' ')
      .replace(/ ?([^\w\s$]) ?/g, '$1')
      .replace(/[;{\s]+$/, '');
  }

  function envFrom(vars, values = {}) {
    const env = {};
    for (const [name, [type, v]] of Object.entries(vars || {})) {
      const val = name in values ? values[name] : v;
      env[name] = { type, v: val };
    }
    return env;
  }
  function describeEnv(env) {
    return Object.entries(env).map(([n, x]) => `<code>${n} = ${esc(format(x))}</code>`).join(', ');
  }
  function intDivHint(got, expected) {
    if (got.type === 'int' && expected.type === 'double' && !sameValue(got, expected)) {
      return ' Your result is an <code>int</code> — int division? Use <code>100.0</code> or a cast.';
    }
    return '';
  }

  // Each checker returns { status: 'ok'|'bad'|'review', html, tip? }
  const CHECK = {
    line(ex, part, value) {
      const v = normLine(value || '');
      if (!v) return null;
      const w = (part.wrong || []).find(x => normLine(x.answer) === v);
      if (w) return { status: 'bad', html: w.msg };
      if (part.answers.some(a => normLine(a) === v)) {
        const needsSemi = /;\s*$/.test(part.solution) && !/;\s*$/.test(value);
        return { status: 'ok', html: 'Correct!' + (needsSemi ? ' Don’t forget the <code>;</code> at the end of a statement.' : '') };
      }
      return { status: 'review', html: 'Not the same as the model answer — yours may still be right. Compare:' };
    },

    expr(ex, part, value) {
      if (!(value || '').trim()) return null;
      const ref = part.ref || ex.ref;
      const given = envFrom(ex.vars);
      try {
        if (part.mode === 'example') {
          const expected = part.expected || evaluate(ref, given).value;
          const got = evaluate(value, given);
          if (!sameValue(got.value, expected)) {
            return { status: 'bad', html: `Your expression gives <code>${esc(format(got.value))}</code> — expected <code>${esc(format(expected))}</code>.` + intDivHint(got.value, expected) };
          }
          const tip = got.usedVars.size ? ' (In this step, write it with the numbers — variables come next.)' : '';
          return { status: 'ok', html: `Correct: <code>${esc(format(got.value))}</code>.` + tip };
        }
        // vars / statement: same result as the model answer for the given values AND the test values
        const envs = [given, ...(ex.tests || []).map(t => envFrom(ex.vars, t))];
        let usedAny = false;
        for (const env of envs) {
          const expected = evaluate(ref, env).value;
          const got = evaluate(value, env);
          if (part.mode === 'statement' && got.assignTo !== part.target) {
            return { status: 'bad', html: got.statement
              ? `This stores the result in <code>${esc(got.assignTo)}</code>. The task: change <code>${part.target}</code> itself.`
              : `This computes the new value — and then throws it away. Store it: <code>${part.target} = …;</code>` };
          }
          if (got.usedVars.size) usedAny = true;
          if (!sameValue(got.value, expected)) {
            const where = env === given ? 'With the example values' : `With ${describeEnv(env)}`;
            const onlyExample = env !== given && !intDivHint(got.value, expected)
              ? ' It works for the example, but not for other values → is a number in it that should be a variable?' : '';
            return { status: 'bad', html: `${where}, your expression gives <code>${esc(format(got.value))}</code> — expected <code>${esc(format(expected))}</code>.` + intDivHint(got.value, expected) + onlyExample };
          }
        }
        if (!usedAny && Object.keys(ex.vars || {}).length) {
          return { status: 'bad', html: `This uses no variables → it only works for the example. Use ${Object.keys(ex.vars).map(n => `<code>${n}</code>`).join(', ')}.` };
        }
        return { status: 'ok', html: `Correct — also with ${describeEnv(envFrom(ex.vars, (ex.tests || [])[0]))}.` };
      } catch (e) {
        if (e instanceof window.JavaEval.JavaError) return { status: 'bad', html: `This does not work in Java: ${esc(e.message)}` };
        throw e;
      }
    },

    value(ex, part, value) {
      const v = (value || '').trim();
      if (!v) return null;
      if (typeof part.answer === 'number') {
        const n = Number(v.replace(/[dD]$/, ''));
        if (Number.isNaN(n)) return { status: 'bad', html: 'Enter a number.' };
        return Math.abs(n - part.answer) < 1e-9 ? { status: 'ok', html: 'Correct!' } : { status: 'bad', html: 'Not quite — trace it again step by step.' };
      }
      return v.toLowerCase() === String(part.answer).toLowerCase() ? { status: 'ok', html: 'Correct!' } : { status: 'bad', html: 'Not quite.' };
    },

    seq(ex, part, value) {
      const got = splitSeq(value);
      if (!got.length) return null;
      if (got.join(' ') === part.answer.join(' ')) return { status: 'ok', html: 'Correct!' };
      if (got.length !== part.answer.length) return { status: 'bad', html: `Not quite — expected ${part.answer.length} value${part.answer.length > 1 ? 's' : ''}, you have ${got.length}.` };
      return { status: 'bad', html: 'Not quite — trace it again step by step.' };
    },

    seqtable(ex, part, value) {
      const cells = value || {};
      let filled = 0, right = 0, total = 0;
      part.answers.forEach((row, r) => row.forEach((ans, c) => {
        total++;
        const got = splitSeq(cells[`${r}:${c}`]);
        if (got.length) filled++;
        if (got.join(' ') === splitSeq(ans).join(' ')) right++;
      }));
      if (!filled) return null;
      if (right === total) return { status: 'ok', html: 'All correct!' };
      return { status: 'bad', html: `${right} of ${total} correct — the wrong cells are marked.` };
    },

    choice(ex, part, value) {
      if (value == null || value === '') return null;
      return Number(value) === part.answer ? { status: 'ok', html: 'Correct!' } : { status: 'bad', html: 'Not quite.' };
    },

    lines(ex, part, value) {
      const got = (value || '').split('\n').map(s => s.trim());
      while (got.length && !got[got.length - 1]) got.pop();
      if (!got.length) return null;
      const exp = part.answer;
      const wrong = [];
      for (let i = 0; i < Math.max(got.length, exp.length); i++) if (got[i] !== exp[i]) wrong.push(i + 1);
      if (!wrong.length) return { status: 'ok', html: 'Correct!' };
      return { status: 'bad', html: `Not quite — check line${wrong.length > 1 ? 's' : ''} ${wrong.join(', ')}` + (got.length !== exp.length ? ` (the output has ${exp.length} lines).` : '.') };
    },
  };
  const AUTO = new Set(Object.keys(CHECK));

  function splitSeq(s) {
    return String(s || '').replace(/[\[\]{}]/g, ' ').split(/[\s,;]+/).filter(Boolean);
  }

  function partSolutionHtml(ex, part) {
    switch (part.kind) {
      case 'line': return `<pre class="code">${highlight(part.solution)}</pre>`;
      case 'expr': {
        const s = part.solution || (part.mode === 'example' ? ex.exampleSolution : (part.ref || ex.ref));
        return `<pre class="code">${highlight(s)}</pre>`;
      }
      case 'value': return `<code>${esc(String(part.answer))}</code>`;
      case 'seq': return `<code>${esc(part.answer.join(', '))}</code>`;
      case 'choice': return part.options[part.answer];
      case 'lines': return `<pre class="code">${esc(part.answer.join('\n'))}</pre>`;
      case 'free': return part.solution;
      default: return '';
    }
  }

  // ------------------------------------------------------------ status
  function partStatus(ex, i) { return state.results[partKey(ex, i)] || null; }
  function exStatus(ex) {
    const st = ex.parts.map((p, i) => partStatus(ex, i));
    if (st.every(s => s === 'ok' || s === 'self-ok')) return 'done';
    if (st.some(s => s === 'bad' || s === 'self-bad')) return 'retry';
    if (st.some(Boolean) || ex.parts.some((p, i) => hasAnswer(state.answers[partKey(ex, i)]))) return 'started';
    return 'todo';
  }
  function hasAnswer(a) {
    if (a == null || a === '') return false;
    if (typeof a === 'object') return Object.values(a).some(v => String(v).trim());
    return String(a).trim() !== '';
  }
  const STATUS_LABEL = { done: 'done', retry: 'try again', started: 'started', todo: 'not started' };

  // ------------------------------------------------------------ rendering: parts
  function renderPart(ex, part, i, ctx) {
    const key = partKey(ex, i);
    const box = el('div', 'part part-' + part.kind);
    const defaultLabel = part.kind === 'expr'
      ? (part.mode === 'example' ? 'Example' : part.mode === 'statement' ? 'With variables (a statement)' : 'With variables') : '';
    const label = part.label || defaultLabel;
    if (label) box.appendChild(el('div', 'part-label', label));

    const fb = el('div', 'feedback');
    const sol = el('div', 'solution');
    sol.hidden = true;
    const self = el('div', 'selfmark');
    self.hidden = true;

    const saved = state.answers[key];
    const setAnswer = v => { state.answers[key] = v; save(); updateNav(); };
    let getValue;

    // — inputs
    if (part.kind === 'line' || part.kind === 'expr' || part.kind === 'value' || part.kind === 'seq') {
      const input = el('input', 'answer' + (part.kind === 'value' || part.kind === 'seq' ? ' short' : ' mono'));
      input.type = 'text';
      input.spellcheck = false;
      input.autocomplete = 'off';
      input.autocapitalize = 'off';
      input.setAttribute('autocorrect', 'off');
      input.setAttribute('aria-label', (label || ex.id).replace(/<[^>]+>/g, ''));
      if (part.kind === 'seq') input.placeholder = 'e.g., 1, 2, 3';
      if (part.kind === 'line') input.placeholder = 'one line of Java';
      if (part.kind === 'expr') input.placeholder = part.mode === 'example' ? 'with the numbers' : part.mode === 'statement' ? 'a statement' : 'with the variables';
      input.value = saved || '';
      input.addEventListener('input', () => setAnswer(input.value));
      input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); ctx.checkAll(); } });
      getValue = () => input.value;
      box.appendChild(input);
    } else if (part.kind === 'seqtable') {
      const values = (saved && typeof saved === 'object') ? { ...saved } : {};
      const table = el('table', 'seqtable');
      table.innerHTML = `<thead><tr><th></th>${part.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>`;
      const tbody = el('tbody');
      tbody.appendChild(el('tr', 'start', `<th>start</th>${part.cols.map(() => `<td><code>${esc(part.start)}</code></td>`).join('')}`));
      part.rows.forEach((rowLabel, r) => {
        const tr = el('tr');
        tr.appendChild(el('th', null, esc(rowLabel)));
        part.cols.forEach((col, c) => {
          const td = el('td');
          const input = el('input', 'answer mono cell');
          input.type = 'text'; input.spellcheck = false; input.autocomplete = 'off';
          input.setAttribute('aria-label', `${col}, ${rowLabel}`);
          input.dataset.cell = `${r}:${c}`;
          input.value = values[`${r}:${c}`] || '';
          input.addEventListener('input', () => { values[`${r}:${c}`] = input.value; setAnswer({ ...values }); });
          td.appendChild(input);
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      const scroller = el('div', 'table-scroll');
      scroller.appendChild(table);
      box.appendChild(scroller);
      getValue = () => values;
      ctx.markCells = ctx.markCells || [];
      ctx.markCells.push(() => {
        table.querySelectorAll('input.cell').forEach(inp => {
          const [r, c] = inp.dataset.cell.split(':').map(Number);
          const got = splitSeq(inp.value);
          inp.classList.toggle('cell-ok', got.length > 0 && got.join(' ') === splitSeq(part.answers[r][c]).join(' '));
          inp.classList.toggle('cell-bad', got.length > 0 && got.join(' ') !== splitSeq(part.answers[r][c]).join(' '));
        });
      });
    } else if (part.kind === 'choice') {
      const group = el('div', 'choices');
      const name = 'c-' + key.replace(/\W/g, '-');
      part.options.forEach((opt, j) => {
        const lab = el('label', 'choice');
        const input = el('input');
        input.type = 'radio'; input.name = name; input.value = String(j);
        input.checked = saved != null && Number(saved) === j;
        input.addEventListener('change', () => setAnswer(j));
        lab.appendChild(input);
        lab.appendChild(el('span', null, opt));
        group.appendChild(lab);
      });
      box.appendChild(group);
      getValue = () => { const c = group.querySelector('input:checked'); return c ? c.value : ''; };
    } else if (part.kind === 'lines' || part.kind === 'free' || part.kind === 'code') {
      const ta = el('textarea', 'answer' + (part.kind === 'free' ? '' : ' mono'));
      ta.spellcheck = part.kind === 'free';
      ta.rows = part.kind === 'lines' ? part.answer.length + 1 : part.kind === 'free' ? 2 : Math.max(8, (part.starter || '').split('\n').length + 6);
      ta.setAttribute('aria-label', (label || ex.id).replace(/<[^>]+>/g, ''));
      if (part.kind === 'free') ta.placeholder = 'in your own words';
      ta.value = saved != null ? saved : (part.starter || '');
      ta.addEventListener('input', () => setAnswer(ta.value));
      if (part.kind === 'code') enableCodeEditing(ta);
      getValue = () => ta.value;
      box.appendChild(ta);
    }

    // — solution content
    if (part.kind === 'code') {
      sol.appendChild(el('div', 'sol-title', 'Model solution'));
      sol.appendChild(codeBlock(part.solution));
      if (part.given) {
        const d = el('details', 'test');
        d.innerHTML = '<summary>The given class</summary>';
        d.appendChild(codeBlock(part.given));
        sol.appendChild(d);
      }
      if (part.test) {
        const d = el('details', 'test');
        d.innerHTML = '<summary>Test it in VS Code</summary><p>Copy this file, add your code, and run it. Every line should show the same value twice.</p>';
        const btn = el('button', 'btn small', 'Copy test file');
        btn.type = 'button';
        btn.addEventListener('click', () => copyText(part.test, btn));
        d.appendChild(btn);
        d.appendChild(codeBlock(part.test));
        sol.appendChild(d);
      }
      if (part.testNote) sol.appendChild(el('p', 'test-note', '<strong>Test it in VS Code:</strong> ' + part.testNote));
    } else if (part.kind === 'paper') {
      sol.appendChild(el('div', 'sol-title', 'Model solution'));
      sol.appendChild(umlDiagram(part.solutionUml));
      if (part.solutionNote) sol.appendChild(el('p', 'sol-note', part.solutionNote));
    } else if (part.kind === 'seqtable') {
      const t = el('table', 'seqtable solution-table');
      t.innerHTML = `<thead><tr><th></th>${part.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>` +
        part.rows.map((r, ri) => `<tr><th>${esc(r)}</th>${part.answers[ri].map(a => `<td><code>${esc(a)}</code></td>`).join('')}</tr>`).join('') + '</tbody>';
      const sc = el('div', 'table-scroll'); sc.appendChild(t);
      sol.appendChild(el('div', 'sol-title', 'Model solution'));
      sol.appendChild(sc);
    } else {
      sol.appendChild(el('div', 'sol-title', 'Model answer'));
      sol.appendChild(el('div', 'sol-body', partSolutionHtml(ex, part)));
    }

    // — self-marking (for code, free, paper, and line answers that differ from the model)
    const selfOk = el('button', 'btn small good', part.kind === 'code' ? '✓ Mine works the same way' : '✓ Mine is equivalent');
    const selfBad = el('button', 'btn small', '✗ Not yet — I’ll redo it');
    selfOk.type = selfBad.type = 'button';
    self.appendChild(el('span', 'selfmark-q', 'Your verdict:'));
    self.appendChild(selfOk);
    self.appendChild(selfBad);
    const setSelf = v => {
      state.results[key] = v; save(); updateNav();
      selfOk.classList.toggle('active', v === 'self-ok');
      selfBad.classList.toggle('active', v === 'self-bad');
      box.dataset.status = v;
    };
    selfOk.addEventListener('click', () => setSelf('self-ok'));
    selfBad.addEventListener('click', () => setSelf('self-bad'));

    const showSolution = () => {
      sol.hidden = false;
      if (!AUTO.has(part.kind) || state.results[key] === 'review' || state.results[key] === 'self-ok' || state.results[key] === 'self-bad') {
        self.hidden = false;
      }
    };

    // per-part reveal button for parts that are not auto-checked
    if (!AUTO.has(part.kind)) {
      const bar = el('div', 'part-actions');
      const reveal = el('button', 'btn small', part.kind === 'paper' ? 'Show solution' : 'Compare with the solution');
      reveal.type = 'button';
      reveal.addEventListener('click', () => { showSolution(); reveal.hidden = true; });
      bar.appendChild(reveal);
      box.appendChild(bar);
      const st = state.results[key];
      if (st === 'self-ok' || st === 'self-bad') { showSolution(); reveal.hidden = true; setSelf(st); }
    }

    box.appendChild(fb);
    box.appendChild(sol);
    box.appendChild(self);

    // — check (auto kinds)
    const check = (silent) => {
      if (!AUTO.has(part.kind)) return null;
      const res = CHECK[part.kind](ex, part, getValue());
      (ctx.markCells || []).forEach(f => f());
      if (!res) {
        if (!silent) { fb.className = 'feedback info'; fb.innerHTML = 'Write an answer first.'; }
        return null;
      }
      const prev = state.results[key];
      let status = res.status;
      // keep the student's own verdict while the answer is unchanged
      if (status === 'review' && (prev === 'self-ok' || prev === 'self-bad') && silent) status = prev;
      fb.className = 'feedback ' + (res.status === 'ok' ? 'ok' : res.status === 'bad' ? 'bad' : 'info');
      fb.innerHTML = (res.status === 'ok' ? '✓ ' : res.status === 'bad' ? '✗ ' : '≈ ') + res.html;
      if (res.status === 'review') {
        sol.hidden = false; self.hidden = false;
        if (status === 'self-ok' || status === 'self-bad') setSelf(status);
        else { selfOk.classList.remove('active'); selfBad.classList.remove('active'); }
      } else {
        self.hidden = true;
      }
      if (status !== 'review' || !silent) state.results[key] = status;
      if (!silent) save();
      box.dataset.status = status;
      return status;
    };

    ctx.parts.push({ part, check, showSolution, isAuto: AUTO.has(part.kind) });
    // restore feedback for answers that were checked before
    if (AUTO.has(part.kind) && state.results[key]) check(true);
    return box;
  }

  // Tab inserts spaces; Enter keeps the indentation
  function enableCodeEditing(ta) {
    ta.addEventListener('keydown', e => {
      const { selectionStart: s, selectionEnd: end, value } = ta;
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        ta.setRangeText('    ', s, end, 'end');
        ta.dispatchEvent(new Event('input'));
      } else if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey) {
        const lineStart = value.lastIndexOf('\n', s - 1) + 1;
        const indent = /^[ \t]*/.exec(value.slice(lineStart, s))[0];
        const extra = /[{(]\s*$/.test(value.slice(lineStart, s)) ? '    ' : '';
        e.preventDefault();
        ta.setRangeText('\n' + indent + extra, s, end, 'end');
        ta.dispatchEvent(new Event('input'));
      }
    });
  }

  // ------------------------------------------------------------ rendering: pages
  const main = $('#main');

  function renderHome() {
    document.title = 'Catch-Up Practice — CMPINF 0401';
    main.innerHTML = '';
    const intro = el('section', 'intro');
    intro.innerHTML = `
      <h1>Catch-up practice</h1>
      <p class="lead">All topics of Midterm 1 &amp; Midterm 2 — from one-liners to exam level.</p>
      <div class="howto">
        <h2>How to use this page</h2>
        <ul>
          <li>Pick a section and solve the exercises <strong>on your own</strong> first — on paper or in your head.</li>
          <li>Then type your answer and press <kbd>Check</kbd>. Short answers are checked right away; for methods and classes, you compare with the model solution — and test it in VS Code.</li>
          <li>Stuck? Go back to the matching part of the <a href="catch-up.pdf" target="_blank" rel="noopener">cheat sheet (PDF)</a>.</li>
          <li>A wrong attempt is a great starting point — a blank page is not.</li>
        </ul>
        <p class="small">Your answers and progress are saved in this browser only (nothing is sent anywhere).</p>
      </div>`;
    main.appendChild(intro);

    const grid = el('section', 'cards');
    SECTIONS.forEach(sec => {
      const list = EXERCISES.filter(e => e.section === sec.id);
      const done = list.filter(e => exStatus(e) === 'done').length;
      const card = el('a', 'card');
      card.href = '#/' + list[0].id;
      card.innerHTML = `
        <div class="card-top"><span class="badge">${sec.id}</span><span class="time">⏳ ${esc(sec.time)}</span></div>
        <h3>${esc(sec.title)}</h3>
        ${sec.exam ? `<div class="exam">${esc(sec.exam)}</div>` : ''}
        <div class="progress"><div style="width:${(100 * done / list.length).toFixed(0)}%"></div></div>
        <div class="count">${done} / ${list.length} done</div>`;
      grid.appendChild(card);
    });
    main.appendChild(grid);

    const check = el('section', 'checklist');
    check.innerHTML = '<h2>Summary — Midterm 1 &amp; 2 topics</h2><p>Check off what you can do <em>without</em> the cheat sheet:</p>';
    const ul = el('ul');
    CHECKLIST.forEach((item, i) => {
      const li = el('li');
      const lab = el('label');
      const cb = el('input');
      cb.type = 'checkbox';
      cb.checked = !!state.checklist[i];
      cb.addEventListener('change', () => { state.checklist[i] = cb.checked; save(); });
      lab.appendChild(cb);
      lab.appendChild(el('span', null, item));
      li.appendChild(lab);
      ul.appendChild(li);
    });
    check.appendChild(ul);
    const reset = el('button', 'btn small subtle', 'Reset all answers and progress');
    reset.type = 'button';
    reset.addEventListener('click', () => {
      if (confirm('Delete all your answers and progress on this page?')) {
        state = { answers: {}, results: {}, checklist: {} };
        try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
        render();
      }
    });
    check.appendChild(reset);
    main.appendChild(check);
  }

  function renderExercise(ex) {
    const sec = sectionOf(ex.section);
    const idx = exIndex(ex.id);
    const inSection = EXERCISES.filter(e => e.section === ex.section);
    const posInSection = inSection.indexOf(ex) + 1;
    document.title = `${ex.id} — Catch-Up Practice`;
    main.innerHTML = '';

    const head = el('div', 'ex-head');
    head.innerHTML = `
      <div class="crumbs"><a href="#/">Overview</a> › <span class="badge">${sec.id}</span> [Practice] ${esc(sec.title)}
        <span class="time">⏳ ${esc(sec.time)}</span>${sec.exam ? `<span class="exam">${esc(sec.exam)}</span>` : ''}</div>`;
    main.appendChild(head);

    // section task: shown on every exercise of the section, collapsed after the first one
    const task = el('details', 'task');
    task.open = posInSection === 1;
    task.innerHTML = `<summary><strong>Task</strong> (all of ${sec.id})</summary><div>${sec.task}</div>`;
    if (sec.code) task.querySelector('div').appendChild(codeBlock(sec.code));
    if (sec.id === 'E') task.querySelector('div').appendChild(el('p', 'legend', '<span class="swatch"></span> you implement it'));
    main.appendChild(task);

    const card = el('article', 'exercise');
    card.appendChild(el('h1', null, `${ex.id}${ex.title ? ' ' + esc(ex.title) : ''} <span class="of">${posInSection} / ${inSection.length}</span>`));
    if (ex.body) card.appendChild(el('div', 'ex-body', ex.body));

    const visual = el('div', 'ex-visual' + (ex.uml && ex.code ? ' two' : ''));
    if (ex.uml) visual.appendChild(umlDiagram(ex.uml));
    if (ex.code) visual.appendChild(codeBlock(ex.code, ex.codeLang));
    if (ex.code || ex.uml) card.appendChild(visual);

    if (ex.vars && Object.keys(ex.vars).length && ex.section === 'B') {
      card.appendChild(el('div', 'given', `Given: ${describeEnv(envFrom(ex.vars))}`));
    }

    const ctx = { parts: [] };
    const partsBox = el('div', 'parts' + (ex.section === 'B' ? ' parts-b' : ''));
    ctx.checkAll = () => checkAll();
    ex.parts.forEach((part, i) => partsBox.appendChild(renderPart(ex, part, i, ctx)));
    card.appendChild(partsBox);

    const note = el('div', 'note', ex.note ? '💡 ' + ex.note : '');
    note.hidden = true;
    card.appendChild(note);

    const actions = el('div', 'actions');
    const hasAuto = ctx.parts.some(p => p.isAuto);
    const checkBtn = el('button', 'btn primary', 'Check');
    checkBtn.type = 'button';
    const solBtn = el('button', 'btn', 'Show solution');
    solBtn.type = 'button';
    function checkAll() {
      const res = ctx.parts.map(p => p.check(false));
      updateNav();
      if (ex.note && res.some(r => r)) note.hidden = false;
    }
    checkBtn.addEventListener('click', checkAll);
    solBtn.addEventListener('click', () => {
      ctx.parts.forEach(p => p.showSolution());
      note.hidden = !ex.note;
    });
    if (hasAuto) actions.appendChild(checkBtn);
    actions.appendChild(solBtn);
    card.appendChild(actions);
    if (ex.note && ex.parts.every((p, i) => partStatus(ex, i))) note.hidden = false;

    main.appendChild(card);

    const pager = el('nav', 'pager');
    const prev = EXERCISES[idx - 1], next = EXERCISES[idx + 1];
    pager.innerHTML = (prev ? `<a class="btn" href="#/${prev.id}">← ${prev.id}</a>` : '<span></span>') +
      (next ? `<a class="btn primary-outline" href="#/${next.id}">${next.id} →</a>` : '<a class="btn primary-outline" href="#/">Back to the overview</a>');
    main.appendChild(pager);
  }

  const CHECKLIST = [
    'You can map UML attributes and methods to Java — and back (order of name / type!)',
    'You can implement a class with private attributes, a constructor (<code>this.</code>), getters, and <code>toString()</code>',
    'You can write a method header: return type, <code>static</code> or not, array parameters',
    'You can declare, create, and fill 1D and 2D arrays — and know <code>grid.length</code> (rows) vs. <code>grid[i].length</code> (columns of row <code>i</code>)',
    'You can traverse a 1D array and each row of a 2D array (sum, count, maximum, average)',
    'You can predict <code>int</code> vs. <code>double</code> results — and fix integer division (<code>.0</code> or cast)',
    'You can translate a problem statement (discount, tax, percent, average, overtime) into a Java expression',
    'You can implement a subclass from UML: <code>extends</code>, <code>super(…)</code>, <code>@Override</code>, <code>super.method()</code>',
    'You can read input with a <code>Scanner</code> (incl. the extra <code>nextLine()</code>) and print with <code>print</code>, <code>println</code>, and <code>printf</code>',
    'You can compare Strings with <code>equals</code> and explain references, <code>null</code>, and <code>static</code>',
    'You can catch an exception with <code>try</code>/<code>catch</code> and name the common runtime exceptions',
    'You can trace SelectionSort, BubbleSort, InsertionSort, and binary search pass by pass',
    'You can give the Big-O of a loop, a nested loop, and a halving loop',
    'You can trace <code>push</code>/<code>pop</code>/<code>top</code> on a stack and <code>enqueue</code>/<code>dequeue</code> on a queue',
  ];

  // ------------------------------------------------------------ sidebar
  const nav = $('#nav');
  function buildNav() {
    nav.innerHTML = '';
    SECTIONS.forEach(sec => {
      const group = el('div', 'nav-group');
      group.appendChild(el('a', 'nav-section', `<span class="badge">${sec.id}</span> ${esc(sec.title)}`)).href = '#/' + EXERCISES.find(e => e.section === sec.id).id;
      const chips = el('div', 'chips');
      EXERCISES.filter(e => e.section === sec.id).forEach(ex => {
        const a = el('a', 'chip', ex.id.split('.')[1]);
        a.href = '#/' + ex.id;
        a.dataset.id = ex.id;
        a.title = ex.id + (ex.title ? ' ' + ex.title : '');
        chips.appendChild(a);
      });
      group.appendChild(chips);
      nav.appendChild(group);
    });
    updateNav();
  }
  function updateNav() {
    const current = location.hash.replace(/^#\/?/, '');
    let done = 0;
    nav.querySelectorAll('.chip').forEach(a => {
      const ex = EXERCISES[exIndex(a.dataset.id)];
      const st = exStatus(ex);
      if (st === 'done') done++;
      a.className = 'chip ' + st + (a.dataset.id === current ? ' current' : '');
      a.setAttribute('aria-label', `${ex.id}: ${STATUS_LABEL[st]}`);
    });
    $('#progress-text').textContent = `${done} / ${EXERCISES.length} done`;
    $('#progress-bar').style.width = (100 * done / EXERCISES.length) + '%';
  }

  // ------------------------------------------------------------ routing
  function render() {
    const id = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    const ex = EXERCISES[exIndex(id)];
    if (ex) renderExercise(ex); else renderHome();
    updateNav();
    document.body.classList.remove('nav-open');
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', render);
  $('#menu-btn').addEventListener('click', () => document.body.classList.toggle('nav-open'));

  buildNav();
  render();
})();
