#!/bin/sh
set -e

DIST=./dist/libs/ddd-valueobjects

cp ./README.md "$DIST"
cp ./LICENSE "$DIST"

# Derive the published manifest from the root one: the package is published
# from $DIST, so entry points are relative to that directory, and workspace
# tooling has no place in the tarball.
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

delete pkg.scripts;
delete pkg.devDependencies;
delete pkg['lint-staged'];
delete pkg.jest;

pkg.main = 'index.js';
pkg.types = 'index.d.ts';

// Ship compiled output and declarations only: the .js.map files reference
// .ts sources that are not part of the tarball.
pkg.files = ['**/*.js', '**/*.d.ts', '!**/*.spec.js', '!**/*.spec.d.ts'];

fs.writeFileSync('$DIST/package.json', JSON.stringify(pkg, null, 2) + '\n');
"
