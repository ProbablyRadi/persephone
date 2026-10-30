// Run this file with: node --test tests/season-comparisons.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const vm = require('node:vm');
const { createSite } = require('./helpers/site');

test("Comparison ranks, club palettes, live exclusions and entry/exit geometry", () => {
    const site = createSite();
    const { context } = site;
    const data = id => vm.runInContext(`comparisonLeagueData('${id}')`, context);
    // Colours follow club identity, including aliases, rather than chart-list order.
    assert.deepEqual(Array.from(vm.runInContext("comparisonTeamColours('Brighton & Hove Albion')", context)), ['#0057b8', '#ffffff']);
    assert.deepEqual(Array.from(vm.runInContext("comparisonTeamColours('Dortmund')", context)), ['#fde100', '#191919']);
    assert.deepEqual(Array.from(vm.runInContext("comparisonTeamColours('Leeds')", context)),
        Array.from(vm.runInContext("comparisonTeamColours('Leeds United')", context)));
    const fallback = vm.runInContext("comparisonTeamStyle('Unlisted Test FC')", context);
    assert.equal(fallback, vm.runInContext("comparisonTeamStyle('Unlisted Test FC')", context));
    assert(fallback.includes('hsl('));
    vm.runInContext(`for (const palette of Object.values(TEAM_COLOURS)) {
        if (palette.length !== 2 || palette.some(colour => !/^#[0-9a-f]{6}$/i.test(colour))) throw Error('Invalid club palette');
    }`, context);
    const rens = data('rens');
    assert.deepEqual(Array.from(rens.map(league => [league.name, league.years.length]), row => Array.from(row)), [
        ['Eredivisie', 3], ['Premier League', 5], ['Bundesliga', 3]
    ]);
    const premier = rens.find(league => league.name === 'Premier League');
    context.premier = premier;
    assert.equal(vm.runInContext("comparisonFinish(premier, 'Coventry City', '2029–30')", context), 'Relegated');
    assert.equal(vm.runInContext("comparisonFinish(premier, 'Coventry City', '2030–31')", context), 18,
        'Promoted teams must return to their recorded finishing position');
    assert.equal(vm.runInContext("comparisonFinish(premier, 'Coventry City', '2031–32')", context), 'Relegated');
    assert(premier.relegated.get('Sheffield United').has('2029–30'));
    const premierSvg = vm.runInContext('comparisonChart(premier)', context);
    assert(premierSvg.includes('comparison-relegation-row'));
    assert(premierSvg.includes('>Outside league</text>'));
    assert.equal(premier.maxPosition, 20, 'Relegation must not change the real league ranks');
    const vasi = data('vasi')[0];
    assert.equal(vasi.name, 'Liga F');
    assert.deepEqual(Array.from(vasi.years), ['2025–26', '2026–27', '2027–28', '2028–29', '2029–30']);
    assert.deepEqual(Array.from(vasi.positions.get('FC Barcelona').values()), [1, 1, 1, 1, 1]);
    assert.deepEqual(Array.from(vasi.positions.get('Real Madrid').values()), [3, 2, 2, 2, 3]);
    assert.deepEqual(Array.from(data('jordan').map(league => league.years.length)), [1, 4]);
    const jordanPremier = data('jordan').find(league => league.name === 'Premier League');
    context.jordanPremier = jordanPremier;
    assert.equal(vm.runInContext("comparisonFinish(jordanPremier, 'Burnley', '2028–29')", context), 'Relegated');
    assert.equal(vm.runInContext("comparisonFinish(jordanPremier, 'Burnley', '2029–30')", context), 19);
    assert.equal(vm.runInContext("comparisonFinish(jordanPremier, 'Burnley', '2027–28')", context), null,
        'Only add the immediately preceding outside-league point for a new entrant');
    const burnleyIndex = jordanPremier.teams.indexOf('Burnley');
    const jordanSvg = vm.runInContext('comparisonChart(jordanPremier)', context);
    const burnleyGroup = jordanSvg.match(new RegExp(`<g class="comparison-series[^"\\n]*" data-team-index="${burnleyIndex}"[^>]*>([\\s\\S]*?)</g>`))[1];
    const burnleyPoints = [...burnleyGroup.matchAll(/<circle cx="[^"]+" cy="([^"]+)"/g)].map(match => Number(match[1]));
    assert.equal(burnleyPoints.length, 2, 'Burnley should have an origin point and its recorded finish');
    assert(burnleyPoints[0] > burnleyPoints[1], 'Burnley should rise from the relegated row');
    assert(burnleyGroup.match(/<path d="([^"]+)"/)[1].includes('L'), 'Connect the promotion segment');
    assert.equal(jordanPremier.positions.get('Burnley').size, 1, 'Do not add invented ranks to the source positions');

    // Check every plotted value against its original domestic standings row.
    for (const id of ['rens', 'jordan', 'vasi']) {
        context.playerId = id;
        vm.runInContext(`
            for (const league of comparisonLeagueData(playerId)) {
                for (const team of league.teams) {
                    const name = TEAM_COLOUR_ALIASES[team] || team;
                    if (!TEAM_COLOURS[name]) throw Error('Missing palette for current team: ' + team);
                }
                for (const season of league.years) {
                    if (DATA[playerId].seasons[season].inProgress) throw Error('Live season included');
                    const rows = SEASON_TABLES[playerId][season].standings;
                    for (const row of rows) {
                        if (league.positions.get(canonicalTeam(row[1])).get(season) !== Number(row[0])) {
                            throw Error('Position changed during comparison');
                        }
                    }
                }
            }
        `, context);
        vm.runInContext(`careerComparisons('${id}')`, context);
        assert.equal(context.app.className, 'comparisons-page');
        assert(context.app.innerHTML.includes('comparison-svg'));
        assert(context.app.innerHTML.includes('View all team finishes'));
        assert(context.app.innerHTML.includes('1st is at the top'));
        assert(context.app.innerHTML.includes('Choose teams'));
        assert(context.app.innerHTML.includes('type="checkbox"'));
        assert(context.app.innerHTML.includes('Show all teams'));
        assert(context.app.innerHTML.includes('comparison-ranked'));
        assert(context.app.innerHTML.includes('class="comparison-line"'));
        assert(context.app.innerHTML.includes('--team-accent:'));
        assert(context.nav.innerHTML.indexOf('>Head to Head</a>') < context.nav.innerHTML.indexOf('>Season comparisons</a>'));
        assert(context.nav.innerHTML.includes(`href="#${id}/comparisons"`));
    }

    // A missing middle season must split a team's line; a single season has no line.
    context.syntheticLeague = {
        years: ['2025–26', '2026–27', '2027–28'],
        teams: ['Gap Town'],
        positions: new Map([['Gap Town', new Map([['2025–26', 1], ['2027–28', 2]])]]),
        careerClubs: new Set(['Gap Town']), maxPosition: 2
    };
    const gapSvg = vm.runInContext('comparisonChart(syntheticLeague)', context);
    const gapPath = gapSvg.match(/<path d="([^"]*)"/)[1];
    assert.equal((gapPath.match(/M/g) || []).length, 2);
    assert(!gapPath.includes('L'), 'Do not join through missing seasons');
    context.syntheticLeague.years = ['2025–26'];
    const singleSvg = vm.runInContext('comparisonChart(syntheticLeague)', context);
    assert(!singleSvg.match(/<path d="([^"]*)"/)[1].includes('L'));
    assert(!singleSvg.includes('NaN'));

    // Entry/exit anchors remain connected to real finishes, but never to each other
    // along the outside-league row during a multi-season absence.
    context.transitionLeague = {
        years: ['2025–26', '2026–27', '2027–28', '2028–29'],
        teams: ['Returning FC'],
        positions: new Map([['Returning FC', new Map([['2025–26', 20], ['2028–29', 6]])]]),
        relegated: new Map([['Returning FC', new Set(['2026–27', '2027–28'])]]),
        careerClubs: new Set(['Returning FC']), maxPosition: 20
    };
    const transitionSvg = vm.runInContext('comparisonChart(transitionLeague)', context);
    const transitionPath = transitionSvg.match(/<path d="([^"]+)"/)[1];
    assert.equal((transitionPath.match(/M/g) || []).length, 2, 'Separate the exit and entry segments');
    assert.equal((transitionPath.match(/L/g) || []).length, 2, 'Keep the two real entry/exit connections');
    assert(transitionSvg.includes('>Outside league</text>'));

    // Mere absence after a mid-table finish is not evidence of relegation.
    context.unknownExit = {
        name: 'Premier League', years: ['2025–26', '2026–27'],
        positions: new Map([['Midtable FC', new Map([['2025–26', 10]])], ['Bottom FC', new Map([['2025–26', 20], ['2026–27', 20]])]])
    };
    assert.equal(vm.runInContext("comparisonRelegations(unknownExit, ['Midtable FC']).size", context), 0);
    context.unknownExit.years = ['2025–26', '2027–28'];
    context.unknownExit.positions.get('Midtable FC').set('2025–26', 20);
    assert.equal(vm.runInContext("comparisonRelegations(unknownExit, ['Midtable FC']).size", context), 0,
        'Do not infer relegation across an unrecorded season');

    // Empty and unranked records should never become final league positions.
    vm.runInContext(`
        DATA.empty = { displayName: 'No records', seasons: {} };
        SEASON_TABLES.empty = { '2030–31': { league: 'Test', standings: [['', 'Test FC', '', '', '', '', '', '', '', '']] } };
    `, context);
    assert.equal(data('empty').length, 0);
    vm.runInContext("careerComparisons('empty')", context);
    assert(context.app.innerHTML.includes('No completed league standings'));
});
