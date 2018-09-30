#!/bin/sh


r.js -o ./build/p5/build-js.js &&
cp src/p5.html out &&
cp lib/require.js out/js &&
cp -r src/css out &&
cp -r src/tiles out &&
cp -r src/fonts out