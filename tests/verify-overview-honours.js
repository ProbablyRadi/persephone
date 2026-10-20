// Verify overview-page honours appear beside the career infobox rather than
// after the full-width statistics table. Run: node tests/verify-overview-honours.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const source = read('app.js');
const from = source.indexOf('function player(id) {');
const to = source.indexOf('function teamFlag(', from);
assert(from >= 0 && to > from, 'Player overview renderer not found');

const context = vm.createContext({ console });
for (const file of [
    'data/base.js', 'data/definitions.js', 'data/rens.js',
    'data/jordan.js', 'data/vasi.js',
]) {
    vm.runInContext(read(file), context, { filename: file });
}
vm.runInContext(`
    const app = { className: '', innerHTML: '' };
    const nav = { innerHTML: '' };
    const careerNavigator = () => '';
    const infobox = () => '<table class="infobox"></table>';
    const biographyLead = () => '<p class="lede">Biography</p>';
    const honours = player => '<div class="honours">'
        + Object.keys(player.honours).map(group => '<section>' + group + '</section>').join('')
        + '</div>';
    const careerStatsTable = () => '<table class="career-stats-table"></table>';
    ${source.slice(from, to)}
`, context);

for (const id of ['rens', 'jordan', 'vasi']) {
    vm.runInContext(`player('${id}')`, context);
    const html = vm.runInContext('app.innerHTML', context);
    const order = [
        'class="infobox"',
        'class="toc"',
        'class="profile-honours"',
        'id="honours"',
        'class="honours"',
        'class="clear"',
        'id="stats"',
        'class="career-stats-table"',
    ];
    let previous = -1;
    for (const token of order) {
        const position = html.indexOf(token);
        assert(position > previous, `${id}: section ${token} is missing or out of order`);
        previous = position;
    }
    assert.equal((html.match(/id="honours"/g) || []).length, 1,
        `${id}: Honours should be rendered once`);
    assert.equal((html.match(/class="honours"/g) || []).length, 1,
        `${id}: Honours lists should be rendered once`);
    assert(html.indexOf('href="#honours"') < html.indexOf('href="#stats"'),
        `${id}: contents links should follow visual order`);
    const groupCount = vm.runInContext(`Object.keys(DATA.${id}.honours).length`, context);
    assert.equal((html.match(/<section>/g) || []).length, groupCount,
        `${id}: an honours group was dropped`);
}
const css = read('styles.css');
assert(/\.profile-page \.profile-honours \.honours\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/m.test(css),
    'Overview honours must use a left-first two-column grid');
assert(/\.profile-page \.profile-honours \.honours\s*\{[^}]*columns:\s*unset;/m.test(css),
    'Legacy multi-column flow must be disabled for the overview');
assert(/\.profile-page \.profile-honours \.honours section:only-child\s*\{[^}]*grid-column:\s*1\s*\/\s*-1;/m.test(css),
    'A single honours group must begin on the left and use all available width');
assert(css.includes('.profile-page .profile-honours #honours'),
    'Sticky-header anchor offset is missing');
assert(/@media\s*\(max-width:\s*760px\)[\s\S]*?\.profile-page \.profile-honours \.honours\s*\{\s*grid-template-columns:\s*minmax\(0,\s*1fr\);/m.test(css),
    'Mobile honours should use one left-aligned grid column');
console.log('Rens, Jordan and Vasi: honours start left; statistics below — PASS');
