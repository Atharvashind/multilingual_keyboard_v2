/**
 * Build script — produces two dist files from src/keyboard.js:
 *   dist/keyboard.umd.js  — browser <script> tag / CommonJS require()
 *   dist/keyboard.esm.js  — ES module import (Vite, webpack, Rollup, etc.)
 *   dist/keyboard.js      — UMD alias for backwards compatibility
 *
 * Run: node build.js
 */
const fs  = require('fs');
const path = require('path');
const pkg  = require('./package.json');

let src = fs.readFileSync(path.join(__dirname, 'src', 'keyboard.js'), 'utf8');

// Strip everything from the module-exports block onwards
// (the marker line starts with the box-drawing dashes comment)
const markerIndex = src.indexOf('// \u2500\u2500\u2500 Module exports');
if (markerIndex !== -1) src = src.slice(0, markerIndex).trimEnd();

const banner = [
    '/**',
    ` * multilanguage-keyboard v${pkg.version}`,
    ` * ${pkg.description}`,
    ` * License: ${pkg.license}`,
    ` * Built: ${new Date().toISOString()}`,
    ' */',
].join('\n');

// ── UMD ──────────────────────────────────────────────────────────────────────
const umd = `${banner}
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? module.exports = factory()
        : typeof define === 'function' && define.amd
            ? define(factory)
            : (global.MultiLanguageKeyboard = factory());
}(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
    'use strict';
${src.split('\n').map(l => '    ' + l).join('\n')}
    return MultiLanguageKeyboard;
}));
`;

// ── ESM ──────────────────────────────────────────────────────────────────────
const esm = `${banner}
${src}

export default MultiLanguageKeyboard;
`;

fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'dist', 'keyboard.umd.js'), umd, 'utf8');
fs.writeFileSync(path.join(__dirname, 'dist', 'keyboard.esm.js'), esm, 'utf8');
fs.copyFileSync(
    path.join(__dirname, 'dist', 'keyboard.umd.js'),
    path.join(__dirname, 'dist', 'keyboard.js')
);

console.log('✓ dist/keyboard.umd.js');
console.log('✓ dist/keyboard.esm.js');
console.log('✓ dist/keyboard.js  (UMD alias)');
