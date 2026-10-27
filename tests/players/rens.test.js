// Run this file with: node --test tests/players/rens.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createSite, plain, root } = require('../helpers/site');

test("Rens 2035–36: unranked league entrants and an unreported-stat Dortmund squad", () => {
    const site = createSite();
    const { context } = site;
    const expectedTeams = [
        'RB Leipzig', 'Borussia Dortmund', 'TSG Hoffenheim', 'Union Berlin',
        'Frankfurt', 'Leverkusen', 'FC Bayern München', 'VfB Stuttgart',
        'Hannover 96', 'VfL Wolfsburg', 'Hertha BSC', '1. FSV Mainz 05',
        'Hamburger SV', 'SV Werder Bremen', 'SC Freiburg', '1. FC Nürnberg',
        'FC Augsburg', '1. FC Köln',
    ];
    const current = vm.runInContext('SEASON_TABLES.rens["2035–36"]', context);
    const previous = vm.runInContext('SEASON_TABLES.rens["2034–35"]', context);
    assert.equal(current.league, 'Bundesliga');
    assert.equal(current.club, 'Borussia Dortmund');
    assert.equal(current.standings.length, 18);
    assert.deepEqual(Array.from(current.standings, row => row[1]), expectedTeams);
    assert(current.standings.every(row => row.length === 10 && row[0] === ''
        && row.slice(2).every(value => value === '')),
        'Unknown league positions and stats must remain blank');
    assert.equal(previous.standings[16][1], 'Holstein Kiel');
    assert.equal(previous.standings[17][1], 'Mönchengladbach');
    assert.equal(vm.runInContext('DATA.rens.seasons["2035–36"].inProgress', context), true);
    assert.equal(vm.runInContext('TEAM_FLAGS["Hannover 96"]', context), '🇩🇪');

    const movement = vm.runInContext('timelineLeagueMovement("rens", "2035–36", "2034–35")', context);
    assert.deepEqual(Array.from(movement.entered), ['Hannover 96', '1. FC Nürnberg']);
    assert.equal(movement.inProgress, true);
    assert.equal(movement.relegated, null, 'Current-season relegation is not known');

    vm.runInContext('careerTimeline("rens")', context);
    const currentCard = context.app.innerHTML.split('<span>2035–36</span>')[1];
    assert(currentCard, '2035–36 timeline card not present');
    assert(currentCard.includes('Entered'));
    for (const club of ['Hannover 96', '1. FC Nürnberg']) {
        assert(currentCard.includes(`↑ 🇩🇪 ${club}`), `${club} missing from the entrant list`);
    }
    assert(currentCard.includes('Not final — season in progress.'),
        'Current relegation should not be declared yet');
    assert(!currentCard.includes('Unknown — no previous table for this league is supplied.'),
        'Previous Bundesliga standings are available');

    // The in-progress Dortmund squad must preserve all supplied names, shirt
    // numbers and positions without inventing appearance or goal statistics.
    const expectedSquad = [
        ['GK', '1', 'Gregor Kobel'],
        ['GK', '12', 'Everton Teixeira'],
        ['CB', '39', 'Filippo Mane'],
        ['CB', '47', 'Elias Benkara'],
        ['CB', '4', 'Nico Schlotterbeck'],
        ['CB', '2', 'Kai Riedel'],
        ['CB', '3', 'Giulio Valentini'],
        ['RB', '5', 'Brooke Norton-Cuffy'],
        ['RB', '6', 'Samuel Flament'],
        ['CDM', '23', 'Tariq Benzai'],
        ['LM', '24', 'Pedro Villalba'],
        ['LM', '8', 'Ryan Cordier'],
        ['CM', '7', 'Kjell Wätjen'],
        ['CAM', '45', 'Danylo Krevsun'],
        ['CAM', '40', 'Samuele Inacio'],
        ['CAM', '17', 'Carney Chukwuemeka'],
        ['CAM', '15', 'Jonathan Friedrich'],
        ['CAM', '20', 'Petr Vávra'],
        ['CAM', '25', 'João Paulo Soares'],
        ['CAM', '19', 'Andon Mihov'],
        ['RAM', '46', 'Rens Adisea'],
        ['ST', '11', 'Endrick'],
        ['ST', '22', 'Patrik Novotný'],
    ];
    assert.deepEqual(
        Array.from(current.squad, row => Array.from(row.slice(0, 3))),
        expectedSquad,
        '2035–36 Dortmund roster differs from the supplied player list',
    );
    assert(current.squad.every(row => row.length === 7 && row.slice(3).every(value => value === '')),
        'In-progress individual stats should stay blank');
    const squadFlags = vm.runInContext('DATA.rens.squadFlags', context);
    const knownFlags = {
        'Gregor Kobel': '🇨🇭',
        'Filippo Mane': '🇮🇹',
        'Elias Benkara': '🇩🇿',
        'Nico Schlotterbeck': '🇩🇪',
        'Brooke Norton-Cuffy': '🏴\u{e0067}\u{e0062}\u{e0065}\u{e006e}\u{e0067}\u{e007f}',
        'Ryan Cordier': '🇫🇷',
        'Kjell Wätjen': '🇩🇪',
        'Danylo Krevsun': '🇺🇦',
        'Samuele Inacio': '🇮🇹',
        'Carney Chukwuemeka': '🏴\u{e0067}\u{e0062}\u{e0065}\u{e006e}\u{e0067}\u{e007f}',
        'Rens Adisea': '🇳🇱',
        'Endrick': '🇧🇷',
    };
    for (const [name, flag] of Object.entries(knownFlags)) {
        assert.equal(squadFlags[name], flag, `${name} nationality mapping`);
    }
    // The previously unknown game-generated nationalities were supplied by the user.
    const confirmedFlags = {
        'Everton Teixeira': '🇧🇷',
        'Kai Riedel': '🇩🇪',
        'Giulio Valentini': '🇮🇹',
        'Samuel Flament': '🇫🇷',
        'Tariq Benzai': '🇹🇳',
        'Pedro Villalba': '🇵🇾',
        'Jonathan Friedrich': '🇩🇪',
        'Petr Vávra': '🇸🇮',
        'João Paulo Soares': '🇧🇷',
        'Andon Mihov': '🇲🇰',
        'Patrik Novotný': '🇨🇿',
    };
    for (const [name, flag] of Object.entries(confirmedFlags)) {
        assert.equal(squadFlags[name], flag, `${name} nationality mapping`);
        const asset = vm.runInContext(`FLAG_ASSETS[${JSON.stringify(flag)}]`, context);
        assert(asset && fs.existsSync(path.join(root, asset)), `${name}: local flag asset missing`);
    }
    assert.equal(vm.runInContext('TEAM_FLAGS["North Macedonia"]', context), '🇲🇰');
    const html = vm.runInContext('squadTable(SEASON_TABLES.rens["2035–36"], "rens", true)', context);
    assert.equal((html.match(/<tr class=/g) || []).length, 23, 'All squad players should render');
    assert(html.includes('class="focus-player"'), 'Rens should be highlighted in squad');
    assert(html.includes('Gregor Kobel') && html.includes('Patrik Novotný'));
    assert(!html.includes('not yet been populated'));
});

