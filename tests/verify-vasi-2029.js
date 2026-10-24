// Vasi's 2029–30 season is a live Barcelona season with pre-season results.
// Run: node tests/verify-vasi-2029.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const ctx = vm.createContext({
  console,
  app: { className: '', innerHTML: '' },
  nav: { innerHTML: '' },
  esc: value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
});
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
for (const file of ['base', 'definitions', 'rens', 'jordan', 'vasi']) {
  vm.runInContext(read(`data/${file}.js`), ctx);
}
const appScript = read('app.js');
const excerpt = (start, end) => {
  const i = appScript.indexOf(start);
  const j = appScript.indexOf(end, i);
  assert(i >= 0 && j > i, `Could not find ${start}`);
  return appScript.slice(i, j);
};
vm.runInContext(
  excerpt('function cleanClubLabel(', 'function careerStatsTable(') +
  excerpt('function careerStatsTable(', 'function player(') +
  excerpt('function teamFlag(', 'function timelinePlayerKey(') +
  excerpt('function timelinePlayerKey(', 'function numericStat(') +
  excerpt('function season(id,', 'function tableCellValue('), ctx);

const season = vm.runInContext(`DATA.vasi.seasons['2029–30']`,ctx);
const fixtures = vm.runInContext(`FULL_FIXTURES.vasi['2029–30']`,ctx);
const meta = vm.runInContext(`SEASON_TABLES.vasi['2029–30']`,ctx);
const pre = vm.runInContext(`PRESEASON_TABLES.vasi['2029–30']`,ctx);
const stats = vm.runInContext(`DATA.vasi.stats.find(row => row[0] === '2029–30')`,ctx);
assert.equal(season.inProgress, true);
assert.equal(season.table, '1st — 40 pts (16 played; in progress)');
assert.equal(fixtures['Champions Trophy'].length, 3);
assert.equal(fixtures['Liga F'].length, 16);
assert.equal(fixtures["UEFA Women's Champions League"].length, 6);
assert.equal(meta.league, 'Liga F');
assert.equal(meta.club, 'FC Barcelona');
assert.equal(meta.standings.length, 16);
assert.deepEqual(Array.from(meta.standings[0]), ['1','FC Barcelona','16','13','1','2','41','14','27','40']);
const europe = vm.runInContext(`COMPETITION_TABLES.vasi['2029–30']["UEFA Women's Champions League"]`,ctx);
assert.equal(europe.rows.length, 18);
assert.deepEqual(Array.from(europe.rows[0]), ['1','FC Barcelona','6','6','0','0','19','6','13','18']);
assert.equal(pre.rows.length, 8);
assert.deepEqual(Array.from(pre.rows[3]), ['4', 'FC Barcelona', '3', '1', '2', '0', '4', '1', '3', '5']);
assert.equal(meta.squad.length, 27);
assert.deepEqual(Array.from(meta.squad.find(row => row[2] === 'Vasiliki Dimitriou')),
  ['ST','9','Vasiliki Dimitriou','25','28','0','12']);
assert.deepEqual(Array.from(stats.slice(4)), ['1st', '', 25, 28, 0, 12]);
assert.equal(vm.runInContext('DATA.vasi.career[0][2]', ctx), 162,
  'In-progress appearances must not be added to completed totals');
assert.equal(vm.runInContext('DATA.vasi.career[0][3]', ctx), 170);
assert.equal(vm.runInContext('DATA.vasi.seasons["2028–29"].inProgress', ctx), false);
assert.equal(vm.runInContext('TEAM_FLAGS["KC Current"]', ctx), '🇺🇸');
assert.equal(vm.runInContext('DATA.vasi.squadFlags["Anna Affolter"]',ctx), '🇨🇭');
assert.equal(vm.runInContext('DATA.vasi.squadFlags["Chiamaka Nnadozi"]',ctx), '🇳🇬');
for (const [name, flag, asset] of [
  ['Steinunn Einarsdóttir', '🇮🇸', 'Iceland.png'],
  ['Alizée Coulon', '🇫🇷', 'France.png'],
  ['Teagan McNamara', '🇦🇺', 'Australia.png']
]) {
  assert.equal(vm.runInContext(`DATA.vasi.squadFlags[${JSON.stringify(name)}]`,ctx), flag,
    `${name} should have the supplied nationality`);
  assert.equal(vm.runInContext(`FLAG_ASSETS[${JSON.stringify(flag)}]`,ctx), `assets/flags/${asset}`);
  assert(fs.existsSync(path.join(root, 'assets', 'flags', asset)), `Missing flag artwork for ${name}`);
}
// A new season should appear in both the season view and the shared overview.
vm.runInContext(`season('vasi', '2029–30')`,ctx);
assert(ctx.app.innerHTML.includes('In progress'));
assert(ctx.app.innerHTML.includes('Strasbourg'));
assert(ctx.app.innerHTML.includes('KC Current'));
assert(ctx.app.innerHTML.includes('Vasiliki Dimitriou'));
const overview = vm.runInContext('careerStatsTable(DATA.vasi)',ctx);
assert(overview.includes('2029–30'));
assert(overview.includes('162'), 'Completed totals should remain unchanged');
const movement = vm.runInContext(`timelineSquadChanges('vasi','2029–30','2028–29')`,ctx);
assert(movement.joined.includes('Chiamaka Nnadozi'));
assert(movement.joined.includes('Lauren James'));
console.log('Vasi 2029–30: 16 Liga F results, 6 UWCL wins, 27-player squad, live overview, flags and Timeline — PASS');
