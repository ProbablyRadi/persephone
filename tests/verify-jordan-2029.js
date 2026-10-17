// Jordan Vale 2029–30: in-progress Manchester United season & transfer regression.
// Run from the project root: node tests/verify-jordan-2029.js
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

const snapshot = vm.runInContext(`(() => {
    const d = DATA.jordan;
    return {
        current: d.current, number: d.number, crest: d.homeCrest,
        career: d.career,
        summary: d.seasons['2029–30'], stats: d.stats.find(r => r[0] === '2029–30'),
        future: d.careerOverviewFutureRows,
        fixtures: FULL_FIXTURES.jordan['2029–30'],
        meta: SEASON_TABLES.jordan['2029–30'],
        knownFlags: d.squadFlags,
        previous: d.seasons['2028–29'],
    };
})()`, context);

assert(snapshot.current.includes('Manchester United'));
assert(snapshot.number.startsWith('1 '));
assert(snapshot.crest.includes('Manchester_United'));
assert.equal(snapshot.career[0][0], '2025–2029');
assert.equal(snapshot.career[0][2], 208);
assert.equal(snapshot.career[0][3], 1);
assert.equal(snapshot.career[1][0], '2029–');
assert(snapshot.career[1][1].includes('Manchester United'));
assert.equal(snapshot.summary.inProgress, true);
assert.equal(snapshot.previous.inProgress, undefined);
assert.equal(snapshot.stats[1].includes('Manchester United'), true);
assert.equal(snapshot.stats[2], 'GK');
assert.equal(snapshot.stats[3], 'Premier League');
assert(snapshot.stats.slice(4).every(value => value === ''), 'Missing stats must remain blank');
assert.equal(snapshot.future.length, 0, 'Do not duplicate a live season in future rows');
assert.deepEqual(Object.keys(snapshot.fixtures), ['Pre-season friendlies', 'Premier League', 'Carabao Cup', 'FA Cup']);
assert(Object.values(snapshot.fixtures).every(arr => arr.length === 0), 'No invented match results');

assert.equal(snapshot.meta.club, 'Manchester United');
assert.equal(snapshot.meta.league, 'Premier League');
assert.equal(snapshot.meta.standings.length, 1);
assert(snapshot.meta.standings[0].slice(2).every(value => value === ''), 'Standings should be empty');
assert.equal(snapshot.meta.squad.length, 37);
assert.equal(snapshot.meta.squad[0][1], '1');
assert.equal(snapshot.meta.squad[0][2], 'Jordan Vale');
assert(snapshot.meta.squad.every(row => row.length === 7 && row.slice(3).every(v => v === '')),
    '37 player stat lines must be seven cells wide and empty');
assert.equal(new Set(snapshot.meta.squad.map(row => row[2])).size, 37, 'Duplicate squad names');
assert.equal(new Set(snapshot.meta.squad.map(row => row[1])).size, 37, 'Duplicate squad numbers');
for (const [name, flag] of [
    ['Florian Daems', '🇧🇪'],
    ['Rik Dekker', '🇳🇱'],
    ['Mauricio', '🇵🇾'],
]) {
    assert(snapshot.meta.squad.some(row => row[2] === name));
    assert.equal(snapshot.knownFlags[name], flag, `${name} should have the confirmed flag`);
}
assert.equal(snapshot.knownFlags['Tyler Fletcher'], '🏴󠁧󠁢󠁳󠁣󠁴󠁿');
assert.equal(snapshot.knownFlags['Walem Mefrane'], '🇩🇿');
assert.equal(snapshot.knownFlags['Jacob Devaney'], '🇮🇪');

vm.runInContext(`season('jordan', '2029–30')`, context);
const seasonHtml = context.app.innerHTML;
assert(seasonHtml.includes('In progress'));
assert(seasonHtml.includes('Manchester United'));
assert(seasonHtml.includes('2029–30'));
assert(seasonHtml.includes('No fixtures recorded yet.'));
assert(seasonHtml.includes('squad-table'));
assert(seasonHtml.includes('standings-table'));
assert(seasonHtml.includes('Florian Daems'));
assert(seasonHtml.includes('Rik Dekker'));
assert(seasonHtml.includes('Mauricio'));
for (const [name, flag, country] of [
    ['Florian Daems', '🇧🇪', 'Belgium'],
    ['Rik Dekker', '🇳🇱', 'Netherlands'],
    ['Mauricio', '🇵🇾', 'Paraguay'],
]) {
    const imagePath = vm.runInContext(`FLAG_ASSETS[${JSON.stringify(flag)}]`, context);
    assert.equal(imagePath, `assets/flags/${country}.png`, `Missing PNG mapping for ${name}`);
    assert(fs.existsSync(path.join(root, imagePath)), `Missing image for ${name}`);
    assert(seasonHtml.includes(`<td class="player-nation">${flag}</td>`), `Squad flag missing for ${name}`);
}
assert(!seasonHtml.includes('Bristol City 3 - 2 FC Nordsjælland'), 'Old fixtures on new page');
assert(context.nav.innerHTML.includes('2029–30') && context.nav.innerHTML.includes('Manchester United'));

const overview = vm.runInContext(`careerStatsTable(DATA.jordan)`, context);
assert(overview.includes('2029–30') && overview.includes('Manchester United'));
assert(overview.includes('208'), 'Completed Bristol City total is preserved');
vm.runInContext(`careerTimeline('jordan')`, context);
assert(context.app.innerHTML.includes('Manchester United'));
assert(context.app.innerHTML.includes('Club changed — squad comparison resets for the new club.'));
console.log('Jordan 2029–30: transfer, in-progress season, 37-player squad, blank tables, flags, overview and timeline — PASS');
