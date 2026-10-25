// Run this file with: node --test tests/players/jordan.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createSite, root } = require('../helpers/site');

test("Jordan 2028–29: completed Bristol season, European ties and timeline", () => {
    const site = createSite();
    const { context } = site;
    const snapshot = vm.runInContext(`(() => {
        const data = DATA.jordan;
        const fixtures = FULL_FIXTURES.jordan['2028–29'];
        const meta = SEASON_TABLES.jordan['2028–29'];
        const league = COMPETITION_TABLES.jordan['2028–29']['UEFA Europa League'];
        return {
            clubApps: data.career[0][2], clubGoals: data.career[0][3],
            season: data.seasons['2028–29'],
            stats: data.stats.find(row => row[0] === '2028–29'),
            awards: data.careerAwards['2028–29'],
            fixtures, meta, europaLeagueTable: league,
            preseason: PRESEASON_TABLES.jordan['2028–29'],
            europeanRounds: data.uefaRoundBreaks['2028–29|UEFA Europa League'],
            finalMatches: timelineCupFinals('jordan', '2028–29'),
            squadMovement: timelineSquadChanges('jordan', '2028–29', '2027–28'),
        };
    })()`, context);

    assert.equal(snapshot.clubApps, 208);
    assert.equal(snapshot.clubGoals, 1);
    assert.equal(snapshot.season.inProgress, undefined);
    assert.equal(snapshot.season.table, '11th — 49 pts');
    assert.equal(snapshot.stats[4], '11th');
    assert.equal(snapshot.stats[5], '6.3');
    assert.deepEqual(Array.from(snapshot.stats.slice(6)), [59, 0, 5, 18]);
    assert.equal(snapshot.awards.playerOfTheMonth, 0);
    assert.equal(snapshot.awards.playerOfTheMatch, 2);

    const fixtures = snapshot.fixtures;
    for (const [name, expectedCount] of Object.entries({
        'Champions Trophy': 3,
        'Premier League': 38,
        'Carabao Cup': 4,
        'FA Cup': 3,
        'FA Community Shield': 1,
        'UEFA Europa League': 31,
        'Euros': 18,
        'International Friendlies': 8,
    })) {
        assert.equal(fixtures[name].length, expectedCount, `${name}: incorrect fixture count`);
    }
    assert.equal(snapshot.meta.squad.length, 32);
    assert.equal(snapshot.meta.squad[0][2], 'Jordan Vale');
    assert.deepEqual(Array.from(snapshot.meta.squad[0].slice(3)), ['59', '0', '5', '18']);
    assert.equal(snapshot.meta.standings.length, 20);
    assert.deepEqual(Array.from(snapshot.meta.standings[10].slice(0, 2)), ['11', 'Bristol City']);
    assert.deepEqual(Array.from(snapshot.meta.standings[10].slice(2)),
        ['38', '13', '10', '15', '47', '51', '-4', '49']);
    assert.equal(snapshot.preseason.rows.length, 8);
    assert.equal(snapshot.europaLeagueTable.rows.length, 36);
    assert.equal(snapshot.europaLeagueTable.rows[10][1], 'Bristol City');
    assert.equal(snapshot.europeanRounds[8], 'Knockout play-offs (agg)');
    assert.equal(snapshot.europeanRounds[16], 'Round of 16 (agg)');
    assert.equal(snapshot.europeanRounds[30], 'Final');

    const weights = vm.runInContext(`h2hFixtureWeights(
        'jordan', '2028–29', 'UEFA Europa League',
        FULL_FIXTURES.jordan['2028–29']['UEFA Europa League'], 'Bristol City'
    )`, context);
    assert.equal(weights[10], 2, 'Nordsjælland tie counts as 2 played matches');
    assert.equal(weights[18], 2, 'Club Brugge tie counts as 2 played matches');
    const opponents = vm.runInContext(`careerOpponentRows('jordan')`, context);
    const nord = opponents.find(row => row.opponent === 'FC Nordsjælland');
    assert(nord && nord.played >= 3 && nord.wins >= 2,
        'UEFA league phase + play-off results should both contribute to H2H');
    assert(snapshot.finalMatches.some(row => row.comp === 'FA Cup'
        && row.winner === 'Liverpool' && row.runner === 'Millwall'));
    assert(snapshot.finalMatches.some(row => row.comp === 'Carabao Cup'
        && row.winner === 'Fulham' && row.runner === 'Newcastle United'));
    assert(snapshot.finalMatches.some(row => row.comp === 'UEFA Europa League'
        && row.winner === 'RB Leipzig'));
    assert(snapshot.squadMovement.joined.length >= 1, 'Timeline has squad movements');

    vm.runInContext(`season('jordan', '2028–29')`, context);
    assert(context.app.innerHTML.includes('11th — 49 pts'), 'Completed season not visible');
    assert(context.app.innerHTML.includes('Champions Trophy table'), 'Missing pre-season trophy table');
    assert(context.app.innerHTML.includes('Round of 16 (agg)'), 'Missing European knockout headings');
    assert(context.app.innerHTML.includes('Arsenal'), 'League standings failed to render');
    assert(!context.app.innerHTML.includes('season-live'), 'Season incorrectly marked as live');

    vm.runInContext(`careerTimeline('jordan')`, context);
    assert(context.app.innerHTML.includes('Liverpool'), 'FA Cup winner missing on timeline');
    assert(context.app.innerHTML.includes('RB Leipzig'), 'Europa League winner missing on timeline');
    assert(context.app.innerHTML.includes('Bristol City'), 'Player club missing on timeline');
    assert.equal(snapshot.season.inProgress, undefined,
        'The completed 2028–29 season must remain marked completed');
});