test('Rens 2035–36: latest results, live record and dependent views match the supplied sheet', () => {
    const site = createSite();
    const { evaluate } = site;
    const expected = {
        'Pre-season friendlies': [
            'Borussia Dortmund 5 - 0 Inter Milan', 'AS Roma 0 - 1 Borussia Dortmund',
            'Borussia Dortmund 2 - 3 Arsenal'
        ],
        'Bundesliga': [
            'Leverkusen 0 - 2 Borussia Dortmund', 'VfB Stuttgart 3 - 2 Borussia Dortmund',
            'Borussia Dortmund 4 - 1 SC Freiburg', '1. FC Köln 1 - 2 Borussia Dortmund',
            'Borussia Dortmund 2 - 0 SV Werder Bremen', '1. FC Nürnberg 2 - 2 Borussia Dortmund',
            'Borussia Dortmund 6 - 0 FC Augsburg', 'Hamburger SV 0 - 1 Borussia Dortmund',
            'Borussia Dortmund 1 - 1 1. FSV Mainz 05', 'FC Bayern München 0 - 3 Borussia Dortmund'
        ],
        'F. Beckenbauer Supercup': ['FC Bayern München 1 - 4 Borussia Dortmund'],
        'DFB-Pokal': ['VfB Stuttgart 0 - 3 Borussia Dortmund'],
        'UEFA Champions League': [
            'Borussia Dortmund 2 - 0 Arsenal', 'Stade Rennais FC 1 - 2 Borussia Dortmund',
            'Borussia Dortmund 2 - 0 Rangers', 'Borussia Dortmund 1 - 4 OM'
        ],
        'Euros Qualifiers': ['Ukraine 2 - 1 Netherlands'],
        'International Friendlies': [
            'England 2 - 2 Netherlands', 'Netherlands 2 - 1 Iceland', 'France 0 - 6 Netherlands'
        ]
    };
    assert.deepEqual(plain(evaluate('FULL_FIXTURES.rens["2035–36"]')), expected);
    const leagueRecord = evaluate(`(() => {
        const totals = { win: 0, draw: 0, loss: 0, gf: 0, ga: 0 };
        for (const raw of FULL_FIXTURES.rens['2035–36'].Bundesliga) {
            const fixture = parseFixture(raw);
            const home = sameTeam(fixture.home, 'Borussia Dortmund');
            totals[outcome(fixture, 'Borussia Dortmund')]++;
            totals.gf += home ? fixture.hg : fixture.ag;
            totals.ga += home ? fixture.ag : fixture.hg;
        }
        return totals;
    })()`);
    assert.deepEqual(plain(leagueRecord), { win: 7, draw: 2, loss: 1, gf: 25, ga: 8 });
    const season = evaluate('DATA.rens.seasons["2035–36"]');
    assert(season.inProgress);
    assert.equal(season.table, 'In progress — 23 pts from 10 recorded matches; position not reported');
    assert(!season.summary.includes('73 pts'));
    assert(!season.competitions['UEFA Champions League'].join(' ').includes('6th'));
    assert.deepEqual(plain(evaluate('COMPETITION_TABLES.rens["2035–36"]')), {},
        'Blank European template rows must not retain a stale completed table');
    assert.equal(evaluate('PRESEASON_TABLES.rens["2035–36"].rows[1][9]'), '6');
    assert.deepEqual(plain(evaluate('DATA.rens.stats.at(-1).slice(4)')), ['—', '—', '—', '—', '—', '—'],
        'Team results do not supply Rens’s individual statistics');
    assert(evaluate('comparisonLeagueData("rens").every(league => !league.years.includes("2035–36"))'));

    site.navigate('#rens/2035–36');
    for (const competition of Object.keys(expected)) assert(site.app.innerHTML.includes(competition));
    assert(site.app.innerHTML.includes('23 pts from 10 recorded matches'));
    assert(!site.app.innerHTML.includes('League phase table'), 'Unreported European standings stay hidden');
    assert.equal((site.app.innerHTML.match(/class="fixture-match/g) || []).length, 23);
    for (const [competition, fixtures] of Object.entries(expected)) {
        const focal = evaluate(`focalFor('rens', '2035–36', ${JSON.stringify(competition)})`);
        assert.equal(focal, /Qualifiers|Friendlies/.test(competition) ? 'Netherlands' : 'Borussia Dortmund');
        for (const raw of fixtures) {
            const fixture = evaluate(`parseFixture(${JSON.stringify(raw)})`);
            for (const team of [fixture.home, fixture.away])
                assert(evaluate(`teamFlag(${JSON.stringify(team)})`), `${team}: missing flag`);
        }
    }
});
