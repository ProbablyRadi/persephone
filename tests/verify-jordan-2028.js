// Jordan Vale 2028–29: fixture, career, season-page and timeline regression test.
// Run from the website folder: node tests/verify-jordan-2028.js
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

const appScript = read('app.js');
function excerpt(start, end) {
    const from = appScript.indexOf(start);
    const to = appScript.indexOf(end, from);
    assert(from >= 0 && to > from, `Could not find ${start}`);
    return appScript.slice(from, to);
}

vm.runInContext(
    excerpt('function cleanClubLabel(', 'function careerStatsTable(')
    + excerpt('function teamFlag(', 'function timelinePlayerKey(')
    + excerpt('function timelinePlayerKey(', 'function numericStat(')
    + excerpt('function season(id,', 'function tableCellValue('),
    context,
);

const snapshot = vm.runInContext(`(() => {
    const data = DATA.jordan;
    const fixtures = FULL_FIXTURES.jordan['2028–29'];
    const meta = SEASON_TABLES.jordan['2028–29'];
    const league = COMPETITION_TABLES.jordan['2028–29']['UEFA Europa League'];
    return {
        clubApps: data.career[0][2], clubGoals: data.career[0][3],
        caps: data.intl[2], season: data.seasons['2028–29'],
        stats: data.stats.find(row => row[0] === '2028–29'),
        awards: data.careerAwards['2028–29'],
        fixtures, meta, europaLeagueTable: league,
        preseason: PRESEASON_TABLES.jordan['2028–29'],
        europeanRounds: data.uefaRoundBreaks['2028–29|UEFA Europa League'],
        finalMatches: timelineCupFinals('jordan', '2028–29'),
        squadMovement: timelineSquadChanges('jordan', '2028–29', '2027–28'),
    };
})()`, context);

assert.equal(snapshot.clubApps, 208);
assert.equal(snapshot.clubGoals, 1);
assert.equal(snapshot.caps, 36, "Current England infobox total includes the new user-supplied career record");
assert.equal(snapshot.season.inProgress, undefined);
assert.equal(snapshot.season.table, '11th — 49 pts');
assert.equal(snapshot.stats[4], '11th');
assert.equal(snapshot.stats[5], '6.3');
assert.deepEqual(Array.from(snapshot.stats.slice(6)), [59, 0, 5, 18]);
assert.equal(snapshot.awards.playerOfTheMonth, 0);
assert.equal(snapshot.awards.playerOfTheMatch, 2);

const fixtures = snapshot.fixtures;
for (const [name, expectedCount] of Object.entries({
    'Champions Trophy': 3,
    'Premier League': 38,
    'Carabao Cup': 4,
    'FA Cup': 3,
    'FA Community Shield': 1,
    'UEFA Europa League': 31,
    'Euros': 18,
    'International Friendlies': 8,
})) {
    assert.equal(fixtures[name].length, expectedCount, `${name}: incorrect fixture count`);
}
assert.equal(snapshot.meta.squad.length, 32);
assert.equal(snapshot.meta.squad[0][2], 'Jordan Vale');
assert.deepEqual(Array.from(snapshot.meta.squad[0].slice(3)), ['59', '0', '5', '18']);
assert.equal(snapshot.meta.standings.length, 20);
assert.deepEqual(Array.from(snapshot.meta.standings[10].slice(0, 2)), ['11', 'Bristol City']);
assert.deepEqual(Array.from(snapshot.meta.standings[10].slice(2)),
    ['38', '13', '10', '15', '47', '51', '-4', '49']);
assert.equal(snapshot.preseason.rows.length, 8);
assert.equal(snapshot.europaLeagueTable.rows.length, 36);
assert.equal(snapshot.europaLeagueTable.rows[10][1], 'Bristol City');
assert.equal(snapshot.europeanRounds[8], 'Knockout play-offs (agg)');
assert.equal(snapshot.europeanRounds[16], 'Round of 16 (agg)');
assert.equal(snapshot.europeanRounds[30], 'Final');

const weights = vm.runInContext(`h2hFixtureWeights(
    'jordan', '2028–29', 'UEFA Europa League',
    FULL_FIXTURES.jordan['2028–29']['UEFA Europa League'], 'Bristol City'
)`, context);
assert.equal(weights[10], 2, 'Nordsjælland tie counts as 2 played matches');
assert.equal(weights[18], 2, 'Club Brugge tie counts as 2 played matches');
const opponents = vm.runInContext(`careerOpponentRows('jordan')`, context);
const nord = opponents.find(row => row.opponent === 'FC Nordsjælland');
assert(nord && nord.played >= 3 && nord.wins >= 2,
    'UEFA league phase + play-off results should both contribute to H2H');
assert(snapshot.finalMatches.some(row => row.comp === 'FA Cup'
    && row.winner === 'Liverpool' && row.runner === 'Millwall'));
assert(snapshot.finalMatches.some(row => row.comp === 'Carabao Cup'
    && row.winner === 'Fulham' && row.runner === 'Newcastle United'));
assert(snapshot.finalMatches.some(row => row.comp === 'UEFA Europa League'
    && row.winner === 'RB Leipzig'));
assert(snapshot.squadMovement.joined.length >= 1, 'Timeline has squad movements');

vm.runInContext(`season('jordan', '2028–29')`, context);
assert(context.app.innerHTML.includes('11th — 49 pts'), 'Completed season not visible');
assert(context.app.innerHTML.includes('Champions Trophy table'), 'Missing pre-season trophy table');
assert(context.app.innerHTML.includes('Round of 16 (agg)'), 'Missing European knockout headings');
assert(context.app.innerHTML.includes('Arsenal'), 'League standings failed to render');
assert(!context.app.innerHTML.includes('season-live'), 'Season incorrectly marked as live');

vm.runInContext(`careerTimeline('jordan')`, context);
assert(context.app.innerHTML.includes('Liverpool'), 'FA Cup winner missing on timeline');
assert(context.app.innerHTML.includes('RB Leipzig'), 'Europa League winner missing on timeline');
assert(context.app.innerHTML.includes('Bristol City'), 'Player club missing on timeline');
assert(context.app.innerHTML.includes('Not final — season in progress.'),
    '2029–30 must appear as an in-progress season on the timeline');
assert.equal(snapshot.season.inProgress, undefined,
    'The completed 2028–29 season must remain marked completed');

console.log('Jordan 2028–29: overview, season tables, squad, results, UEFA aggregates, H2H and timeline — PASS');
