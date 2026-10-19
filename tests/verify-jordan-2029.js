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
        preSeason: PRESEASON_TABLES.jordan['2029–30'],
        previous: d.seasons['2028–29'],
    };
})()`, context);

assert(snapshot.current.includes('Manchester United'));
assert(snapshot.number.startsWith('1 '));
assert(snapshot.crest.includes('Manchester_United'));
assert.equal(snapshot.career[0][0], '2025–2029');
assert.equal(snapshot.career[0][2], 208);
assert.equal(snapshot.career[0][3], 1);
assert.equal(snapshot.career[1][0], '2029–2037');
assert.equal(snapshot.career[1][2], 7);
assert.equal(snapshot.career[1][3], 0);
assert.equal(snapshot.career[2][0], '2037–2040');
assert(snapshot.career[2][1].includes('Celtic'));
assert(snapshot.career[1][1].includes('Manchester United'));
assert.equal(snapshot.summary.inProgress, true);
assert.equal(snapshot.previous.inProgress, undefined);
assert.equal(snapshot.stats[1].includes('Manchester United'), true);
assert.equal(snapshot.stats[2], 'GK');
assert.equal(snapshot.stats[3], 'Premier League');
assert(snapshot.stats.slice(4).every(value => value === ''), 'Missing stats must remain blank');
assert.equal(snapshot.future.length, 10, 'Only later Man United / Celtic seasons should be placeholders');
assert(!snapshot.future.some(row => row[0] === '2029–30'), 'Do not duplicate a live season in future rows');
assert.deepEqual(Object.keys(snapshot.fixtures), ['Champions Trophy', 'Premier League', 'Carabao Cup', 'FA Cup']);
assert.equal(snapshot.fixtures['Champions Trophy'].length, 3);
assert.equal(snapshot.fixtures['Premier League'].length, 3);
assert.equal(snapshot.fixtures['Carabao Cup'].length, 1);
assert.equal(snapshot.fixtures['FA Cup'].length, 0);
assert.deepEqual(Array.from(snapshot.fixtures['Premier League']), [
    'Manchester United 3 - 0 Wolves',
    'AFC Bournemouth 0 - 1 Manchester United',
    'Manchester United 3 - 0 Bristol City',
]);
assert.equal(snapshot.fixtures['Carabao Cup'][0], 'Brighton & Hove (2) 2 - 2 (4) Manchester United');
assert.equal(snapshot.fixtures['Champions Trophy'][0], 'Manchester United 1 - 1 Rayo Vallecano');
assert.equal(snapshot.fixtures['Champions Trophy'][1], 'Sassuolo 1 - 0 Manchester United');
assert.equal(snapshot.fixtures['Champions Trophy'][2], 'Manchester United 2 - 0 SC Freiburg');
assert.equal(snapshot.summary.table, '3 played — 9 pts (3 W, 0 D, 0 L)');
assert.equal(snapshot.preSeason.rows.length, 8);
assert.deepEqual(Array.from(snapshot.preSeason.rows[1]),
    ['2','Manchester United','3','1','1','1','3','2','1','4']);
const trophyRows = snapshot.preSeason.rows;
assert(trophyRows.every(row => row.length === 10));
assert.equal(trophyRows[0][1], 'RC Mallorca');
assert.equal(trophyRows[7][1], 'Rayo Vallecano');

assert.equal(snapshot.meta.club, 'Manchester United');
assert.equal(snapshot.meta.league, 'Premier League');
assert.equal(snapshot.meta.standings.length, 20);
const unitedRow = snapshot.meta.standings.find(row => row[1] === 'Manchester United');
assert.deepEqual(Array.from(unitedRow), ['','Manchester United','3','3','0','0','7','0','7','9']);
assert(snapshot.meta.standings.every(row => row[0] === ''), 'No league ranking has been confirmed');
assert(snapshot.meta.standings.filter(row => row[1] !== 'Manchester United')
    .every(row => row.slice(2).every(v => v === '')), 'Do not invent other clubs’ results');
assert.equal(snapshot.meta.squad.length, 38);
assert.equal(snapshot.meta.squad[0][1], '1');
assert.equal(snapshot.meta.squad[0][2], 'Jordan Vale');
assert.deepEqual(Array.from(snapshot.meta.squad.find(row => row[2] === 'James Scanlon').slice(0, 3)),
    ['CAM', '28', 'James Scanlon'], 'James Scanlon must be added as No. 28 CAM');
assert(snapshot.meta.squad.every(row => row.length === 7 && row.slice(3).every(v => v === '')),
    '38 player stat lines must be seven cells wide and empty');
assert.equal(new Set(snapshot.meta.squad.map(row => row[2])).size, 38, 'Duplicate squad names');
assert.equal(new Set(snapshot.meta.squad.map(row => row[1])).size, 38, 'Duplicate squad numbers');
for (const [name, flag] of [
    ['Florian Daems', '🇧🇪'],
    ['Rik Dekker', '🇳🇱'],
    ['Mauricio', '🇵🇾'],
    ['James Scanlon', '🇬🇮'],
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
assert(seasonHtml.includes('James Scanlon'));
assert(seasonHtml.includes('Champions Trophy table'));
assert(seasonHtml.includes('Bristol City') && seasonHtml.includes('3 - 0'),
    'Premier League opener results should render in the fixture table');
assert(seasonHtml.includes('Brighton &amp; Hove'));
assert(seasonHtml.includes('3 played — 9 pts')); 
for (const [name, flag, country] of [
    ['Florian Daems', '🇧🇪', 'Belgium'],
    ['Rik Dekker', '🇳🇱', 'Netherlands'],
    ['Mauricio', '🇵🇾', 'Paraguay'],
    ['James Scanlon', '🇬🇮', 'Gibraltar'],
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
assert(context.app.innerHTML.includes('League top five not yet available.'),
    'Do not claim provisional participant order is a completed top-five ranking');
const opponents = vm.runInContext(`careerOpponentRows('jordan')`, context);
const wolves = opponents.find(row => row.opponent === 'Wolves');
const rayo = opponents.find(row => row.opponent === 'Rayo Vallecano');
const bristol = opponents.find(row => row.opponent === 'Bristol City');
assert(rayo && rayo.played === 1 && rayo.draws === 1);
assert(bristol && bristol.played === 1 && bristol.wins === 1);
assert(wolves && wolves.played > 1);
console.log('Jordan 2029–30: seven recorded results, Champions Trophy standings, 38-player squad, Gibraltar flag, H2H, in-progress timeline and overview — PASS');
