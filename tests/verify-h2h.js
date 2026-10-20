// Head to Head regression check.
// Run from the website folder: node tests/verify-h2h.js
// Uses the real site data and H2H renderer, without a browser or npm packages.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const siteRoot = path.resolve(__dirname, '..');
const context = vm.createContext({
    console,
    app: { innerHTML: '', className: '' },
    nav: { innerHTML: '' },
    careerNavigator: () => '',
    esc: value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
});

function read(relativePath) {
    return fs.readFileSync(path.join(siteRoot, relativePath), 'utf8');
}

for (const fileName of [
    'data/base.js',
    'data/definitions.js',
    'data/rens.js',
    'data/jordan.js',
    'data/vasi.js',
]) {
    vm.runInContext(read(fileName), context, { filename: fileName });
}

// app.js also sets up the browser interface, so execute only the actual
// H2H-related functions here. The live website uses the whole script normally.
const appScript = read('app.js');

function excerpt(start, end) {
    const startIndex = appScript.indexOf(start);
    const endIndex = appScript.indexOf(end, startIndex);

    assert(startIndex >= 0 && endIndex > startIndex);
    return appScript.slice(startIndex, endIndex);
}

vm.runInContext(
    excerpt('function cleanClubLabel(', 'function careerGroups(')
        + excerpt('function parseFixture(', 'function timelinePlayerKey(')
        + '\nfunction teamFlag(name) { return TEAM_FLAGS[name] || ""; }',
    context,
);

const expected = {
    rens: { opponents: 152, played: 554, wins: 349, draws: 88, losses: 101, aggregateOnlyTies: 16 },
    jordan: { opponents: 106, played: 304, wins: 152, draws: 65, losses: 85, aggregateOnlyTies: 2 },
    vasi: { opponents: 35, played: 158, wins: 111, draws: 22, losses: 18, aggregateOnlyTies: 7 },
};

// Every European club knockout heading that represents a two-legged tie
// must say (agg). Finals, World Cup/Euros, and league phases stay unchanged.
for (const id of ['rens', 'jordan', 'vasi']) {
    const roundMaps = vm.runInContext(`DATA.${id}.uefaRoundBreaks || {}`, context);
    for (const [key, stages] of Object.entries(roundMaps)) {
        const clubUefa = /(?:Champions League|Europa League|Conference League)/i.test(key);
        for (const heading of Object.values(stages)) {
            const twoLegStage = /(?:play.?off|round of 16|quarter.?final|semi.?final)/i.test(heading);
            if (clubUefa && twoLegStage) {
                assert.match(heading, /\(agg\)$/i, `${id} ${key}: unlabeled aggregate round: ${heading}`);
            }
            if (/^Final$/i.test(heading)) {
                assert.doesNotMatch(heading, /agg/i, `${id} ${key}: final cannot be marked aggregate`);
            }
            if (!clubUefa)
                assert.doesNotMatch(heading, /agg/i, `${id} ${key}: national-team knockout is not two-legged`);
        }
    }
}

// Verify the actual season fixture tables display the section headings.
for (const [id, season, comp, heading] of [
    ['rens', '2030–31', 'UEFA Conference League', 'Round of 16 (agg)'],
    ['rens', '2032–33', 'UEFA Europa League', 'Quarter-finals (agg)'],
    ['rens', '2034–35', 'UEFA Champions League', 'Semi-finals (agg)'],
    ['vasi', '2025–26', "UEFA Women's Champions League", 'Knockout phase play-off (agg)'],
]) {
    const html = vm.runInContext(`fixtureTable(
        FULL_FIXTURES[${JSON.stringify(id)}][${JSON.stringify(season)}][${JSON.stringify(comp)}],
        focalFor(${JSON.stringify(id)}, ${JSON.stringify(season)}, ${JSON.stringify(comp)}),
        ${JSON.stringify(comp)}, ${JSON.stringify(id)}, ${JSON.stringify(season)}
    )`, context);
    assert(html.includes(`<th colspan="6">${heading}</th>`), `${id}: missing visible ${heading}`);
}

