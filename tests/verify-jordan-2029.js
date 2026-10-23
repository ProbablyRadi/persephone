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

// The 2029–30 record is now a finished season, not an in-progress snapshot.
assert(details.current.includes('Manchester United'));
assert.equal(details.boot, 'Nike');
assert(details.number.includes('1 (Manchester United)'));
assert(details.number.includes('37 (Bristol City)'));
assert(details.number.includes('12, 20, 17, 1'));
assert.deepEqual(Array.from(details.career[0].slice(2)), [208, 1]);
assert.deepEqual(Array.from(details.career[1].slice(2)), [48, 0]);
assert(details.career[2][1].includes('PSV'));
assert(details.career[3][1].includes('AS Monaco'));
assert.equal(details.season.inProgress, undefined);
assert.equal(details.season.pendingFixtures, undefined);
assert.deepEqual(Array.from(details.stats.slice(4)), ['4th', '6.5', 48, 0, 0, 18]);
assert(!details.future.some(row => row[0] === '2029–30'));
assert(details.season.summary.includes('Carabao Cup'));
assert(details.season.table.startsWith('4th — 74 pts'));
assert.equal(details.preSeason.rows.length, 8);
assert.deepEqual(Array.from(vm.runInContext('DATA.jordan.intl.slice(2)', context)), [42, 1]);
assert(vm.runInContext('DATA.jordan.honours["🏴󠁧󠁢󠁥󠁮󠁧󠁿 Manchester United"]', context)
    .includes('Carabao Cup: 2029–30 🏆'));

const fixtures = details.fixtures;
assert.deepEqual(Object.keys(fixtures), [
    'Champions Trophy', 'Premier League', 'Carabao Cup',
    'FA Cup', 'UEFA Champions League', 'UEFA Europa League',
    'UEFA Conference League', 'International Friendlies',
]);
for (const [competition, count] of Object.entries({
    'Champions Trophy': 3,
    'Premier League': 38,
    'Carabao Cup': 6,
    'FA Cup': 3,
    'UEFA Champions League': 1,
    'UEFA Europa League': 1,
    'UEFA Conference League': 1,
    'International Friendlies': 8,
})) {
    assert.equal(fixtures[competition].length, count, `${competition}: incorrect fixture total`);
}
assert(fixtures['Premier League'].includes('Manchester United 0 - 1 Liverpool'));
assert(fixtures['Premier League'].includes('Manchester United 2 - 1 Coventry City'));
assert(fixtures['Carabao Cup'].includes('F — Leeds United 0 - 1 Manchester United'));
assert(fixtures['FA Cup'].includes('F — Liverpool 0 - 1 Manchester City'));
assert(fixtures['International Friendlies'].includes('Finland 0 - 3 England'));
// European finals supplied for the season overview (neither United nor England played).
const europeanFinals = {
    'UEFA Champions League': {
        fixture: 'F — OM (2) 2 - 2 (4) Real Madrid',
        winner: 'Real Madrid', runner: 'OM',
    },
    'UEFA Europa League': {
        fixture: 'F — SSC Napoli 1 - 2 VfB Stuttgart',
        winner: 'VfB Stuttgart', runner: 'SSC Napoli',
    },
    'UEFA Conference League': {
        fixture: 'F — Real Sociedad 2 - 1 AS Roma',
        winner: 'Real Sociedad', runner: 'AS Roma',
    },
};
for (const [competition, result] of Object.entries(europeanFinals)) {
    assert.deepEqual(Array.from(fixtures[competition]), [result.fixture]);
    assert.deepEqual(Array.from(details.season.competitions[competition]), [result.fixture]);
    assert.equal(vm.runInContext(`DATA.jordan.uefaRoundBreaks['2029–30|${competition}'][0]`, context), 'Final');
}
const finals = Array.from(vm.runInContext('timelineCupFinals("jordan", "2029–30")', context));
for (const [competition, result] of Object.entries(europeanFinals)) {
    const actual = finals.find(entry => entry.comp === competition);
    assert(actual, `Timeline did not recognise the ${competition} final`);
    assert.equal(actual.winner, result.winner, `${competition} winner`);
    assert.equal(actual.runner, result.runner, `${competition} runner-up`);
}



// Independently verify the 38 final Premier League scores against the table.
let record = { played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0 };
for (const fixture of fixtures['Premier League']) {
    const match = fixture.match(/^(.+?) (\d+) - (\d+) (.+)$/);
    assert(match, `Unparseable league score: ${fixture}`);
    const [, home, hg, ag, away] = match;
    assert(home === 'Manchester United' || away === 'Manchester United');
    const forGoals = home === 'Manchester United' ? Number(hg) : Number(ag);
    const againstGoals = home === 'Manchester United' ? Number(ag) : Number(hg);
    record.played++;
    record.gf += forGoals;
    record.ga += againstGoals;
    if (forGoals > againstGoals) record.wins++;
    else if (forGoals < againstGoals) record.losses++;
    else record.draws++;
}
assert.deepEqual(record, { played: 38, wins: 23, draws: 5, losses: 10, gf: 72, ga: 44 });
const standings = details.meta.standings;
assert.equal(standings.length, 20);
assert.deepEqual(Array.from(standings[3]), [
    '4', 'Manchester United', '38', '23', '5', '10', '72', '44', '28', '74',
]);
assert(standings.every((row, i) => row[0] === String(i+1) && row[2] === '38'));
assert.deepEqual(Array.from(standings.slice(-3).map(row => row[1])),
    ['Bristol City', 'Burnley', 'Sunderland']);

