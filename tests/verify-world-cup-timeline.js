// Verify that the Career Timeline World Cup podium comes from the supplied
// final and third-place play-off, without guessing results or editing fixtures.
// Run: node tests/verify-world-cup-timeline.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = vm.createContext({
    console,
    app: { className: '', innerHTML: '' },
    nav: { innerHTML: '' },
    esc: value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
});

for (const file of ['base', 'definitions', 'rens', 'jordan', 'vasi'])
    vm.runInContext(read(`data/${file}.js`), context);

const script = require('./helpers/site-source').clientSource();
function excerpt(fromLabel, toLabel) {
    const from = script.indexOf(fromLabel);
    const to = script.indexOf(toLabel, from);
    assert(from >= 0 && to > from, `Missing app.js section: ${fromLabel}`);
    return script.slice(from, to);
}

vm.runInContext(
    excerpt('function cleanClubLabel(', 'function careerStatsTable(')
    + excerpt('function teamFlag(', 'function timelinePlayerKey(')
    + excerpt('function timelinePlayerKey(', 'function numericStat('),
    context,
);

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
    console.log(`${id} ${season}: ${winner} / ${runner} / ${third} — PASS`);
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
console.log('World Cup podium Timeline rendering and fallback checks — PASS');
