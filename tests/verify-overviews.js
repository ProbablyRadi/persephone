// Career overview regression checks. Run: node tests/verify-overviews.js
// Ensures real source data renders the expected table cells / boot brands.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = pathFromRoot => fs.readFileSync(path.join(root, pathFromRoot), 'utf8');
const context = vm.createContext({ console });

for (const file of ['data/base.js', 'data/definitions.js', 'data/rens.js', 'data/jordan.js', 'data/vasi.js']) {
    vm.runInContext(read(file), context, { filename: file });
}
const source = read('app.js');
const excerpt = (begin, end) => {
    const from = source.indexOf(begin);
    const to = source.indexOf(end, from);
    assert(from >= 0 && to > from, `Could not locate renderer ${begin}`);
    return source.slice(from, to);
};
vm.runInContext(
    'const esc = value => String(value).replace(/[&<>]/g, c => ({"&":"&amp;", "<":"&lt;", ">":"&gt;"})[c]);\n'
    + excerpt('function cleanClubLabel(', 'function careerGroups(')
    + excerpt('function careerStatsTable(', 'function player(')
    + excerpt('function infobox(', 'function honours('),
    context,
);

const unescape = value => value.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
function cellsOf(html, type) {
    return [...html.matchAll(new RegExp(`<tr class="career-stats-${type}">([\\s\\S]*?)<\\/tr>`, 'g'))]
        .map(match => [...match[1].matchAll(/<td[^>]*>(.*?)<\/td>/g)]
            .map(td => unescape(td[1])));
}
const snapshot = id => vm.runInContext(`careerStatsTable(DATA.${id})`, context);
const vasi = snapshot('vasi');
const vasiRows = cellsOf(vasi, 'season');
const expected = {
    '2025–26': [0, 9],
    '2026–27': [2, 11],
    '2027–28': [2, 12],
    '2028–29': ['—', '—'],
};
for (const [season, [potm, motm]] of Object.entries(expected)) {
    const row = vasiRows.find(cells => cells[1] === season);
    assert(row, `Vasi ${season}: season row missing`);
    assert.equal(row.length, 12, 'Career overview table must have 12 columns');
    assert.equal(row[0].includes('FC Barcelona Femení'), true, 'Vasi club must be visible');
    assert.equal(row[6], String(potm), `Vasi ${season}: POTM is blank/wrong`);
    assert.equal(row[7], String(motm), `Vasi ${season}: MOTM is blank/wrong`);
}
const vasiTotal = cellsOf(vasi, 'subtotal')[0];
assert(vasiTotal, 'Vasi career total row missing');
assert.equal(vasiTotal[6], '4', 'Vasi POTM total should be four');
assert.equal(vasiTotal[7], '32', 'Vasi MOTM total should be 32');

for (const id of ['rens', 'jordan', 'vasi']) {
    const html = snapshot(id);
    assert(html.includes('Player of the Month') && html.includes('Man of the Match'), `${id}: missing award headers`);
    assert.equal(cellsOf(html, 'season').length > 0, true, `${id}: no season rows`);
    assert(cellsOf(html, 'season').every(row => row.length === 12), `${id}: wrong column count`);
}
const jordanInfobox = vm.runInContext('infobox(DATA.jordan)', context);
assert.match(jordanInfobox, /<td>Boot brand<\/td>\s*<td>Nike<\/td>/,
    'Jordan Vale overview must show Nike for Boot brand');
assert(!jordanInfobox.includes('New Balance'), 'Jordan overview must not show New Balance');

// Confirm the browser gets a fresh asset request on deployment.
const html = read('index.html');
for (const sourceFile of ['data/vasi.js', 'data/jordan.js', 'app.js']) {
    const line = html.match(new RegExp(`<script src="${sourceFile.replace('.', '\\.')}(\\?v=[^"]+)"`));
    assert(line && line[1].length > 3, `Missing versioned script URL for ${sourceFile}`);
}
console.log('Vasi: 0/9, 2/11, 2/12; totals 4/32 — PASS');
console.log('Jordan: Overview boot brand Nike — PASS');
console.log('Rens/Jordan/Vasi: consistent 12-column overview tables — PASS');
console.log('Versioned JS assets — PASS');
