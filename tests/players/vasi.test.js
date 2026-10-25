// Run this file with: node --test tests/players/vasi.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { createSite, plain, read } = require('../helpers/site');

test("Vasi 2028–29: final standings, corrected Juventus result and aggregate ties", () => {
    const site = createSite();
    const { context } = site;
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
    assert.deepEqual(Array.from(data.profile.stats.find(row => row[0] === '2028–29').slice(4)),
        ['1st', '6.9', 43, 37, 1, 15]);
    assert.deepEqual(Array.from(Object.values(data.profile.careerAwards['2028–29'])), [2, 10],
        'User-confirmed POTM and MOTM must appear in 2028–29');
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
});

test("Vasi 2029–30: exact supplied sheet and all dependent views", () => {
    const site = createSite();
    const { context } = site;
    const expected = JSON.parse(read('tests/fixtures/vasi-2029-final.json'));
    const evaluate = expression => vm.runInContext(expression, context);
    const player = evaluate('DATA.vasi');
    const season = player.seasons['2029–30'];
    const meta = evaluate("SEASON_TABLES.vasi['2029–30']");
    const fixtures = evaluate("FULL_FIXTURES.vasi['2029–30']");
    assert.equal(season.inProgress, false);
    assert.equal(season.table, '1st — 30 P, 24 W, 2 D, 4 L, 73 GF, 26 GA, +47, 74 pts');
    assert.deepEqual(plain(fixtures), expected.competitions, 'Every supplied score and injury label must be preserved');
    assert.deepEqual(plain(season.competitions), expected.competitions);
    assert.deepEqual(plain(meta.standings), expected.tables['Liga F']);
    assert.deepEqual(plain(meta.squad), expected.squad);
    assert.equal(meta.squad.length, 28);
    assert.deepEqual(plain(evaluate("PRESEASON_TABLES.vasi['2029–30'].rows")), expected.tables['Champions Trophy']);
    assert.deepEqual(plain(evaluate(`COMPETITION_TABLES.vasi['2029–30']["UEFA Women's Champions League"].rows`)), expected.tables["UEFA Women's Champions League"]);
    assert.deepEqual(plain(player.uefaRoundBreaks["2029–30|UEFA Women's Champions League"]), expected.rounds);
    assert.equal(fixtures['Liga F'].length, 30);
    assert.equal(fixtures["UEFA Women's Champions League"].length, 17);
    assert.equal(fixtures['Liga F'].filter(raw => raw.startsWith('Inj —')).length, 3);
    assert.equal(fixtures["UEFA Women's Champions League"].filter(raw => raw.startsWith('Inj —')).length, 2);

    // Independently tally the supplied league scores, using the shared parser to
    // preserve home/away identity when a score has an injury label.
    const leagueRecord = { played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0 };
    for (const raw of fixtures['Liga F']) {
        context.rawFixture = raw;
        const fixture = evaluate('parseFixture(rawFixture)');
        const home = fixture.home === 'FC Barcelona';
        const gf = home ? fixture.hg : fixture.ag;
        const ga = home ? fixture.ag : fixture.hg;
        leagueRecord.played++;
        leagueRecord.gf += gf;
        leagueRecord.ga += ga;
        leagueRecord[gf > ga ? 'wins' : gf < ga ? 'losses' : 'draws']++;
    }
    assert.deepEqual(leagueRecord, { played: 30, wins: 24, draws: 2, losses: 4, gf: 73, ga: 26 });
    assert.equal(leagueRecord.wins * 3 + leagueRecord.draws, 74);

    assert.deepEqual(plain(player.stats.map(row => row.slice(4))), [
        ['1st', '7.6', 33, 38, 5, 10],
        ['1st', '7.1', 42, 53, 7, 15],
        ['1st', '7.1', 44, 42, 9, 11],
        ['1st', '6.9', 43, 37, 1, 15],
        ['1st', '7.2', 38, 38, 2, 14]
    ]);
    assert.deepEqual(plain(player.career[0].slice(2)), [200, 208]);
    assert.deepEqual(plain(player.intl.slice(2)), [4, 2]);
    assert.deepEqual(plain(player.careerAwards['2029–30']), { playerOfTheMonth: 0, playerOfTheMatch: 8 });
    assert.equal(player.birth, 'Arachnes, Greece');
    assert(player.intro[0].includes('Born in Arachnes'));
    assert(player.intro[2].includes('200 appearances and scored 208 goals'));
    const honours = player.honours['🇪🇸 FC Barcelona Femení'];
    assert(honours[0].includes('2029–30'));
    assert(honours[1].includes('2029–30'));
    assert(honours[2].includes('2028–29, 2029–30'));
    assert(honours[3].includes('2026–27, 2027–28, 2028–29'));
    assert.equal(player.squadFlags['Tonje Knutsen'], '🇳🇴', 'Tonje’s nationality is confirmed as Norwegian');
    assert.deepEqual(plain(meta.squad.find(row => row[2] === 'Vasiliki Dimitriou')), ['ST', '9', 'Vasiliki Dimitriou', '38', '38', '2', '14']);

    const weights = evaluate(`h2hFixtureWeights('vasi', '2029–30', "UEFA Women's Champions League", FULL_FIXTURES.vasi['2029–30']["UEFA Women's Champions League"], 'FC Barcelona')`);
    assert.equal(weights[10], 2, 'Quarter-final aggregate represents two legs');
    assert.equal(weights[14], 2, 'Injury-marked semi-final aggregate still represents team fixtures');
    assert.equal(weights[16], 1, 'The final is one match');
    const totals = evaluate(`careerOpponentRows('vasi').reduce((sum,row) => ({
        played:sum.played+row.played, wins:sum.wins+row.wins, draws:sum.draws+row.draws, losses:sum.losses+row.losses
    }),{played:0,wins:0,draws:0,losses:0})`);
    assert.deepEqual(plain(totals), { played: 221, wins: 159, draws: 29, losses: 22 });
    const final = evaluate("timelineCupFinals('vasi','2029–30')").find(item => item.comp === "UEFA Women's Champions League");
    assert.equal(final.winner, 'FC Barcelona');
    assert.equal(final.runner, 'Chelsea');
    assert.equal(final.score, '2 - 0');

    // All dependent views must pick up the completed season from the shared data.
    evaluate("season('vasi','2029–30')");
    assert(context.app.innerHTML.includes('74 pts'));
    assert(context.app.innerHTML.includes('Semi-finals (agg)'));
    assert(context.app.innerHTML.includes('Tonje Knutsen'));
    assert(!context.app.innerHTML.includes('season-live'));
    evaluate("careerStats('vasi')");
    assert(context.app.innerHTML.includes('2029–30'));
    assert(context.app.innerHTML.includes('>40<'), 'Goal contributions should include 38 goals + 2 assists');
    evaluate("careerTimeline('vasi')");
    assert(context.app.innerHTML.includes('Tonje Knutsen'));
    evaluate("careerAnalysis('vasi')");
    assert(context.app.innerHTML.includes('221'));
    const league = evaluate("comparisonLeagueData('vasi')")[0];
    assert.equal(league.years.length, 5);
    assert.equal(league.positions.get('FC Barcelona').get('2029–30'), 1);
    assert.equal(league.positions.get('Sevilla FC').get('2029–30'), 2);
    assert.equal(league.positions.get('Real Madrid').get('2029–30'), 3);
    assert.equal(league.positions.get('SD Eibar').get('2029–30'), 16);
    evaluate("careerComparisons('vasi')");
    assert(context.app.innerHTML.includes('5 completed seasons'));
});
