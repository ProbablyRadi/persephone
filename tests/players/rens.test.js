// Run this file with: node --test tests/players/rens.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createSite, root } = require('../helpers/site');

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