// An aggregate row represents TWO games, but already recorded legs are
// counted individually, and their duplicate aggregate SUMMARY is excluded.
const tieChecks = [
    ['rens', '2027–28', 'Champions League Qualifiers (agg)', 'Fenerbahçe', 2],
    ['rens', '2027–28', 'Champions League Playoffs (agg)', 'Olympiacos FC', 2],
    ['rens', '2026–27', 'UEFA Champions League', 'Juventus', 2],
    ['rens', '2027–28', 'UEFA Champions League', 'Inter Milan', 2],
    ['rens', '2030–31', 'UEFA Conference League', 'SK Brann', 2],
    ['rens', '2032–33', 'UEFA Europa League', 'Real Sociedad', 2],
    ['vasi', '2025–26', 'UEFA Women\'s Champions League', 'Real Madrid', 2],
    ['vasi', '2027–28', 'UEFA Women\'s Champions League', 'Chelsea', 2],
];
for (const [id, season, comp, opponent, expectedGames] of tieChecks) {
    const check = vm.runInContext(`(() => {
        const items = FULL_FIXTURES[${JSON.stringify(id)}][${JSON.stringify(season)}][${JSON.stringify(comp)}];
        const focal = focalFor(${JSON.stringify(id)}, ${JSON.stringify(season)}, ${JSON.stringify(comp)});
        const weights = h2hFixtureWeights(${JSON.stringify(id)}, ${JSON.stringify(season)}, ${JSON.stringify(comp)}, items, focal);
        const breaks = tournamentRounds(${JSON.stringify(comp)}, items, ${JSON.stringify(id)}, ${JSON.stringify(season)});
        let stage = '';
        return items.reduce((sum, raw, index) => {
            if (breaks[index]) stage = breaks[index];
            if (!uefaAggregateRound(${JSON.stringify(comp)}, stage)) return sum;
            const f = parseFixture(raw);
            if (!f.home) return sum;
            const focalHome = sameTeam(f.home, focal);
            if (!focalHome && !sameTeam(f.away, focal)) return sum;
            const other = focalHome ? f.away : f.home;
            return canonicalTeam(other) === ${JSON.stringify(opponent)} ? sum + weights[index] : sum;
        }, 0);
    })()`, context);
    assert.equal(check, expectedGames, `${id} ${season}: incorrect legs for ${opponent}`);
}

assert.equal(
    vm.runInContext('isInternationalCompetition("Champions League Qualifiers (agg)")', context),
    false,
    'Club Champions League qualifying must not be classified as international.',
);

assert.equal(
    vm.runInContext('focalFor("rens", "2027–28", "Champions League Qualifiers (agg)")', context),
    'PEC Zwolle',
);

