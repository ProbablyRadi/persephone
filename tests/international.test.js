// Run this file with: node --test tests/international.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { createSite, plain } = require('./helpers/site');

// Bare names use the nearest normal four-year edition. This keeps a split
// 2025–26/2026–27 World Cup together without merging it with World Cup 2030.
function editionKey(name, season) {
    const match = name.match(/^(World Cup|Euros)(?: (\d{4}))?$/);
    const cycle = match[1] === 'World Cup' ? 2026 : 2028;
    const year = match[2] ? Number(match[2]) : cycle + 4 * Math.round((Number(season.slice(0, 4)) - cycle) / 4);
    return match[1] + ' ' + year;
}

function validateTournamentLocations({ DATA, FULL_FIXTURES, COMPETITION_TABLES }) {
    const isFinalTournament = name => /^(?:World Cup|Euros)(?: \d{4})?$/.test(name);

    for (const player of ['rens', 'jordan', 'vasi']) {
        const tournamentSeasons = new Map();
        for (const [season, competitions] of Object.entries(FULL_FIXTURES[player])) {
            for (const [name, matches] of Object.entries(competitions)) {
                if (!isFinalTournament(name)) continue;
                const key = editionKey(name, season);
                const registeredSeasons = tournamentSeasons.get(key) || [];
                registeredSeasons.push(season);
                tournamentSeasons.set(key, registeredSeasons);
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
                    assert(tournamentSeasons.get(editionKey(name, season))?.includes(season),
                        `${player}: orphaned ${name} group table in ${season}`);
                }
            }
        }
        for (const [season, data] of Object.entries(DATA[player].seasons)) {
            for (const name of Object.keys(data.competitions || {})) {
                if (isFinalTournament(name)) {
                    assert(tournamentSeasons.get(editionKey(name, season))?.includes(season),
                        `${player}: orphaned ${name} season summary in ${season}`);
                }
            }
        }
    }
}

test("Tournament editions stay together without treating different World Cups as duplicates", () => {
    const site = createSite();
    const { context } = site;
    const { DATA, FULL_FIXTURES, COMPETITION_TABLES } = vm.runInContext(
        '({ DATA, FULL_FIXTURES, COMPETITION_TABLES })', context);
    validateTournamentLocations({ DATA, FULL_FIXTURES, COMPETITION_TABLES });

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
    const actualRounds = vm.runInContext("tournamentRounds('World Cup', FULL_FIXTURES.jordan['2026–27']['World Cup'], 'jordan', '2026–27')", context);
    assert.equal(actualRounds[34], 'Final');
    assert(!actualRounds[35]);
    assert.equal(actualRounds[0], 'Group stage');

    // The 2030 edition also belongs only to its finishing-year season.
    assert(!FULL_FIXTURES.jordan['2029–30']['World Cup']);
    assert(!COMPETITION_TABLES.jordan['2029–30']?.['World Cup']);
    assert(!DATA.jordan.seasons['2029–30'].competitions['World Cup']);
    assert.equal(FULL_FIXTURES.jordan['2030–31']['World Cup'].length, 35);

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

    // All eight supplied Rens qualifiers belong to 2035–36, including Ukraine away.
    assert.deepEqual(plain(FULL_FIXTURES.rens['2035–36']['Euros Qualifiers']), [
        'Wales 2 - 4 Netherlands', 'Netherlands 2 - 0 Ukraine',
        'Czechia 1 - 2 Netherlands', 'Netherlands 3 - 0 Denmark',
        'Netherlands 3 - 0 Wales', 'Denmark 1 - 2 Netherlands',
        'Netherlands 1 - 1 Czechia', 'Ukraine 2 - 1 Netherlands'
    ]);
    assert(!FULL_FIXTURES.rens['2034–35']['Euros Qualifiers']);
    assert.equal(DATA.rens.seasons['2035–36'].competitions['Euros Qualifiers'].length, 8);
    assert(!DATA.rens.seasons['2034–35'].competitions['Euros Qualifiers']);
    assert(!DATA.rens.seasons['2034–35'].summary.includes('qualifiers'));
    site.navigate('#rens/2034–35');
    assert(!site.app.innerHTML.includes('section-euros-qualifiers'));
    site.navigate('#rens/2035–36');
    assert(site.app.innerHTML.includes('section-euros-qualifiers'));
    assert(site.app.innerHTML.includes('Wales'));
});