const squad = details.meta.squad;
assert.equal(squad.length, 39);
assert.equal(new Set(squad.map(row => row[2])).size, 39);
assert.deepEqual(Array.from(squad[0]), ['GK','1','Jordan Vale','48','0','0','18']);
for (const name of ['Andre Garcia', 'Marco Palestra', 'Hugo Ekitiké', 'Gabriele Biancheri']) {
    assert(squad.some(row => row[2] === name), `Missing final-roster addition: ${name}`);
}
assert.deepEqual(Array.from(squad.find(row => row[2] === 'Hugo Ekitiké')),
    ['ST','18','Hugo Ekitiké','25','17','7','11']);
for (const name of ['Benjamin Šeško', 'Florian Daems', 'Rik Dekker', 'Sergiño Dest']) {
    assert(!squad.some(row => row[2] === name), `Removed player remains in squad: ${name}`);
    assert(details.squadUpdates.removed.includes(name), `Missing Timeline removal: ${name}`);
}
for (const name of ['Emeka Adiele', 'Andre Garcia', 'Marco Palestra',
    'Hugo Ekitiké', 'Gabriele Biancheri']) {
    assert(details.squadUpdates.added.includes(name), `Missing Timeline addition: ${name}`);
}
assert.equal(details.flags['Emeka Adiele'], '🏴󠁧󠁢󠁥󠁮󠁧󠁿');
assert.equal(details.flags['Andre Garcia'], '🏴󠁧󠁢󠁥󠁮󠁧󠁿');
assert.equal(vm.runInContext('FLAG_ASSETS[DATA.jordan.squadFlags["Emeka Adiele"]]', context), 'assets/flags/England.png');
assert.equal(vm.runInContext('FLAG_ASSETS[DATA.jordan.squadFlags["Andre Garcia"]]', context), 'assets/flags/England.png');
assert.equal(details.flags['Marco Palestra'], '🇮🇹');
assert.equal(details.flags['Hugo Ekitiké'], '🇫🇷');
assert.equal(details.flags['Gabriele Biancheri'], '🏴󠁧󠁢󠁷󠁬󠁳󠁿');

vm.runInContext("season('jordan', '2029–30')", context);
const html = context.app.innerHTML;
assert(!html.includes('season-live') && !html.includes('In progress'), 'Season must be completed');
assert(html.includes('4th — 74 pts'));
assert(html.includes('Leeds United'));
assert(html.includes('Stevenage'));
assert(html.includes('Hugo Ekitiké'));
assert(html.includes('Champions Trophy table'));
for (const [competition, result] of Object.entries(europeanFinals)) {
    assert(html.includes(competition), `Missing season section: ${competition}`);
    assert(html.includes(result.winner) && html.includes(result.runner));
}

assert(html.includes('Manchester United'));
assert(!html.includes('No fixtures recorded yet.'));

const statTable = vm.runInContext('careerStatsTable(DATA.jordan)', context);
assert(statTable.includes('2029–30'));
assert(statTable.includes('48'));
vm.runInContext("careerTimeline('jordan')", context);
const timeline = context.app.innerHTML;
assert(timeline.includes('Manchester United'));
assert(timeline.includes('Leeds United') && timeline.includes('Carabao Cup'));
for (const [competition, result] of Object.entries(europeanFinals)) {
    assert(timeline.includes(`<b>${competition}</b>`), `Missing Timeline final: ${competition}`);
    assert(timeline.includes(`Winner: `) && timeline.includes(result.winner));
    assert(timeline.includes(`Runner-up: `) && timeline.includes(result.runner));
}
// Neutral European finals are excluded from Jordan's Head to Head.
const h2h = vm.runInContext("careerOpponentRows('jordan')", context);
const totals = Array.from(h2h).reduce((sum, opponent) => {
    sum.played += opponent.played;
    sum.wins += opponent.wins;
    sum.draws += opponent.draws;
    sum.losses += opponent.losses;
    return sum;
}, {played: 0, wins: 0, draws: 0, losses: 0});
assert.deepEqual(totals, { played: 304, wins: 152, draws: 65, losses: 85 });

assert(timeline.includes('<b>Joined</b>'));
assert(timeline.includes('<b>Left</b>'));
for (const name of [...details.squadUpdates.added, ...details.squadUpdates.removed]) {
    assert(timeline.includes(name), `Missing Timeline squad movement: ${name}`);
}
assert(!timeline.includes('Club changed — squad comparison resets for the new club.'));
assert(!timeline.includes('In-season squad update —'));
assert(!timeline.includes('Removed names are not confirmed transfers.'));
assert(!timeline.includes('Not final — season in progress.'));

console.log('Jordan 2029–30: 38 league fixtures, 4th/74 pts, Carabao Cup title, 48 apps/18 CLS, 39-player squad and Timeline — PASS');
