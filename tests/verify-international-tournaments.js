// Ensure World Cup and Euros editions appear on only one season page.
// Run: node tests/verify-international-tournaments.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = vm.createContext({});
for (const file of ['base', 'definitions', 'rens', 'jordan', 'vasi']) {
    vm.runInContext(fs.readFileSync(path.join(root, `data/${file}.js`), 'utf8'), context);
}
const { DATA, FULL_FIXTURES, COMPETITION_TABLES } = vm.runInContext(
    '({ DATA, FULL_FIXTURES, COMPETITION_TABLES })', context);
const isFinalTournament = name => /^(?:World Cup|Euros)(?: \d{4})?$/.test(name);

for (const player of ['rens', 'jordan', 'vasi']) {
    const tournamentSeasons = new Map();
    for (const [season, competitions] of Object.entries(FULL_FIXTURES[player])) {
        for (const [name, matches] of Object.entries(competitions)) {
            if (!isFinalTournament(name)) continue;
            const registeredSeasons = tournamentSeasons.get(name) || [];
            registeredSeasons.push(season);
            tournamentSeasons.set(name, registeredSeasons);
            assert(matches.length, `${player}: empty ${name} fixture section`);
            assert.equal(new Set(matches).size, matches.length,
                `${player}: duplicate fixture inside ${season} ${name}`);
            assert(COMPETITION_TABLES[player][season]?.[name],
                `${player}: missing ${name} standings in ${season}`);
            assert(DATA[player].seasons[season]?.competitions?.[name],
                `${player}: missing ${name} summary in ${season}`);
        }
    }
    for (const [name, seasons] of tournamentSeasons) {
        assert.equal(seasons.length, 1,
            `${player}: ${name} must appear on one season page: ${seasons.join(', ')}`);
    }
    for (const [season, tables] of Object.entries(COMPETITION_TABLES[player])) {
        for (const name of Object.keys(tables)) {
            if (isFinalTournament(name)) {
                assert(tournamentSeasons.get(name)?.includes(season),
                    `${player}: orphaned ${name} group table in ${season}`);
            }
        }
    }
    for (const [season, data] of Object.entries(DATA[player].seasons)) {
        for (const name of Object.keys(data.competitions || {})) {
            if (isFinalTournament(name)) {
                assert(tournamentSeasons.get(name)?.includes(season),
                    `${player}: orphaned ${name} season summary in ${season}`);
            }
        }
    }
}

// Jordan's 2026 World Cup remains entirely in 2026–27. Two results from
// the earlier season were England friendlies, not additional tournament games.
assert(!FULL_FIXTURES.jordan['2025–26']['World Cup']);
assert(!COMPETITION_TABLES.jordan['2025–26']['World Cup']);
assert(!DATA.jordan.seasons['2025–26'].competitions['World Cup']);
const worldCup = FULL_FIXTURES.jordan['2026–27']['World Cup'];
assert.equal(worldCup.length, 35);
assert(!worldCup.includes('Sweden 0 - 3 England'));
assert(!worldCup.includes('England 0 - 0 Ecuador'));
const friendlies = FULL_FIXTURES.jordan['2025–26']['International Friendlies'];
assert.equal(friendlies.length, 2);
assert(friendlies.includes('Sweden 0 - 3 England'));
assert(friendlies.includes('England 0 - 0 Ecuador'));
assert(DATA.jordan.seasons['2025–26'].competitions['International Friendlies']);
assert.equal(DATA.jordan.uefaRoundBreaks['2026–27|World Cup'][34], 'Final');
assert(!DATA.jordan.uefaRoundBreaks['2026–27|World Cup'][35]);
const app = require('./helpers/site-source').clientSource();
const roundsStart = app.indexOf('function tournamentRounds(');
const roundsEnd = app.indexOf('function fixtureTable(', roundsStart);
assert(roundsStart >= 0 && roundsEnd > roundsStart);
vm.runInContext(app.slice(roundsStart, roundsEnd), context);
const actualRounds = vm.runInContext("tournamentRounds('World Cup', FULL_FIXTURES.jordan['2026–27']['World Cup'], 'jordan', '2026–27')", context);
assert.equal(actualRounds[34], 'Final');
assert(!actualRounds[35]);
assert.equal(actualRounds[0], 'Group stage');

// Euro 2028's group stage, knockout rounds and single standings table live in 2028–29.
assert(!FULL_FIXTURES.jordan['2027–28'].Euros);
assert(!COMPETITION_TABLES.jordan['2027–28'].Euros);
assert(!DATA.jordan.seasons['2027–28'].competitions.Euros);
assert.equal(FULL_FIXTURES.jordan['2028–29'].Euros.length, 18);
assert.equal(FULL_FIXTURES.jordan['2028–29'].Euros[0], 'England 4 - 0 Scotland');
assert.equal(FULL_FIXTURES.jordan['2028–29'].Euros.at(-1), 'Sweden (3) 2 - 2 (1) Spain');

// Euro qualifiers still belong to their original individual seasons.
assert.equal(FULL_FIXTURES.jordan['2026–27']['Euros Qualifiers'].length, 7);
assert.equal(FULL_FIXTURES.jordan['2027–28']['Euros Qualifiers'].length, 1);

// Existing non-split Rens tournaments are not moved to a different season.
assert.equal(FULL_FIXTURES.rens['2032–33']['Euros 2032'].length, 18);
assert.equal(FULL_FIXTURES.rens['2034–35']['World Cup 2034'].length, 35);
console.log('All three players: single-season World Cup/Euros records and 2025–26 friendlies — PASS');