test("Jordan 2029–30: final United results, roster changes and neutral finals", () => {
    const site = createSite();
    const { context } = site;
    const details = vm.runInContext(`(() => {
        const d = DATA.jordan;
        return {
            career: d.career,
            stats: d.stats.find(row => row[0] === '2029–30'),
            future: d.careerOverviewFutureRows,
            season: d.seasons['2029–30'],
            fixtures: FULL_FIXTURES.jordan['2029–30'],
            meta: SEASON_TABLES.jordan['2029–30'],
            preSeason: PRESEASON_TABLES.jordan['2029–30'],
            squadUpdates: d.timelineInSeasonSquadUpdates['2029–30'],
            flags: d.squadFlags,
        };
    })()`, context);

    // The 2029–30 record is now a finished season, not an in-progress snapshot.
    assert.deepEqual(Array.from(details.career[0].slice(2)), [208, 1]);
    assert.deepEqual(Array.from(details.career[1].slice(2)), [48, 0]);
    assert.equal(details.season.inProgress, undefined);
    assert.equal(details.season.pendingFixtures, undefined);
    assert.deepEqual(Array.from(details.stats.slice(4)), ['4th', '6.5', 48, 0, 0, 18]);
    assert(!details.future.some(row => row[0] === '2029–30'));
    assert(details.season.summary.includes('Carabao Cup'));
    assert(details.season.table.startsWith('4th — 74 pts'));
    assert.equal(details.preSeason.rows.length, 8);
    assert(vm.runInContext('DATA.jordan.honours["🏴󠁧󠁢󠁥󠁮󠁧󠁿 Manchester United"]', context)
        .includes('Carabao Cup: 2029–30 🏆'));

    const fixtures = details.fixtures;
    assert.deepEqual(Object.keys(fixtures), [
        'Champions Trophy', 'Premier League', 'Carabao Cup',
        'FA Cup', 'UEFA Champions League', 'UEFA Europa League',
        'UEFA Conference League', 'International Friendlies',
    ]);
    for (const [competition, count] of Object.entries({
        'Champions Trophy': 3,
        'Premier League': 38,
        'Carabao Cup': 6,
        'FA Cup': 3,
        'UEFA Champions League': 1,
        'UEFA Europa League': 1,
        'UEFA Conference League': 1,
        'International Friendlies': 8,
    })) {
        assert.equal(fixtures[competition].length, count, `${competition}: incorrect fixture total`);
    }
    assert(fixtures['Premier League'].includes('Manchester United 0 - 1 Liverpool'));
    assert(fixtures['Premier League'].includes('Manchester United 2 - 1 Coventry City'));
    assert(fixtures['Carabao Cup'].includes('F — Leeds United 0 - 1 Manchester United'));
    assert(fixtures['FA Cup'].includes('F — Liverpool 0 - 1 Manchester City'));
    assert(fixtures['International Friendlies'].includes('Finland 0 - 3 England'));
    // European finals supplied for the season overview (neither United nor England played).
    const europeanFinals = {
        'UEFA Champions League': {
            fixture: 'F — OM (2) 2 - 2 (4) Real Madrid',
            winner: 'Real Madrid', runner: 'OM',
        },
        'UEFA Europa League': {
            fixture: 'F — SSC Napoli 1 - 2 VfB Stuttgart',
            winner: 'VfB Stuttgart', runner: 'SSC Napoli',
        },
        'UEFA Conference League': {
            fixture: 'F — Real Sociedad 2 - 1 AS Roma',
            winner: 'Real Sociedad', runner: 'AS Roma',
        },
    };
    for (const [competition, result] of Object.entries(europeanFinals)) {
        assert.deepEqual(Array.from(fixtures[competition]), [result.fixture]);
        assert.deepEqual(Array.from(details.season.competitions[competition]), [result.fixture]);
        assert.equal(vm.runInContext(`DATA.jordan.uefaRoundBreaks['2029–30|${competition}'][0]`, context), 'Final');
    }
    const finals = Array.from(vm.runInContext('timelineCupFinals("jordan", "2029–30")', context));
    for (const [competition, result] of Object.entries(europeanFinals)) {
        const actual = finals.find(entry => entry.comp === competition);
        assert(actual, `Timeline did not recognise the ${competition} final`);
        assert.equal(actual.winner, result.winner, `${competition} winner`);
        assert.equal(actual.runner, result.runner, `${competition} runner-up`);
    }

    // Independently verify the 38 final Premier League scores against the table.
    let record = { played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0 };
    for (const fixture of fixtures['Premier League']) {
        const match = fixture.match(/^(.+?) (\d+) - (\d+) (.+)$/);
        assert(match, `Unparseable league score: ${fixture}`);
        const [, home, hg, ag, away] = match;
        assert(home === 'Manchester United' || away === 'Manchester United');
        const forGoals = home === 'Manchester United' ? Number(hg) : Number(ag);
        const againstGoals = home === 'Manchester United' ? Number(ag) : Number(hg);
        record.played++;
        record.gf += forGoals;
        record.ga += againstGoals;
        if (forGoals > againstGoals) record.wins++;
        else if (forGoals < againstGoals) record.losses++;
        else record.draws++;
    }
    assert.deepEqual(record, { played: 38, wins: 23, draws: 5, losses: 10, gf: 72, ga: 44 });
    const standings = details.meta.standings;
    assert.equal(standings.length, 20);
    assert.deepEqual(Array.from(standings[3]), [
        '4', 'Manchester United', '38', '23', '5', '10', '72', '44', '28', '74',
    ]);
    assert(standings.every((row, i) => row[0] === String(i+1) && row[2] === '38'));
    assert.deepEqual(Array.from(standings.slice(-3).map(row => row[1])),
        ['Bristol City', 'Burnley', 'Sunderland']);

    const squad = details.meta.squad;
    assert.equal(squad.length, 39);
    assert.equal(new Set(squad.map(row => row[2])).size, 39);
    assert.deepEqual(Array.from(squad[0]), ['GK','1','Jordan Vale','48','0','0','18']);
    for (const name of ['Andre Garcia', 'Marco Palestra', 'Hugo Ekitiké', 'Gabriele Biancheri']) {
        assert(squad.some(row => row[2] === name), `Missing final-roster addition: ${name}`);
    }
    assert.deepEqual(Array.from(squad.find(row => row[2] === 'Hugo Ekitiké')),
        ['ST','18','Hugo Ekitiké','25','17','7','11']);
    for (const name of ['Benjamin Šeško', 'Florian Daems', 'Rik Dekker', 'Sergiño Dest']) {
        assert(!squad.some(row => row[2] === name), `Removed player remains in squad: ${name}`);
        assert(details.squadUpdates.removed.includes(name), `Missing Timeline removal: ${name}`);
    }
    for (const name of ['Emeka Adiele', 'Andre Garcia', 'Marco Palestra',
        'Hugo Ekitiké', 'Gabriele Biancheri']) {
        assert(details.squadUpdates.added.includes(name), `Missing Timeline addition: ${name}`);
    }
    assert.equal(details.flags['Emeka Adiele'], '🏴󠁧󠁢󠁥󠁮󠁧󠁿');
    assert.equal(details.flags['Andre Garcia'], '🏴󠁧󠁢󠁥󠁮󠁧󠁿');
    assert.equal(vm.runInContext('FLAG_ASSETS[DATA.jordan.squadFlags["Emeka Adiele"]]', context), 'assets/flags/England.png');
    assert.equal(vm.runInContext('FLAG_ASSETS[DATA.jordan.squadFlags["Andre Garcia"]]', context), 'assets/flags/England.png');
    assert.equal(details.flags['Marco Palestra'], '🇮🇹');
    assert.equal(details.flags['Hugo Ekitiké'], '🇫🇷');
    assert.equal(details.flags['Gabriele Biancheri'], '🏴󠁧󠁢󠁷󠁬󠁳󠁿');

    vm.runInContext("season('jordan', '2029–30')", context);
    const html = context.app.innerHTML;
    assert(!html.includes('season-live') && !html.includes('In progress'), 'Season must be completed');
    assert(html.includes('4th — 74 pts'));
    assert(html.includes('Leeds United'));
    assert(html.includes('Stevenage'));
    assert(html.includes('Hugo Ekitiké'));
    assert(html.includes('Champions Trophy table'));
    for (const [competition, result] of Object.entries(europeanFinals)) {
        assert(html.includes(competition), `Missing season section: ${competition}`);
        assert(html.includes(result.winner) && html.includes(result.runner));
    }

    assert(html.includes('Manchester United'));
    assert(!html.includes('No fixtures recorded yet.'));

    const statTable = vm.runInContext('careerStatsTable(DATA.jordan)', context);
    assert(statTable.includes('2029–30'));
    assert(statTable.includes('48'));
    vm.runInContext("careerTimeline('jordan')", context);
    const timeline = context.app.innerHTML;
    assert(timeline.includes('Manchester United'));
    assert(timeline.includes('Leeds United') && timeline.includes('Carabao Cup'));
    for (const [competition, result] of Object.entries(europeanFinals)) {
        assert(timeline.includes(`<b>${competition}</b>`), `Missing Timeline final: ${competition}`);
        assert(timeline.includes(`Winner: `) && timeline.includes(result.winner));
        assert(timeline.includes(`Runner-up: `) && timeline.includes(result.runner));
    }
    // Neutral European finals are excluded from Jordan's Head to Head.
    const h2h = vm.runInContext("careerOpponentRows('jordan')", context);
    const totals = Array.from(h2h).reduce((sum, opponent) => {
        sum.played += opponent.played;
        sum.wins += opponent.wins;
        sum.draws += opponent.draws;
        sum.losses += opponent.losses;
        return sum;
    }, {played: 0, wins: 0, draws: 0, losses: 0});
    assert.deepEqual(totals, { played: 319, wins: 164, draws: 66, losses: 87 });

    assert(timeline.includes('<b>Joined</b>'));
    assert(timeline.includes('<b>Left</b>'));
    for (const name of [...details.squadUpdates.added, ...details.squadUpdates.removed]) {
        assert(timeline.includes(name), `Missing Timeline squad movement: ${name}`);
    }
    assert(!timeline.includes('Club changed — squad comparison resets for the new club.'));
    assert(!timeline.includes('In-season squad update —'));
    assert(!timeline.includes('Removed names are not confirmed transfers.'));
});

