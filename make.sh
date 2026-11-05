#!/bin/sh
# Builds the catch-up pack (after M2, before M3):
#   catch-up.pdf             students: cheat sheet + practice with space to write
#   catch-up-solutions.pdf   same pages with every answer in red
#   web/catch-up.pdf         copy of catch-up.pdf for the practice website (web/)
# LaTeX's helper files go into build/.
# Every number in the solutions was checked by compiling and running the reference code on JDK 26.
cd "$(dirname "$0")"
TEX=..          # catch-up.tex and the two PDFs live one folder up
mkdir -p build
build() {  # $1 = output name, $2 = extra TeX before \input
  for pass in 1 2; do
    pdflatex -interaction=nonstopmode -halt-on-error -output-directory=build -jobname="$1" "$2\input{$TEX/catch-up}" >/dev/null \
      || { echo "LaTeX error, see build/$1.log"; exit 1; }
  done
  cp "build/$1.pdf" "$TEX/" && echo "built $TEX/$1.pdf"
}
build catch-up ""
build catch-up-solutions "\def\withsolutions{}"
# The practice website (web/) links the student PDF as its cheat sheet -- never the solutions.
cp "$TEX/catch-up.pdf" web/catch-up.pdf && echo "copied catch-up.pdf to web/"
