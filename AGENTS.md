# AGENTS.md: catch-up practice

This repository is the practice website for Part 2 of the catch-up pack. It is a
companion to Java Foundations (<https://github.com/pitt-0401/java-foundations>)
and follows that project's rules. Read its `AGENTS.md` (writing, accessibility,
workflow) and `docs/design-guidelines.md` (visual design) before changing
student-facing text or styles. This file lists only what is different here.

## What is different from Java Foundations

- **Stack:** plain HTML, CSS, and JavaScript in `web/`, with no build step and no
  dependencies. Do not add a framework or a bundler.
- **Source of truth:** `web/js/exercises.js` is a copy of Part 2 of
  `catch-up.tex` (one folder above this repository, not committed). Change an
  exercise in both places. See `README.md`.
- **Styles:** `web/style.css` uses the Foundations token names and values
  (`--jf-*`). Do not invent new colors; add a token from Foundations' `extra.css`
  instead, and change a token in both repositories.
- **Layout:** its own header and sidebar instead of Material's tabs and question
  list. Exercises in the sidebar are small status boxes; their status is in the
  accessible name and `title`, never in color alone. Progress is a thin accent
  bar (a section has up to 22 exercises, too many for Foundations' ticks).
- **Solutions:** shown behind "Show solution" buttons drawn like Foundations'
  **Answers** button. `web/` must never contain a PDF (CI checks this).
- **Caching:** after changing `style.css` or a file in `web/js/`, raise the
  `?v=` number on its link in `web/index.html`.

## Writing

The Foundations writing rules apply: plain, direct sentences, contractions
spelled out ("does not"), no em dashes, no decorative emoji, sentence case for
titles. Feedback starts with a bold label: **✓ Correct.**, **✗ Incorrect.**, or
**Compare with the solution.**

## Checks

Run before every push (the same checks as `.github/workflows/pages.yml`):

- `node --check` on each file in `web/js/`
- the "Exercises load and every model answer passes its own check" script in
  `pages.yml`
- open `web/index.html` in light and dark mode and at 390 px width: no sideways
  scrolling of the page

Report which checks actually ran. Do not claim a check passed if it did not run.
