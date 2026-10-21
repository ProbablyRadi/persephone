// Competition Performance pages: cross-season standings and chart rendering.
// Run with: node tests/verify-competition-performance.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const source = read('app.js');
const start = source.indexOf('function performanceStandingsRows(');
const end = source.indexOf('function timelinePlayerKey(', start);
assert(start > 0 && end > start, 'Competition Performance functions must be present');

const context = vm.createContext({
    console,
    app: {
        className: '', innerHTML: '',
        querySelectorAll: () => []
    },
    nav: { innerHTML: '' },
    esc: text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    teamFlag: () => '',
    careerNavigator: () => 'NAV',
    ordinal: n => `${n}${n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'}`,
    cleanClubLabel: text => String(text).replace(/^\s*[\u{1F1E6}-\u{1F1FF}]{2}\s*/u, '').trim()
});
for (const file of ['base', 'definitions', 'rens', 'jordan', 'vasi'])
    vm.runInContext(read(`data/${file}.js`), context);
vm.runInContext('function canonicalTeam(team) { return TEAM_ALIASES[team] || team; }\n' + source.slice(start, end), context);

const performance = id => vm.runInContext(`performanceCompetitionData('${id}')`, context);
const vasi = performance('vasi');
const ligaF = vasi.competitions.find(c => c.name === 'Liga F');
assert(ligaF, 'Vasi should have Liga F competition history');
assert.deepEqual(Array.from(ligaF.years), ['2025–26', '2026–27', '2027–28', '2028–29']);
assert.deepEqual(Array.from(ligaF.years.map(y => ligaF.positions.get('FC Barcelona').get(y))), [1,1,1,1]);
assert.deepEqual(Array.from(ligaF.years.map(y => ligaF.positions.get('Real Madrid').get(y))), [3,2,2,2]);
assert.deepEqual(Array.from(ligaF.years.map(y => ligaF.positions.get('Real Sociedad').get(y))), [6,6,5,3]);
assert.equal(ligaF.teams.length, 16, 'Liga F must include all distinct teams across seasons');
assert(vasi.competitions.some(c => c.name === "UEFA Women's Champions League" && c.years.length === 4));
assert(vasi.competitions.some(c => c.category === 'Pre-season tournament'));

const rens = performance('rens');
assert(rens.competitions.some(c => c.name === 'Eredivisie' && c.years.length === 3));
assert(rens.competitions.some(c => c.name === 'Premier League' && c.years.length === 5));
const bundesliga = rens.competitions.find(c => c.name === 'Bundesliga');
assert.deepEqual(Array.from(bundesliga.years), ['2033–34', '2034–35'],
    'The in-progress 2035–36 participant list must not become a final ranking');
assert(rens.groupSnapshots.some(c => c.name === 'World Cup 2034'));
assert(rens.groupSnapshots.some(c => c.name === 'Euros 2032'));

const jordan = performance('jordan');
assert(jordan.competitions.some(c => c.name === 'Premier League' && c.years.length === 4));
assert(jordan.competitions.some(c => c.name === 'EFL Championship'));
assert(jordan.groupSnapshots.some(c => c.name === 'World Cup'));
assert(jordan.groupSnapshots.some(c => c.name === 'Euros'));

for (const id of ['rens', 'jordan', 'vasi']) {
    vm.runInContext(`careerPerformance('${id}')`, context);
    const html = context.app.innerHTML;
    assert.equal(context.app.className, 'performance-page');
    assert(html.includes('class="performance-svg"'), `${id} should render league position charts`);
    assert(html.includes('performance-team-picker'), `${id} should have a team picker`);
    assert(html.includes('View all'), `${id} should have tabulated accessible standings`);
    assert(html.includes('1st is at the top'), `${id} should explain the chart orientation`);
    assert(html.includes('not knockout finishing position') || !performance(id).competitions.some(c => c.category === 'European league phase'));
}
assert(source.indexOf('>Head to Head</a>') < source.indexOf('>Competition Performance</a>'),
    'Competition Performance must appear after Head to Head in the sidebar');
assert(source.includes("pageName === 'performance'"), 'The hash router must recognise performance pages');
assert(read('styles.css').includes('.performance-series-dimmed'), 'Team highlighting styles missing');
for (const id of ['rens','jordan','vasi']) {
    const info = performance(id);
    console.log(`${id}: ${info.competitions.length} position charts; ${info.groupSnapshots.length} tournament group snapshots`);
}
console.log('Competition Performance: Vasi 1,1,1,1; Real Madrid 3,2,2,2; all three pages and league charts — PASS');
