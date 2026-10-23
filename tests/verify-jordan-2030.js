// Jordan Vale 2030–31 Brighton and World Cup 2030 archive.
// Run from the website root: node tests/verify-jordan-2030.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = vm.createContext({
    app: { className: '', innerHTML: '' },
    nav: { innerHTML: '' },
    esc: value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
});
for (const file of ['base', 'definitions', 'rens', 'jordan', 'vasi']) {
    vm.runInContext(fs.readFileSync(path.join(root, 'data', `${file}.js`), 'utf8'), context);
}
const appScript = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
function excerpt(from, to) {
    const start = appScript.indexOf(from);
    const end = appScript.indexOf(to, start);
    assert(start >= 0 && end > start);
    return appScript.slice(start, end);
}
vm.runInContext(
    excerpt('function cleanClubLabel(', 'function careerStatsTable(')
        + excerpt('function teamFlag(', 'function timelinePlayerKey(')
        + excerpt('function timelinePlayerKey(', 'function numericStat('),
    context,
);
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
console.log('JV 2030–31: Brighton pre-season + 4 scored matches, 34-player squad, provisional EPL, 2030 World Cup, honours and timeline — PASS');
