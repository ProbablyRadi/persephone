// Flag/nationality sorting regression check.
// Run from the website folder: node tests/verify-flag-sorting.js
// Tests the same country-name lookup for PNG flags and original emoji flags.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = vm.createContext({});
vm.runInContext(
    fs.readFileSync(path.join(root, 'data/definitions.js'), 'utf8'),
    context
);

const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const start = appSource.indexOf('function flagSortName(');
const end = appSource.indexOf('function enhanceTable(', start);
assert(start >= 0 && end > start, 'Flag sort helpers are missing');
vm.runInContext(appSource.slice(start, end), context);

const countryCases = [
    ['🇧🇪', 'Belgium'],
    ['🇳🇱', 'Netherlands'],
    ['🇵🇾', 'Paraguay'],
    ['🇬🇧', 'United Kingdom'],
];

// Model the two DOM states: before and after the flag image replacement.
function flagRow(emoji, imageRendered, className = 'player-nation') {
    const imagePath = vm.runInContext(`FLAG_ASSETS[${JSON.stringify(emoji)}]`, context);
    assert(imagePath, `Missing local image for ${emoji}`);
    const image = { getAttribute: attr => attr === 'src' ? imagePath : null };
    return {
        cells: [{
            dataset: {},
            textContent: imageRendered ? '' : emoji,
            classList: { contains: value => value === className },
            querySelector: selector => selector === 'img.country-flag' && imageRendered ? image : null,
        }]
    };
}

for (const [emoji, expectedCountry] of countryCases) {
    for (const className of ['player-nation', 'flag']) {
        for (const imageRendered of [false, true]) {
            context.row = flagRow(emoji, imageRendered, className);
            const actual = vm.runInContext('tableCellValue(row, 0)', context);
            assert.equal(actual, expectedCountry);
        }
    }
}

// Check sorting is alphabetical, not unchanged because every img has blank text.
for (const imageRendered of [false, true]) {
    const input = ['🇵🇾', '🇧🇪', '🇳🇱'];
    const names = input.map(emoji => {
        context.row = flagRow(emoji, imageRendered);
        return vm.runInContext('tableCellValue(row, 0)', context);
    });
    assert.deepEqual([...names].sort((a, b) => a.localeCompare(b)), [
        'Belgium', 'Netherlands', 'Paraguay'
    ]);
    assert.deepEqual([...names].sort((a, b) => b.localeCompare(a)), [
        'Paraguay', 'Netherlands', 'Belgium'
    ]);
}

console.log('Flag sorting: country names, PNG and emoji states, A–Z/Z–A — PASS');
