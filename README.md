# Catch-up practice website

[![Publish practice website](https://github.com/pitt-0401/java-syntax-exercises/actions/workflows/pages.yml/badge.svg)](https://github.com/pitt-0401/java-syntax-exercises/actions/workflows/pages.yml)

**Website:** <https://pitt-0401.github.io/java-syntax-exercises/>. Start there.

A static website with Java practice exercises: students work on each exercise on their own and check their answers.

No build step and no dependencies: plain HTML, CSS, and JavaScript. Answers and progress are saved in the student's browser (`localStorage`). Nothing is sent anywhere.

| File | Contents |
|---|---|
| `web/index.html`, `web/style.css` | Page and layout (light and dark mode, works on phones) |
| `web/js/exercises.js` | **All exercises, answers, and solutions.** Edit this file to change an exercise. |
| `web/js/java-eval.js` | Small evaluator for Java expressions (int/double/boolean, int division, casts) used to check Part B |
| `web/js/app.js` | Rendering, checking, and progress |

The site follows the design of the companion site, Java Foundations
(<https://pitt-0401.github.io/java-foundations/>): same fonts, colors, code
style, buttons, and writing rules. Its `docs/design-guidelines.md` is the
reference; `AGENTS.md` lists the few places where this site differs.

After changing `style.css` or a file in `web/js/`, raise the `?v=` number on
its link in `index.html`, so browsers load the new version.

## How exercises are checked

| Section | Check |
|---|---|
| A, C.11(b), F (corrected or missing line) | Compared with the accepted answers. Spacing does not matter, and the final `;` / `{` is optional. Known mistakes such as `title = title;` or `new int[names.length]` get a targeted message. Any other answer: the student compares it with the sample solution and marks it themselves. |
| B, E.2 step 1, E.3 step 1 | The expression is **evaluated** with the given values *and* with other values (step 1 of E.2 uses only the given numbers). This catches int division, hard-coded numbers, and a missing assignment (B.10). |
| C.11(a), D, E.5, F.7 (where the line goes) | Numbers are compared as numbers (`6` and `6.0` both count). Number lists ignore brackets and commas, so `[1, 2, 3]` and `1 2 3` both count. Choices must match. Output lines are compared line by line; spaces at the start and end of a line do not matter. |
| C, E (code), F (explanation) | The student compares with the sample solution and marks it themselves. Most code parts come with a test file for VS Code that prints `actual   (expected …)`. C.13 and E.6(b) have a short note on how to run them instead. The test is shown before the solution, so students run their own code first. |

Every sample solution was compiled and run, with its test file where there is one.

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
