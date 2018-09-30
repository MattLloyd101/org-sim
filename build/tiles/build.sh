#!/bin/sh

.r.js -o ./build/tiles/build-js.js &&
cp src/tiles.html out &&
cp lib/require.js out/js &&
cp -r src/css out &&
cp -r src/tiles out &&
cp -r src/fonts out