// Vasi 2028–29 completed season: data, honours, H2H aggregates, season and Timeline.
// Run: node tests/verify-vasi-2028.js
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
    assert(from >= 0 && to > from, `Missing ${start}`);
    return appScript.slice(from, to);
}
vm.runInContext(
    excerpt('function cleanClubLabel(', 'function careerStatsTable(')
    + excerpt('function teamFlag(', 'function timelinePlayerKey(')
    + excerpt('function timelinePlayerKey(', 'function numericStat(')
    + excerpt('function season(id,', 'function tableCellValue('),
    context,
);
const data = vm.runInContext(`(() => ({
    profile: DATA.vasi,
    season: DATA.vasi.seasons['2028–29'],
    fixtures: FULL_FIXTURES.vasi['2028–29'],
    meta: SEASON_TABLES.vasi['2028–29'],
    rounds: DATA.vasi.uefaRoundBreaks['2028–29|UEFA Women\\'s Champions League'],
    preseason: PRESEASON_TABLES.vasi['2028–29'],
    leaguePhase: COMPETITION_TABLES.vasi['2028–29']["UEFA Women's Champions League"],
    finals: timelineCupFinals('vasi', '2028–29'),
    movements: timelineSquadChanges('vasi', '2028–29', '2027–28'),
    weights: h2hFixtureWeights('vasi', '2028–29', "UEFA Women's Champions League",
        FULL_FIXTURES.vasi['2028–29']["UEFA Women's Champions League"], 'FC Barcelona'),
}))()`, context);
assert.equal(data.season.inProgress, false);
assert.equal(data.season.table, '1st — 78 pts');
assert.equal(data.profile.career[0][2], 162);
assert.equal(data.profile.career[0][3], 170);
assert.deepEqual(Array.from(data.profile.stats.find(row => row[0] === '2028–29').slice(4)),
    ['1st', '', 43, 37, 1, 15]);
assert.equal(data.profile.careerAwards['2028–29'], undefined,
    'Unreported POTM and MOTM must not be fabricated');
assert(data.profile.honours['🇪🇸 FC Barcelona Femení'][0].includes('2028–29'));
assert.equal(data.fixtures['Pre-season friendlies'].length, 3);
assert.equal(data.fixtures['Liga F'].length, 30);
assert.equal(data.fixtures["UEFA Women's Champions League"].length, 17);
// League-phase correction: Barcelona beat Juventus away, not the reverse.
assert.equal(data.fixtures["UEFA Women's Champions League"][3],
    'Juventus 0 - 2 FC Barcelona');
assert.equal(data.season.competitions["UEFA Women's Champions League"][3],
    'Juventus 0 - 2 FC Barcelona');
const uefaPhase = data.fixtures["UEFA Women's Champions League"].slice(0, 6);
const uefaResults = { won: 0, drew: 0, lost: 0, gf: 0, ga: 0 };
for (const raw of uefaPhase) {
    const match = raw.match(/^(.+?) (\d+) - (\d+) (.+)$/);
    assert(match, `Unrecognised UEFA fixture: ${raw}`);
    const home = match[1] === 'FC Barcelona';
    assert(home || match[4] === 'FC Barcelona');
    const gf = Number(home ? match[2] : match[3]);
    const ga = Number(home ? match[3] : match[2]);
    uefaResults.gf += gf;
    uefaResults.ga += ga;
    if (gf > ga) uefaResults.won++;
    else if (gf < ga) uefaResults.lost++;
    else uefaResults.drew++;
}
assert.deepEqual(uefaResults, { won: 4, drew: 1, lost: 1, gf: 12, ga: 7 });

assert.equal(data.fixtures["UEFA Women's Champions League"].at(-1),
    'F — FC Bayern München 3 - 0 Paris SG');
assert.equal(data.meta.standings.length, 16);
assert.deepEqual(Array.from(data.meta.standings[0]),
    ['1', 'FC Barcelona', '30', '25', '3', '2', '77', '23', '54', '78']);
assert.equal(data.meta.squad.length, 24);
assert.deepEqual(Array.from(data.meta.squad.find(row => row[2] === 'Vasiliki Dimitriou')),
    ['ST', '9', 'Vasiliki Dimitriou', '43', '37', '1', '15']);
assert(data.meta.squad.some(row => row[2] === 'Anna Affolter'));
assert.equal(data.profile.squadFlags['Anna Affolter'], '🇨🇭',
    'Anna Affolter should display the Swiss flag');
assert.equal(data.preseason.rows.length, 8);
assert.equal(data.leaguePhase.rows.length, 18);
assert.equal(data.rounds[6], 'Knockout phase play-off (agg)');
assert.equal(data.rounds[10], 'Quarter-finals (agg)');
assert.equal(data.rounds[14], 'Semi-finals (agg)');
assert.equal(data.rounds[16], 'Final');
assert.equal(data.weights[13], 2, 'Barcelona vs Wolfsburg is a two-legged aggregate');
assert.equal(data.weights[15], 2, 'Barcelona vs PSG is a two-legged aggregate');
assert(data.finals.some(row => row.comp === "UEFA Women's Champions League"
    && row.winner === 'FC Bayern München' && row.runner === 'Paris SG'),
    'UWCL final winner and runner-up must appear on the Timeline');
assert(data.movements.joined.includes('Anna Affolter'));

// Reconcile the supplied 30 league results with the final Barcelona standings.
const league = data.fixtures['Liga F'];
const tally = { won: 0, drew: 0, lost: 0, gf: 0, ga: 0 };
for (const raw of league) {
    const match = raw.match(/^(.+?) (\d+) - (\d+) (.+)$/);
    assert(match, `Unrecognised match: ${raw}`);
    const [home, away] = [match[1], match[4]];
    assert(home === 'FC Barcelona' || away === 'FC Barcelona');
    const gf = Number(home === 'FC Barcelona' ? match[2] : match[3]);
    const ga = Number(home === 'FC Barcelona' ? match[3] : match[2]);
    tally.gf += gf; tally.ga += ga;
    if (gf > ga) tally.won++;
    else if (gf < ga) tally.lost++;
    else tally.drew++;
}
assert.deepEqual(tally, { won: 25, drew: 3, lost: 2, gf: 77, ga: 23 });

vm.runInContext(`season('vasi', '2028–29')`, context);
assert(context.app.innerHTML.includes('78 pts'), 'Final Liga F total not rendered');
assert(context.app.innerHTML.includes('Paris SG'), 'Semi-final fixture missing');
assert(context.app.innerHTML.includes('Anna Affolter'), 'Updated squad missing');
assert(context.app.innerHTML.includes('Semi-finals (agg)'), 'Aggregate heading missing');
assert(!context.app.innerHTML.includes('season-live'), 'Completed season still marked in progress');
vm.runInContext(`careerTimeline('vasi')`, context);
assert(context.app.innerHTML.includes('FC Bayern München'), 'UWCL final winner missing on Timeline');
assert(context.app.innerHTML.includes('Anna Affolter'), 'Squad arrival missing on Timeline');
console.log('Vasi 2028–29: final standings, 43/37/1/15, 24-player squad, honours, timeline, UEFA aggregates — PASS');