for (const [id, wanted] of Object.entries(expected)) {
    const actual = vm.runInContext(`(() => {
        const rows = careerOpponentRows('${id}');
        const totals = rows.reduce((sum, row) => {
            sum.played += row.played;
            sum.wins += row.wins;
            sum.draws += row.draws;
            sum.losses += row.losses;
            return sum;
        }, {
            played: 0, wins: 0, draws: 0, losses: 0
        });

        const source = FULL_FIXTURES['${id}'];
        let totalFixtureRows = 0;
        let parsedFixtures = 0;
        let representedMatches = 0;
        let unflaggedOpponents = [];

        let aggregateOnlyTies = 0;
        for (const [season, competitions] of Object.entries(source)) {
            for (const [competition, matches] of Object.entries(competitions)) {
                const focal = focalFor('${id}', season, competition);

                const weights = h2hFixtureWeights('${id}', season, competition, matches, focal);
                for (const [index, text] of matches.entries()) {
                    totalFixtureRows++;
                    const fixture = parseFixture(text);
                    if (!fixture.home) continue;
                    parsedFixtures++;
                    if (focal && (sameTeam(fixture.home, focal) || sameTeam(fixture.away, focal))) {
                        representedMatches += weights[index];
                        if (weights[index] === 2)
                            aggregateOnlyTies++;
                    }
                }
            }
        }

        unflaggedOpponents = rows.filter(row => !teamFlag(row.opponent)).map(row => row.opponent);

        // Each Represented entry uses the same weighted, deduplicated fixtures
        // as the Played total (including both legs of aggregate-only ties).
        const representedCountMismatches = rows.filter(row =>
            [...row.represented.values()].reduce((total, count) => total + count, 0)
                !== row.played
        ).map(row => row.opponent);
        const representedLabelMismatches = rows.filter(row =>
            row.representedLabel !== [...row.represented]
                .map(([team, count]) => team + ' (' + count + ')').join(', ')
        ).map(row => row.opponent);
        const representedExamples = Object.fromEntries(rows
            .filter(row => ['AFC Bournemouth', 'Brighton & Hove', 'Arsenal'].includes(row.opponent))
            .map(row => [row.opponent, row.representedLabel]));
        careerAnalysis('${id}');

        return {
            opponents: rows.length,
            ...totals,
            totalFixtureRows,
            parsedFixtures,
            representedMatches,
            aggregateOnlyTies,
            unflaggedOpponents,
            representedCountMismatches,
            representedLabelMismatches,
            representedExamples,
            html: app.innerHTML,
        };
    })()`, context);

    for (const [field, value] of Object.entries(wanted)) {
        assert.equal(actual[field], value, `${id}: incorrect ${field}`);
    }

    assert.equal(actual.played - (actual.wins + actual.draws + actual.losses),
        actual.aggregateOnlyTies,
        `${id}: each aggregate-only tie must explain exactly one missing match outcome`);
    assert.equal(actual.parsedFixtures, actual.totalFixtureRows,
        `${id}: a scored fixture was not parsed`);
    assert.deepEqual(Array.from(actual.unflaggedOpponents), [],
        `${id}: missing opponent flag`);
    assert.deepEqual(Array.from(actual.representedCountMismatches), [],
        `${id}: represented counts must sum to Played for every opponent`);
    assert.deepEqual(Array.from(actual.representedLabelMismatches), [],
        `${id}: represented labels must show counts beside each team`);
    if (id === 'jordan') {
        assert.equal(actual.representedExamples['AFC Bournemouth'],
            'Bristol City (6), Manchester United (2)',
            'Jordan: the Bournemouth record should split correctly by club');
        assert(actual.html.includes('<td class="represented">Bristol City (6), Manchester United (2)</td>'),
            'Jordan: the breakdown must appear in the rendered Head to Head table');
        assert.equal(actual.representedExamples['Brighton & Hove'],
            'Bristol City (7), Manchester United (3)',
            'Jordan: ties on penalties should count as played matches');
    }
    if (id === 'rens') {
        assert.equal(actual.representedExamples.Arsenal,
            'Brighton & Hove (14), FC Bayern München (1), Borussia Dortmund (1)',
            'Rens: the Arsenal record should split correctly by club');
    }
    assert(actual.html.includes('analysis-summary'), `${id}: H2H page did not render`);
    assert(!actual.html.includes('Agg W'), `${id}: obsolete aggregate-wins column`);
    assert(!actual.html.includes('Agg L'), `${id}: obsolete aggregate-losses column`);
    assert(!actual.html.includes('Unknown legs'), `${id}: obsolete unknown-legs summary`);
    assert(actual.html.includes('P may be higher than W + D + L'),
        `${id}: missing simplified aggregate accounting disclaimer`);
    assert.equal((actual.html.match(/class="opponent"/g) || []).length, wanted.opponents,
        `${id}: incorrect rendered opponent count`);

    if (id === 'rens') {
        assert(actual.html.includes('Fenerbahçe'), 'Rens: missing Fenerbahçe');
    }

    // The 2026 World Cup and 2028 Euros have eight repeated England fixture
    // strings across adjacent Jordan season pages. These are not new matches.
    const repeatedTournamentEntries = id === 'jordan' ? 8 : 0;
    assert.equal(actual.representedMatches - repeatedTournamentEntries, actual.played,
        `${id}: H2H does not agree with the weighted source fixtures`);

    console.log(`${id}: ${actual.played} matches, ${actual.opponents} opponents, W${actual.wins} D${actual.draws} L${actual.losses} — PASS`);
}


