// Jordan Vale 2029–30: live Manchester United season, squad, fixtures and timeline.
// Run from project root: node tests/verify-jordan-2029.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = vm.createContext({
    console,
    app: { className: '', innerHTML: '' },
    nav: { innerHTML: '' },
    esc: value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
});
for (const file of ['base', 'definitions', 'rens', 'jordan', 'vasi']) {
    vm.runInContext(read(`data/${file}.js`), context);
}

const source = read('app.js');
function excerpt(start, end) {
    const from = source.indexOf(start);
    const to = source.indexOf(end, from);
    assert(from >= 0 && to > from, `Missing renderer: ${start}`);
    return source.slice(from, to);
}
vm.runInContext(
    excerpt('function cleanClubLabel(', 'function careerStatsTable(')
    + excerpt('function careerStatsTable(', 'function player(')
    + excerpt('function teamFlag(', 'function timelinePlayerKey(')
    + excerpt('function timelinePlayerKey(', 'function numericStat(')
    + excerpt('function season(id,', 'function tableCellValue('),
    context,
);

const details = vm.runInContext(`(() => {
    const d = DATA.jordan;
    return {
        current: d.current,
        number: d.number,
        boot: d.bootBrand,
        career: d.career,
        stats: d.stats.find(row => row[0] === '2029–30'),
        future: d.careerOverviewFutureRows,
        season: d.seasons['2029–30'],
        fixtures: FULL_FIXTURES.jordan['2029–30'],
        meta: SEASON_TABLES.jordan['2029–30'],
        preSeason: PRESEASON_TABLES.jordan['2029–30'],
        squadUpdates: d.timelineInSeasonSquadUpdates['2029–30'],
        flags: d.squadFlags,
    };
})()`, context);

assert(details.current.includes('Manchester United'));
assert.equal(details.boot, 'Nike');
assert(details.number.startsWith('1 '));
assert.deepEqual(Array.from(details.career[0].slice(2)), [208, 1]);
assert.deepEqual(Array.from(details.career[1].slice(2)), [24, 0]);
assert(details.career[2][1].includes('Celtic'));
assert.equal(details.season.inProgress, true);
assert.deepEqual(Array.from(details.stats.slice(4)), ['', '', 24, 0, 0, 8]);
assert(!details.future.some(row => row[0] === '2029–30'));
assert.equal(details.season.table, '3rd (provisional) — 18 played, 34 pts; 17 scored results supplied');
assert.equal(details.preSeason.rows.length, 8);

const fixtures = details.fixtures;
assert.deepEqual(Object.keys(fixtures), [
    'Champions Trophy', 'Premier League', 'Carabao Cup',
    'FA Cup', 'International Friendlies',
]);
assert.equal(fixtures['Champions Trophy'].length, 3);
assert.equal(fixtures['Premier League'].length, 17);
assert.equal(fixtures['Carabao Cup'].length, 4);
assert.equal(fixtures['FA Cup'].length, 0);
assert.equal(fixtures['International Friendlies'].length, 6);
assert(fixtures['Premier League'].includes('Coventry City 2 - 1 Manchester United'));
assert(fixtures['Carabao Cup'].includes('Wrexham (8) 2 - 2 (9) Manchester United'));
assert(fixtures['Carabao Cup'].includes('Portsmouth (2) 0 - 0 (4) Manchester United'));
assert(fixtures['Carabao Cup'].includes('Liverpool 0 - 1 Manchester United'));
assert(fixtures['International Friendlies'].includes('England 3 - 1 Uzbekistan'));
assert.deepEqual(Array.from(details.season.pendingFixtures['Premier League']), [
    'Manchester United vs Liverpool',
]);
assert.deepEqual(Array.from(details.season.pendingFixtures['Carabao Cup']), [
    'Manchester City vs Manchester United',
]);
for (const unplayed of ['Manchester United vs Liverpool', 'Manchester City vs Manchester United']) {
    assert(!Object.values(fixtures).some(list => list.includes(unplayed)),
        'Unplayed fixtures must not enter Head to Head');
}

// The supplied table has all 20 rankings, every club has P=18 and known points,
// but the sheet doesn't supply the remaining W/D/L or goal columns.
const standings = details.meta.standings;
assert.equal(standings.length, 20);
assert.deepEqual(Array.from(standings[2]), [
    '3', 'Manchester United', '18', '', '', '', '', '', '', '34',
]);
assert(standings.every((r, i) => r[0] === String(i + 1) && r[2] === '18'));
assert(standings.every(row => row.slice(3, 9).every(value => value === '')));

const squad = details.meta.squad;
assert.equal(squad.length, 36);
assert.equal(squad[0][2], 'Jordan Vale');
assert.deepEqual(Array.from(squad[0].slice(3)), ['24', '0', '0', '8']);
assert.deepEqual(Array.from(squad.find(r => r[2] === 'Emeka Adiele').slice(0, 3)),
    ['LB', '5', 'Emeka Adiele']);
assert.equal(new Set(squad.map(r => r[2])).size, 36);
assert.equal(new Set(squad.map(r => r[1])).size, 36);
assert.deepEqual(Array.from(details.squadUpdates.added), ['Emeka Adiele']);
assert.deepEqual(Array.from(details.squadUpdates.removed), [
    'Benjamin Šeško', 'Florian Daems', 'Rik Dekker',
]);
for (const name of details.squadUpdates.removed)
    assert(!squad.some(row => row[2] === name), `${name} must be removed from the new roster`);
assert(!details.flags['Emeka Adiele'], 'Do not guess Emeka Adiele’s nationality');

vm.runInContext("season('jordan', '2029–30')", context);
const html = context.app.innerHTML;
assert(html.includes('In progress'));
assert(html.includes('3rd (provisional)'));
assert(html.includes('Emeka Adiele'));
assert(html.includes('Jordan Vale'));
assert(html.includes('Liverpool') && html.includes('0 - 1'));
assert(html.includes('Manchester United vs Liverpool'));
assert(html.includes('Manchester City vs Manchester United'));
assert(html.includes('not counted in results or Head to Head'));
assert(html.includes('Uzbekistan') && html.includes('Cabo Verde'));
assert(html.includes('Champions Trophy table'));
assert(html.includes('No fixtures recorded yet.')); // FA Cup
assert(!html.includes('Benjamin Šeško'));
assert(!html.includes('Florian Daems'));

const statTable = vm.runInContext('careerStatsTable(DATA.jordan)', context);
assert(statTable.includes('2029–30'));
assert(statTable.includes('24'));
vm.runInContext("careerTimeline('jordan')", context);
const timeline = context.app.innerHTML;
assert(timeline.includes('Emeka Adiele'));
for (const name of ['Benjamin Šeško', 'Florian Daems', 'Rik Dekker'])
    assert(timeline.includes(name), `Missing in-season squad update: ${name}`);
assert(timeline.includes('<b>Joined</b>'));
assert(timeline.includes('<b>Left</b>'));
assert(!timeline.includes('Added to list'));
assert(!timeline.includes('Removed from list'));
assert(timeline.includes('Removed names are not confirmed transfers'));
assert(timeline.includes('Not final — season in progress.'));
assert(timeline.includes('Manchester United'));

console.log('Jordan 2029–30: 17 scored league games, 18-match standings, 24 appearances, 36-player squad, 3 removals, pending fixtures, England friendlies and Timeline — PASS');
