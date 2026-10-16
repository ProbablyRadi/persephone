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
    rens: { opponents: 152, played: 540, wins: 349, draws: 88, losses: 103 },
    jordan: { opponents: 86, played: 206, wins: 102, draws: 48, losses: 56 },
    vasi: { opponents: 35, played: 151, wins: 111, draws: 22, losses: 18 },
};

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

                for (const text of matches) {
                    totalFixtureRows++;
                    const fixture = parseFixture(text);
                    if (!fixture.home) continue;
                    parsedFixtures++;
                    if (focal && (sameTeam(fixture.home, focal) || sameTeam(fixture.away, focal))) {
                        representedMatches++;
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
        `${id}: a represented match was omitted or counted twice`);

    console.log(`${id}: ${actual.played} matches, ${actual.opponents} opponents, W${actual.wins} D${actual.draws} L${actual.losses} — PASS`);
}

console.log('All three Head to Head tables match the recorded fixture data.');
console.log('Source warning: Rens 2029–30 has a repeated Newcastle away 0–0 league fixture (left unchanged).');
