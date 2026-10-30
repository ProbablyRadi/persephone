// Run: node --test tests/players/rens.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createSite, plain, root } = require('../helpers/site');
const finalSheet = require('../fixtures/rens-2035-final.json');

test('Rens 2035–36: completed standings, relegations, squad statistics and flags', () => {
    const site = createSite();
    const { context, evaluate } = site;
    const current = evaluate('SEASON_TABLES.rens["2035–36"]');
    assert.equal(current.league, 'Bundesliga');
    assert.equal(current.club, 'Borussia Dortmund');
    assert.deepEqual(plain(current.standings), finalSheet.standings);
    assert.deepEqual(plain(current.squad), finalSheet.squad);
    assert.equal(current.squad.length, 24);
    assert(current.standings.every(row => Number(row[2]) === 34 && Number(row[3]) + Number(row[4]) + Number(row[5]) === 34));
    assert(!evaluate('DATA.rens.seasons["2035–36"].inProgress'));
    const movement = evaluate('timelineLeagueMovement("rens", "2035–36", "2034–35")');
    assert.deepEqual(plain(movement.entered), ['1. FC Nürnberg', 'Hannover 96']);
    assert.equal(movement.inProgress, false);
    assert.deepEqual(plain(movement.relegated), ['1. FC Nürnberg', 'Hannover 96']);
    evaluate('careerTimeline("rens")');
    const card = context.app.innerHTML.split('<span>2035–36</span>')[1];
    assert(card.includes('68 pts'));
    assert(!card.includes('Not final — season in progress.'));
    for (const club of ['1. FC Nürnberg', 'Hannover 96']) {
        assert(card.includes('↑ 🇩🇪 ' + club));
        assert(card.includes('↓ 🇩🇪 ' + club));
    }
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
        'Jonathan Barcelos': '🇧🇷',
    };
    for (const [name, flag] of Object.entries(confirmedFlags)) {
        assert.equal(squadFlags[name], flag, `${name} nationality mapping`);
        const asset = vm.runInContext(`FLAG_ASSETS[${JSON.stringify(flag)}]`, context);
        assert(asset && fs.existsSync(path.join(root, asset)), `${name}: local flag asset missing`);
    }
    assert.equal(vm.runInContext('TEAM_FLAGS["North Macedonia"]', context), '🇲🇰');
    const html = vm.runInContext('squadTable(SEASON_TABLES.rens["2035–36"], "rens", false)', context);
    assert.equal((html.match(/<tr class=/g) || []).length, 24, 'All squad players should render');
    assert(html.includes('class="focus-player"'), 'Rens should be highlighted in squad');
    assert(html.includes('Gregor Kobel') && html.includes('Patrik Novotný'));
    assert(!html.includes('not yet been populated'));
});

test('Rens 2035–36: final results, career totals, honours, timeline and graphs', () => {
    const site = createSite();
    const { evaluate } = site;
    assert.deepEqual(plain(evaluate('FULL_FIXTURES.rens["2035–36"]')), finalSheet.fixtures);
    assert.deepEqual(plain(evaluate('DATA.rens.uefaRoundBreaks["2035–36|UEFA Champions League"]')), finalSheet.rounds);
    const record = evaluate(`(() => {
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
    assert.deepEqual(plain(record), { win: 20, draw: 8, loss: 6, gf: 67, ga: 37 });
    assert.deepEqual(plain(evaluate('DATA.rens.stats.at(-1).slice(4)')), ['1st', '6.8', 53, 48, 8, 18]);
    assert.deepEqual(plain(evaluate('DATA.rens.career[3].slice(2)')), [53, 48]);
    assert.deepEqual(plain(evaluate('DATA.rens.intl.slice(2)')), [48, 34]);
    assert.deepEqual(plain(evaluate('DATA.rens.careerAwards["2035–36"]')), { playerOfTheMonth: 3, playerOfTheMatch: 15 });
    assert(evaluate('DATA.rens.intro.at(-1).includes("48 appearances and scored 34 goals")'));
    const honours = evaluate('DATA.rens.honours["🇩🇪 Borussia Dortmund"]');
    for (const title of ['Bundesliga: 2035–36', 'DFB-Pokal: 2035–36', 'Player of the Season: 2035–36'])
        assert(honours.some(item => item.includes(title)));
    const bundesliga = evaluate('comparisonLeagueData("rens").find(league => league.name === "Bundesliga")');
    assert.deepEqual(plain(bundesliga.years), ['2033–34', '2034–35', '2035–36']);
    assert.equal(bundesliga.positions.get('Borussia Dortmund').get('2035–36'), 1);
    const finals = evaluate('timelineCupFinals("rens", "2035–36")');
    assert.equal(finals.find(f => f.comp === 'DFB-Pokal').winner, 'Borussia Dortmund');
    assert.equal(finals.find(f => f.comp === 'UEFA Champions League').winner, 'Manchester City');
    assert.equal(finals.find(f => f.comp === 'UEFA Europa League').winner, 'AS Roma');
    assert.equal(finals.find(f => f.comp === 'UEFA Conference League').winner, 'F.C. København');
    const weights = evaluate('h2hFixtureWeights("rens", "2035–36", "UEFA Champions League", FULL_FIXTURES.rens["2035–36"]["UEFA Champions League"], "Borussia Dortmund")');
    assert.equal(weights[18], 2, 'Round-of-16 aggregate represents both legs');
    assert.equal(weights[24], 2, 'Quarter-final aggregate represents both legs');
    const european = evaluate('COMPETITION_TABLES.rens["2035–36"]["UEFA Champions League"]');
    assert.equal(european.rows.length, 36);
    assert.deepEqual(plain(european.rows[1]), ['2', 'Borussia Dortmund', '8', '7', '0', '1', '16', '6', '10', '21']);
    for (const fixtures of Object.values(finalSheet.fixtures)) for (const raw of fixtures) {
        const match = evaluate('parseFixture(' + JSON.stringify(raw) + ')');
        for (const team of [match.home, match.away]) assert(evaluate('teamFlag(' + JSON.stringify(team) + ')'), team + ': missing flag');
    }
    site.navigate('#rens/2035–36');
    assert(site.app.innerHTML.includes('68 pts'));
    assert(!site.app.innerHTML.includes('In progress'));
    assert.equal((site.app.innerHTML.match(/class="fixture-match/g) || []).length, 91);
    site.navigate('#rens/stats');
    const stats = evaluate('statHistory(DATA.rens).at(-1)');
    assert.deepEqual(plain([stats.goals, stats.assists, stats.contributions, stats.cleanSheets]), [48, 8, 56, 18]);
    site.navigate('#rens/comparisons');
    assert(site.app.innerHTML.includes('2035–36'));
});
