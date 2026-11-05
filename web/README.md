# Catch-up practice website

A static website for the practice part (Part 2) of the catch-up pack: students can work on each exercise on their own and check their answers.

No build step and no dependencies: plain HTML, CSS, and JavaScript. Answers and progress are saved in the student's browser (`localStorage`). Nothing is sent anywhere.

| File | Contents |
|---|---|
| `index.html`, `style.css` | Page and layout (light and dark mode, works on phones) |
| `js/exercises.js` | **All exercises, answers, and solutions.** Edit this file to change an exercise. |
| `js/java-eval.js` | Small evaluator for Java expressions (int/double/boolean, int division, casts) used to check Part B |
| `js/app.js` | Rendering, checking, and progress |
| `catch-up.pdf` | The student PDF, used as the cheat sheet. `make.sh` copies it here (never the solutions PDF). |

## How exercises are checked

| Section | Check |
|---|---|
| A, C.7(a), F (corrected line) | Compared with the accepted answers. Spacing doesn't matter, and the final `;` / `{` is optional. Known mistakes such as `new int[4][3]` or `answer == "yes"` get a targeted message. Any other answer: the student compares it with the model answer and marks it themselves. |
| B, E.2/E.3 step 1 | The expression is **evaluated** with the example values *and* with other values. This catches int division, hard-coded numbers, and a missing assignment (B.9). |
| D | Number lists, choices, and output lines are compared exactly. |
| C, E (code), F (explanation), E.5(a) | The student compares with the model solution and marks it themselves. C and E come with a test file for VS Code that prints `actual   (expected …)`. |

Every model solution was compiled and run with its test file.

## Keep it in sync with the PDF

`js/exercises.js` is a separate copy of Part 2 of `catch-up.tex`, which is one folder above this repository. When you change an exercise in the `.tex`, change it here too, then run `./make.sh` (repo root) to rebuild the PDFs and refresh `web/catch-up.pdf`.

## Publishing

`.github/workflows/pages.yml` publishes `web/` to GitHub Pages on every push to `main`. It first checks that:

- the JavaScript parses
- every model answer passes its own check
- `web/` contains the student PDF and no solutions file

The site contains all solutions (behind "Show solution"). This is intended for self-study, but don't reuse these exercises for graded work.

**Preview locally:** open `index.html` in a browser, or run `python3 -m http.server` in this folder.
