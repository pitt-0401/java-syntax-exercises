# Catch-up practice website

[![Publish practice website](https://github.com/pitt-0401/java-syntax-exercises/actions/workflows/pages.yml/badge.svg)](https://github.com/pitt-0401/java-syntax-exercises/actions/workflows/pages.yml)

**Website:** <https://pitt-0401.github.io/java-syntax-exercises/>. Start there.

A static website for the practice part (Part 2) of the catch-up pack: students can work on each exercise on their own and check their answers.

No build step and no dependencies: plain HTML, CSS, and JavaScript. Answers and progress are saved in the student's browser (`localStorage`). Nothing is sent anywhere.

| File | Contents |
|---|---|
| `web/index.html`, `web/style.css` | Page and layout (light and dark mode, works on phones) |
| `web/js/exercises.js` | **All exercises, answers, and solutions.** Edit this file to change an exercise. |
| `web/js/java-eval.js` | Small evaluator for Java expressions (int/double/boolean, int division, casts) used to check Part B |
| `web/js/app.js` | Rendering, checking, and progress |
| `make.sh` | Builds the printed catch-up pack from `catch-up.tex` (one folder above this repository). Its output stays outside the repository and is not published. |

The site follows the design of the companion site, Java Foundations
(<https://pitt-0401.github.io/java-foundations/>): same fonts, colors, code
style, buttons, and writing rules. Its `docs/design-guidelines.md` is the
reference; `AGENTS.md` lists the few places where this site differs.

After changing `style.css` or a file in `web/js/`, raise the `?v=` number on
its link in `index.html`, so browsers load the new version.

## How exercises are checked

| Section | Check |
|---|---|
| A, C.7(a), F (corrected line) | Compared with the accepted answers. Spacing does not matter, and the final `;` / `{` is optional. Known mistakes such as `new int[4][3]` or `answer == "yes"` get a targeted message. Any other answer: the student compares it with the sample solution and marks it themselves. |
| B, E.2 step 1 | The expression is **evaluated** with the given values *and* with other values (step 1 of E.2 uses only the given numbers). This catches int division, hard-coded numbers, and a missing assignment (B.9). |
| D | Number lists, choices, and output lines are compared exactly. |
| C, E (code), F (explanation), E.5(a) | The student compares with the sample solution and marks it themselves. C and E come with a test file for VS Code that prints `actual   (expected …)`. |

Every sample solution was compiled and run with its test file.

## Keep it in sync with `catch-up.tex`

`web/js/exercises.js` is a separate copy of Part 2 of `catch-up.tex`, which is one folder above this repository. When you change an exercise in the `.tex`, change it here too, then run `./make.sh` to rebuild the printed pack.

## Publishing

`.github/workflows/pages.yml` publishes `web/` to
<https://pitt-0401.github.io/java-syntax-exercises/> on every push to `main`.
The badge at the top shows whether the last run passed. Before publishing, it
checks that:

- the JavaScript parses
- every sample solution passes its own check
- `web/` contains no PDF and no solutions file

The site contains all solutions (behind "Show solution"). This is intended for self-study, but do not reuse these exercises for graded work.

**Preview locally:** open `web/index.html` in a browser, or run `python3 -m http.server` in `web/`.

## License

[MIT](LICENSE)