// A single aggregate score represents two matches and one overall outcome;
// two real legs count individually, and a duplicate total counts zero.
const example = vm.runInContext(`(() => {
    const key = 'test-season|UEFA Europa League';
    DATA.rens.uefaRoundBreaks[key] = { 0: 'Quarter-finals (agg)' };
    const aggregateOnly = h2hFixtureWeights(
        'rens', 'test-season', 'UEFA Europa League',
        ['PEC Zwolle 5 - 2 Lech Poznań'], 'PEC Zwolle'
    );
    const actualLegs = h2hFixtureWeights(
        'rens', 'test-season', 'UEFA Europa League',
        ['PEC Zwolle 3 - 0 Lech Poznań', 'Lech Poznań 2 - 2 PEC Zwolle'],
        'PEC Zwolle'
    );
    const withSummary = h2hFixtureWeights(
        'rens', 'test-season', 'UEFA Europa League',
        ['PEC Zwolle 3 - 0 Lech Poznań', 'Lech Poznań 2 - 2 PEC Zwolle',
         'PEC Zwolle 5 - 2 Lech Poznań'], 'PEC Zwolle'
    );
    delete DATA.rens.uefaRoundBreaks[key];
    return { aggregateOnly, actualLegs, withSummary };
})()`, context);
assert.deepEqual(Array.from(example.aggregateOnly), [2],
    'Aggregate-only win: one recorded result, two matches played');
assert.deepEqual(Array.from(example.actualLegs), [1, 1],
    'Actual individual legs: count each match once');
assert.deepEqual(Array.from(example.withSummary), [1, 1, 0],
    'Duplicate aggregate summary must be excluded');

// A drawn aggregate with penalties has one outcome decided by shoot-out.
const anderlecht = vm.runInContext(`careerOpponentRows('rens').find(
    row => row.opponent === 'RSC Anderlecht'
)`, context);
assert.equal(anderlecht.played, 2);
assert.equal(anderlecht.wins, 1);
assert.equal(anderlecht.draws, 0);
assert.equal(anderlecht.gf, 2);
assert.equal(anderlecht.ga, 2);

// Known two-leg ties: count the two supplied legs and skip duplicate summaries.
for (const [season, opponent] of [['2027–28', 'Inter Milan'], ['2026–27', 'Juventus']]) {
    const legResults = vm.runInContext(`(() => {
        const id = 'rens', comp = 'UEFA Champions League';
        const fixtures = FULL_FIXTURES[id][${JSON.stringify(season)}][comp];
        const focal = focalFor(id, ${JSON.stringify(season)}, comp);
        const weights = h2hFixtureWeights(id, ${JSON.stringify(season)}, comp, fixtures, focal);
        const rounds = tournamentRounds(comp, fixtures, id, ${JSON.stringify(season)});
        let stage = '';
        return fixtures.flatMap((raw, index) => {
            if (rounds[index]) stage = rounds[index];
            if (!uefaAggregateRound(comp, stage) || weights[index] === 0) return [];
            const fixture = parseFixture(raw);
            const home = sameTeam(fixture.home, focal);
            if (!home && !sameTeam(fixture.away, focal)) return [];
            const other = canonicalTeam(home ? fixture.away : fixture.home);
            return other === ${JSON.stringify(opponent)}
                ? [{ weight: weights[index], result: outcome(fixture, focal) }] : [];
        });
    })()`, context);
    assert.deepEqual(Array.from(legResults, result => result.weight), [1, 1],
        `${opponent}: only two real legs should count`);
    assert(legResults.every(result => ['win', 'draw', 'loss'].includes(result.result)),
        `${opponent}: every leg has its own recorded result`);
}

console.log('All three Head to Head tables match the recorded fixture data.');
console.log('Source warning: Rens 2029–30 has a repeated Newcastle away 0–0 league fixture (left unchanged).');