test("Jordan 2030–31: live Brighton season and the 2030 World Cup", () => {
    const site = createSite();
    const { context } = site;
    const { DATA, FULL_FIXTURES, SEASON_TABLES, PRESEASON_TABLES, COMPETITION_TABLES } =
        vm.runInContext('({DATA, FULL_FIXTURES, SEASON_TABLES, PRESEASON_TABLES, COMPETITION_TABLES})', context);
    const profile = DATA.jordan;
    const current = profile.seasons['2030–31'];
    const fixtures = FULL_FIXTURES.jordan['2030–31'];
    const league = SEASON_TABLES.jordan['2030–31'];

    assert(current.inProgress);
    assert(profile.current.includes('Brighton & Hove'));
    assert.equal(profile.number, '99');
    assert.equal(profile.bootBrand, 'New Balance');
    assert.deepEqual(Array.from(profile.intl.slice(2)), [50, 0]);
    assert(profile.honours['🏴󠁧󠁢󠁥󠁮󠁧󠁿 England'].includes('FIFA World Cup winners: 2030 🏆'));
    assert(profile.honours['🏴󠁧󠁢󠁥󠁮󠁧󠁿 England'].includes('FIFA World Cup Golden Glove: 2030 🧤'));
    assert.equal(profile.stats.at(-1)[0], '2030–31');
    assert.deepEqual(Array.from(profile.stats.at(-1).slice(6)), [7, 0, 0, 3]);
    assert.deepEqual(Array.from(profile.career[2].slice(2)), [7, 0]);
    assert.equal(fixtures['Champions Trophy'].length, 3);
    assert(fixtures['Champions Trophy'].every(match => match.includes('Brighton & Hove')));
    assert.equal(PRESEASON_TABLES.jordan['2030–31'].rows.length, 8);
    assert.equal(league.standings.length, 20);
    assert.equal(league.squad.length, 34);
    assert(league.standings.every(row => row[0] === '—' && row[2] === '' && row[9] === ''),
        'Source contains placeholder order and 38-match schedule, not finished standings');
    assert.equal(league.standings.filter(row => row[1] === 'Wolves').length, 1,
        'The original Wolves entry should remain');
    assert.equal(league.standings.filter(row => row[1] === 'Fulham').length, 1,
        'The second Wolves entry is corrected to Fulham');
    assert.equal(league.standings[18][1], 'Fulham',
        'The corrected entry should be in the original 19th listing');
    assert.equal(new Set(league.standings.map(row => row[1])).size, 20,
        'The 2030–31 membership list should contain 20 distinct clubs');
    const confirmedBrightonFlags = {
        'Amnay Aït Zekran': '🇩🇿',
        'Lance White': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        'Josen Escobar': '🇨🇴',
        'Kirk Leitch': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
        'Nehemiah Oriola': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        'Kamari Doyle': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        'Maxloren Castro': '🇵🇪',
        'Felipe Chavez': '🇪🇸',
    };
    for (const [name, flag] of Object.entries(confirmedBrightonFlags)) {
        assert(league.squad.some(row => row[2] === name), `Missing Brighton player ${name}`);
        assert.equal(profile.squadFlags[name], flag, `Incorrect nationality for ${name}`);
        const pathToFlag = vm.runInContext('FLAG_ASSETS', context)[flag];
        assert(pathToFlag, `No local PNG mapping for ${name}'s flag`);
        assert(fs.existsSync(path.join(root, pathToFlag)), `Missing PNG asset for ${name}`);
    }
    assert.deepEqual(Array.from(fixtures['Premier League']), [
        'Coventry City 0 - 0 Brighton & Hove',
        'Brighton & Hove 2 - 0 Ipswich',
        'Manchester City 2 - 0 Brighton & Hove'
    ]);
    assert.deepEqual(Array.from(fixtures['Carabao Cup']), ['MK Dons 1 - 3 Brighton & Hove']);
    assert(current.summary.includes('seven recorded appearances'));
    assert(current.competitions['Carabao Cup'].length === 1);
    assert.equal(current.table, '3 played — 4 pts, 1 W, 1 D, 1 L, 2 GF, 2 GA');
    const expectedBrightonSquad = [
        ['Jordan Vale', 99, 7, 0, 0, 3],
        ['Cherif Diouf', 1, 0, 0, 0, 0],
        ['Carlos Romero', 28, 7, 1, 1, 3],
        ['Lance White', 3, 7, 0, 0, 3],
        ['Samuele Fabbri', 4, 3, 0, 0, 1],
        ['Yasin Ayari', 26, 7, 1, 3, 2],
        ['Carlos Baleba', 17, 7, 1, 1, 3],
        ['Kirk Leitch', 18, 2, 1, 0, 1],
        ['Tom Watson', 41, 7, 3, 1, 3],
        ['Yankuba Minteh', 11, 7, 2, 1, 3],
        ['Endrick', 9, 7, 2, 1, 3]
    ];
    for (const [name, number, app, goals, assists, cls] of expectedBrightonSquad) {
        const row = league.squad.find(row => row[2] === name);
        assert(row, `Missing player ${name}`);
        assert.deepEqual(Array.from(row.slice(1)), [String(number), name, String(app), String(goals), String(assists), String(cls)]);
    }
    assert(!league.squad.some(row => ['Eíran Cashin', 'Besian Kutleshi'].includes(row[2])));
    assert.equal(profile.squadFlags['Tom Watson'], '🏴󠁧󠁢󠁥󠁮󠁧󠁿');
    // User-confirmed new squad players display local Senegal / Italy PNGs.
    for (const [name, flag] of [
        ['Cherif Diouf', '🇸🇳'],
        ['Samuele Fabbri', '🇮🇹'],
    ]) {
        assert.equal(profile.squadFlags[name], flag, `Missing/incorrect flag for ${name}`);
        const assetPath = vm.runInContext('FLAG_ASSETS', context)[flag];
        assert(assetPath, `Missing PNG mapping for ${name}`);
        assert(fs.existsSync(path.join(root, assetPath)), `Missing PNG image for ${name}`);
    }
    // Stuttgart spelling resolves through the shared German club flag mapping.
    const stuttgart = PRESEASON_TABLES.jordan['2030–31'].rows.find(row => row[1] === 'VfB Stuttgart');
    assert(stuttgart, 'Stuttgart must appear in the Champions Trophy table');
    assert.equal(vm.runInContext('teamFlag("VfB Stuttgart")', context), '🇩🇪');
    assert.equal(vm.runInContext('FLAG_ASSETS["🇩🇪"]', context), 'assets/flags/Germany.png');
    assert.equal(fixtures['World Cup'].length, 35);
    assert.equal(fixtures['World Cup'].filter(game => game.includes('England')).length, 8);
    assert.equal(fixtures['World Cup'].at(-1), 'F — England 1 - 0 Spain');
    assert.equal(COMPETITION_TABLES.jordan['2030–31']['World Cup'].groups.length, 12);
    assert(COMPETITION_TABLES.jordan['2030–31']['World Cup'].groups.every(group => group.rows.length === 4));

    const movement = vm.runInContext("timelineLeagueMovement('jordan', '2030–31', '2029–30')", context);
    assert.deepEqual(Array.from(movement.entered).sort(), ['Fulham', 'Ipswich', 'Leeds United']);
    assert.equal(movement.inProgress, true);
    assert.equal(movement.relegated, null);
    const squadChanges = vm.runInContext("timelineSquadChanges('jordan', '2030–31', '2029–30')", context);
    assert.equal(squadChanges.comparisonSkipped, true,
        'Changing from Manchester United to Brighton must not show misleading joined/left lists');
    const podium = vm.runInContext("timelineCupFinals('jordan', '2030–31')", context)
        .find(cup => cup.comp === 'World Cup');
    assert.deepEqual({ winner: podium.winner, runner: podium.runner, third: podium.third },
        { winner: 'England', runner: 'Spain', third: 'Uruguay' });
    vm.runInContext("careerTimeline('jordan')", context);
    const html = context.app.innerHTML;
    const start = html.indexOf('<span>2030–31</span>');
    const end = html.indexOf('</article>', start);
    assert(start >= 0 && end > start, 'Missing Brighton timeline card');
    const card = html.slice(start, end);
    assert(card.includes('Brighton &amp; Hove') && card.includes('World Cup'));
    assert(card.includes('Leeds United') && card.includes('Ipswich') && card.includes('Fulham'));
    assert(!card.includes('Squad movement') && !card.includes('<b>Joined</b>') && !card.includes('<b>Left</b>'));
    assert(card.includes('Third place:') && card.includes('Uruguay'));
});