test("World Cup podiums use final/third-place scores, including penalties and missing-result cases", () => {
    const site = createSite();
    const { context } = site;
    for (const { id, season, competition, winner, runner, third } of [
        { id: 'jordan', season: '2026–27', competition: 'World Cup',
            winner: 'Netherlands', runner: 'England', third: 'Spain' },
        { id: 'rens', season: '2034–35', competition: 'World Cup 2034',
            winner: 'Netherlands', runner: 'Belgium', third: 'England' },
    ]) {
        const finals = vm.runInContext(`timelineCupFinals('${id}', '${season}')`, context);
        const podium = finals.find(item => item.comp === competition);
        assert(podium, `Missing ${id} ${competition} from cup finals`);
        assert.equal(podium.winner, winner, `${id}: winner`);
        assert.equal(podium.runner, runner, `${id}: runner-up`);
        assert.equal(podium.third, third, `${id}: third place`);

        vm.runInContext(`careerTimeline('${id}')`, context);
        const html = context.app.innerHTML;
        const start = html.indexOf(`<b>${competition}</b>`);
        assert(start >= 0, `${id}: World Cup missing from Timeline`);
        const cupHtml = html.slice(start, html.indexOf('</div>', start));
        for (const [label, team] of [
            ['Winner', winner], ['Runner-up', runner], ['Third place', third],
        ]) {
            assert(cupHtml.includes(`${label}:`), `${id}: ${label} missing`);
            assert(cupHtml.includes(team), `${id}: ${team} missing`);
        }
        assert(cupHtml.includes('country-flag') || cupHtml.includes('🇳🇱'),
            'Expected native flag code for country image conversion');

    }

    // Unrecorded third place must not be fabricated. Other cup finals must not
    // unexpectedly gain a third-place line.
    const other = vm.runInContext("timelineCupFinals('vasi', '2028–29')", context);
    assert(other.every(item => !item.third));
    vm.runInContext("careerTimeline('vasi')", context);
    assert(!context.app.innerHTML.includes('Third place:'),
        'A non-World Cup season should not show a third-place field');

    // Ensure penalty shoot-out results can decide the podium.
    assert.equal(vm.runInContext("timelineFixtureWinner(parseFixture('Spain (5) 1 - 1 (4) Brazil'))", context), 'Spain');
    assert.equal(vm.runInContext("timelineFixtureWinner(parseFixture('Spain 1 - 1 Brazil'))", context), '');
});

test('Tournament validation still rejects split editions, duplicate fixtures and orphaned tables', () => {
    const site = createSite();
    const snapshot = () => plain(site.evaluate('({ DATA, FULL_FIXTURES, COMPETITION_TABLES })'));
    const split = snapshot();
    split.FULL_FIXTURES.jordan['2025–26']['World Cup'] = split.FULL_FIXTURES.jordan['2026–27']['World Cup'];
    split.COMPETITION_TABLES.jordan['2025–26']['World Cup'] = split.COMPETITION_TABLES.jordan['2026–27']['World Cup'];
    split.DATA.jordan.seasons['2025–26'].competitions['World Cup'] = ['England 1 - 0 Spain'];
    assert.throws(() => validateTournamentLocations(split), /World Cup 2026 must appear on one season page/);

    const duplicate = snapshot();
    const matches = duplicate.FULL_FIXTURES.jordan['2026–27']['World Cup'];
    matches.push(matches[0]);
    assert.throws(() => validateTournamentLocations(duplicate), /duplicate fixture/);

    const orphan = snapshot();
    orphan.COMPETITION_TABLES.jordan['2025–26']['World Cup'] = orphan.COMPETITION_TABLES.jordan['2026–27']['World Cup'];
    assert.throws(() => validateTournamentLocations(orphan), /orphaned World Cup group table/);
});
