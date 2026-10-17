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
    rens: { opponents: 152, played: 554, wins: 364, draws: 88, losses: 102 },
    jordan: { opponents: 86, played: 206, wins: 102, draws: 48, losses: 56 },
    vasi: { opponents: 35, played: 158, wins: 118, draws: 22, losses: 18 },
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
        }, { played: 0, wins: 0, draws: 0, losses: 0 });

        const source = FULL_FIXTURES['${id}'];
        let totalFixtureRows = 0;
        let parsedFixtures = 0;
        let representedMatches = 0;
        let unflaggedOpponents = [];

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
                    }
                }
            }
        }

        unflaggedOpponents = rows.filter(row => !teamFlag(row.opponent)).map(row => row.opponent);
        careerAnalysis('${id}');

        return {
            opponents: rows.length,
            ...totals,
            totalFixtureRows,
            parsedFixtures,
            representedMatches,
            unflaggedOpponents,
            html: app.innerHTML,
        };
    })()`, context);

    for (const [field, value] of Object.entries(wanted)) {
        assert.equal(actual[field], value, `${id}: incorrect ${field}`);
    }

    assert.equal(actual.played, actual.wins + actual.draws + actual.losses);
    assert.equal(actual.parsedFixtures, actual.totalFixtureRows,
        `${id}: a scored fixture was not parsed`);
    assert.deepEqual(Array.from(actual.unflaggedOpponents), [],
        `${id}: missing opponent flag`);
    assert(actual.html.includes('analysis-summary'), `${id}: H2H page did not render`);
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

console.log('All three Head to Head tables match the recorded fixture data.');
console.log('Source warning: Rens 2029–30 has a repeated Newcastle away 0–0 league fixture (left unchanged).');
