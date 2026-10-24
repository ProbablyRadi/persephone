// Career overview regression checks. Run: node tests/verify-overviews.js
// Ensures real source data renders the expected table cells / boot brands.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = pathFromRoot => fs.readFileSync(path.join(root, pathFromRoot), 'utf8');
const context = vm.createContext({ console });

for (const file of ['data/base.js', 'data/definitions.js', 'data/rens.js', 'data/jordan.js', 'data/vasi.js']) {
    vm.runInContext(read(file), context, { filename: file });
}
const source = read('app.js');
const excerpt = (begin, end) => {
    const from = source.indexOf(begin);
    const to = source.indexOf(end, from);
    assert(from >= 0 && to > from, `Could not locate renderer ${begin}`);
    return source.slice(from, to);
};
vm.runInContext(
    'const esc = value => String(value).replace(/[&<>]/g, c => ({"&":"&amp;", "<":"&lt;", ">":"&gt;"})[c]);\n'
    + excerpt('function cleanClubLabel(', 'function careerGroups(')
    + excerpt('function careerStatsTable(', 'function player(')
    + excerpt('function infoboxCareerTable(', 'function honours('),
    context,
);

const unescape = value => value.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
function cellsOf(html, type) {
    return [...html.matchAll(new RegExp(`<tr class="career-stats-${type}">([\\s\\S]*?)<\\/tr>`, 'g'))]
        .map(match => [...match[1].matchAll(/<td[^>]*>(.*?)<\/td>/g)]
            .map(td => unescape(td[1])));
}
const snapshot = id => vm.runInContext(`careerStatsTable(DATA.${id})`, context);
const vasi = snapshot('vasi');
const vasiRows = cellsOf(vasi, 'season');
const expected = {
    '2025–26': [0, 9],
    '2026–27': [2, 11],
    '2027–28': [2, 12],
    '2028–29': [2, 10],
};
for (const [season, [potm, motm]] of Object.entries(expected)) {
    const row = vasiRows.find(cells => cells[1] === season);
    assert(row, `Vasi ${season}: season row missing`);
    assert.equal(row.length, 12, 'Career overview table must have 12 columns');
    assert.equal(row[0].includes('FC Barcelona Femení'), true, 'Vasi club must be visible');
    assert.equal(row[6], String(potm), `Vasi ${season}: POTM is blank/wrong`);
    assert.equal(row[7], String(motm), `Vasi ${season}: MOTM is blank/wrong`);
}
// Barcelona infobox reflects all four completed seasons, including 2028–29.
// Future clubs remain career placeholders without manufactured fixtures.
const vasiCareer = vm.runInContext('DATA.vasi.career', context);
const vasiInternational = vm.runInContext('DATA.vasi.intl', context);
assert.deepEqual(Array.from(vasiCareer.map(row => row[0])),
    ['2025–2036', '2036–2040', '2040–2043']);
assert.deepEqual(Array.from(vasiCareer[0].slice(2)), [162, 170]);
assert(vasiCareer[0][1].includes('FC Barcelona Femení'));
assert(vasiCareer[1][1].includes('Gotham FC'));
assert(vasiCareer[2][1].includes('OFI Crete W.F.C.'));
assert.deepEqual(Array.from(vasiCareer[1].slice(2)), ['—', '—']);
assert.deepEqual(Array.from(vasiCareer[2].slice(2)), ['—', '—']);
assert.deepEqual(Array.from(vasiInternational.slice(2)), [4, 2]);
assert.equal(vm.runInContext('DATA.vasi.name', context),
    'Vasiliki Dimitriou (Βασιλική Δημητρίου)');
assert.equal(vm.runInContext('DATA.vasi.nickname', context), 'Vasi');
assert.equal(vm.runInContext('DATA.vasi.dob', context), '31 October');
assert.equal(vm.runInContext('DATA.vasi.birth', context), 'Arachnes, Greece');
assert.match(vm.runInContext('DATA.vasi.intro[0]', context), /Born in Arachnes/,
    'Vasi biography should agree with the updated place of birth');
assert.equal(vm.runInContext('DATA.vasi.height', context), '1.77 m');
assert.equal(vm.runInContext('DATA.vasi.position', context), 'Striker');
assert.equal(vm.runInContext('DATA.vasi.number', context), '9');
assert(vm.runInContext('DATA.vasi.current', context).includes('FC Barcelona Femení'));
assert.deepEqual(Array.from(vm.runInContext('Object.keys(DATA.vasi.seasons)', context))
    .filter(season => season.startsWith('2036') || season.startsWith('2040')), []);
const vasiInfobox = vm.runInContext('infobox(DATA.vasi)', context);
assert(vasiInfobox.includes('OFI Crete W.F.C.'), 'Future OFI club missing from infobox');
assert(vasiInfobox.includes('Arachnes, Greece'), 'Vasi birth location missing from infobox');
assert(vasiInfobox.includes('162') && vasiInfobox.includes('170'),
    'Barcelona completed-season totals must appear in infobox');

const vasiTotal = cellsOf(vasi, 'subtotal')[0];
assert(vasiTotal, 'Vasi career total row missing');
assert.equal(vasiTotal[5], '7.2', 'Vasi average rating should reflect all four completed seasons');
assert.equal(vasiTotal[6], '6', 'Vasi POTM total should include 2028–29');
assert.equal(vasiTotal[7], '42', 'Vasi MOTM total should include 2028–29');
assert.deepEqual(Array.from(vm.runInContext('DATA.vasi.careerAwards["2027–28"] && [DATA.vasi.careerAwards["2025–26"].playerOfTheMatch, DATA.vasi.careerAwards["2026–27"].playerOfTheMatch, DATA.vasi.careerAwards["2027–28"].playerOfTheMatch]', context)), [9, 11, 12]);
const vasiSeason2028 = vasiRows.find(row => row[1] === '2028–29');
assert.deepEqual(vasiSeason2028.slice(4), ['1st', '6.9', '2', '10', '43', '37', '1', '15']);
const vasiSeason2029 = vasiRows.find(row => row[1] === '2029–30');
assert.deepEqual(vasiSeason2029.slice(4), ['1st', '—', '—', '—', '25', '28', '0', '12'],
    'In-progress 2029–30 figures must not be fabricated');
assert.deepEqual(vasiTotal.slice(8), ['162', '170', '22', '51'],
    'In-progress 2029–30 numbers must not enter completed-season totals');

for (const id of ['rens', 'jordan', 'vasi']) {
    const html = snapshot(id);
    assert(html.includes('Player of the Month') && html.includes('Man of the Match'), `${id}: missing award headers`);
    assert.equal(cellsOf(html, 'season').length > 0, true, `${id}: no season rows`);
    assert(cellsOf(html, 'season').every(row => row.length === 12), `${id}: wrong column count`);
}
// A completed Jordan season must flow into the Overview table and club totals.
const jordanOverview = snapshot('jordan');
const jordanSeason = cellsOf(jordanOverview, 'season').find(row => row[1] === '2028–29');
assert(jordanSeason, 'Jordan 2028–29 overview season missing');
assert.deepEqual(jordanSeason.slice(4), ['11th', '6.3', '0', '2', '59', '0', '5', '18']);
const jordanTotal = cellsOf(jordanOverview, 'subtotal')[0];
assert(jordanTotal, 'Jordan Bristol City total row missing');
assert.deepEqual(jordanTotal.slice(5), ['6.2', '0', '9', '208', '1', '12', '76'],
    'Jordan career totals should include the completed 2028–29 season');

// Rens has no Dortmund appearances/goals or league finish reported yet.
const rensOverview = snapshot('rens');
const rensSeason = cellsOf(rensOverview, 'season').find(row => row[1] === '2035–36');
assert(rensSeason && rensSeason[4] === '—', 'Rens 2035–36 league finish should be a dash');
const rensInfobox = vm.runInContext('infobox(DATA.rens)', context);
assert.match(rensInfobox, /2035–[\s\S]*?Borussia Dortmund[\s\S]*?<td class="infobox-career-num">—<\/td>\s*<td class="infobox-career-num">—<\/td>/,
    'Rens Dortmund appearances and goals should be dashes');

const jordanInfobox = vm.runInContext('infobox(DATA.jordan)', context);
assert.match(jordanInfobox, /<td>Boot brand<\/td>\s*<td>New Balance<\/td>/,
    'Jordan Vale overview must show New Balance for Boot brand');
assert(!jordanInfobox.includes('<td>Nike</td>'), 'Jordan overview must not show Nike for his boots');

// New user-supplied international/club histories and future season placeholders.
const rensCareer = vm.runInContext('DATA.rens.career', context);
const jordanCareer = vm.runInContext('DATA.jordan.career', context);
const rensInternational = vm.runInContext('DATA.rens.intl', context);
const jordanInternational = vm.runInContext('DATA.jordan.intl', context);
assert.deepEqual(Array.from(rensInternational.slice(2)), [42, 31]);
assert.deepEqual(Array.from(jordanInternational.slice(2)), [50, 0]);
assert.deepEqual(Array.from(rensCareer.map(row => row[0])),
    ['2025–2028', '2028–2033', '2033–2035', '2035–2040', '2040–2043']);
assert.deepEqual(Array.from(jordanCareer.map(row => row[0])),
    ['2025–2029', '2029–2030', '2030–2035', '2035–2040']);
assert(jordanCareer[2][1].includes('Brighton & Hove'), 'Planned 2030–2035 club should be Brighton & Hove');
assert(jordanCareer[3][1].includes('PSV'), 'Planned 2035–2040 club should be PSV');
assert.deepEqual(Array.from(jordanCareer[1].slice(2)), [48, 0]);
assert.deepEqual(Array.from(jordanCareer[2].slice(2)), [7, 0]);
assert.deepEqual(Array.from(jordanCareer[3].slice(2)), ['—', '—']);
const jordanSeason2029 = cellsOf(jordanOverview, 'season').find(row => row[1] === '2029–30');
assert.deepEqual(jordanSeason2029.slice(4), ['4th', '6.5', '0', '0', '48', '0', '0', '18']);
const jordanSeasonRows = cellsOf(jordanOverview, 'season');
assert.equal(jordanSeasonRows.length, 15, 'Exactly five completed, one in-progress and nine future seasons expected');
assert.deepEqual(Array.from(jordanSeasonRows.map(row => row[1])), [
    '2025–26', '2026–27', '2027–28', '2028–29', '2029–30', '2030–31',
    '2031–32', '2032–33', '2033–34', '2034–35', '2035–36', '2036–37',
    '2037–38', '2038–39', '2039–40'
]);
const jordanSubtotals = cellsOf(jordanOverview, 'subtotal');
assert.deepEqual(jordanSubtotals[1].slice(5), ['6.5', '0', '0', '48', '0', '0', '18']);
const jordanBrighton = jordanSeasonRows.find(row => row[1] === '2030–31');
assert(jordanBrighton[0].includes('Brighton & Hove'));
assert.deepEqual(jordanBrighton.slice(8), ['7', '0', '0', '3']);
const jordanGrand = cellsOf(jordanOverview, 'grand-total')[0];
assert.deepEqual(jordanGrand.slice(8), ['256', '1', '12', '94'],
    'Grand total must count completed seasons without counting placeholder seasons');
const jordanFutureSeasons = vm.runInContext('Object.keys(DATA.jordan.seasons)', context);
assert(!jordanFutureSeasons.some(season => Number(season.slice(0, 4)) >= 2031),
    'Planned seasons are overview placeholders, not fabricated season pages');

assert(jordanInfobox.includes('Brighton & Hove') && jordanInfobox.includes('PSV') && jordanInfobox.includes('50'),
    'Jordan infobox should include Brighton & Hove, future PSV club and 50 England appearances');
assert.equal(rensCareer[4][2], '—');
const rensFuture = cellsOf(rensOverview, 'season');
const jordanFuture = cellsOf(jordanOverview, 'season');
for (const season of ['2036–37', '2037–38', '2038–39', '2039–40']) {
    const row = rensFuture.find(cells => cells[1] === season);
    assert(row && row[0].includes('Dortmund'), `Rens ${season} should still be at Dortmund`);
    assert(row.slice(4).every(value => value === '—'), 'Future seasons should not have performance statistics');
}
for (const season of ['2040–41', '2041–42', '2042–43']) {
    const row = rensFuture.find(cells => cells[1] === season);
    assert(row && row[0].includes('PEC Zwolle'), `Rens ${season} return to PEC Zwolle missing`);
}
for (const season of ['2031–32', '2032–33', '2033–34', '2034–35']) {
    const row = jordanFuture.find(cells => cells[1] === season);
    assert(row && row[0].includes('Brighton & Hove'), `Jordan ${season} should be at Brighton & Hove`);
    assert(row[3] === 'Premier League' && row.slice(4).every(value => value === '—'),
        'Future Brighton seasons should show the Premier League but no performance statistics');
}
for (const season of ['2035–36', '2036–37', '2037–38', '2038–39', '2039–40']) {
    const row = jordanFuture.find(cells => cells[1] === season);
    assert(row && row[0].includes('PSV'), `Jordan ${season} future PSV season missing`);
    assert(row[3] === 'Eredivisie' && row.slice(4).every(value => value === '—'),
        'Future PSV seasons should show the Eredivisie but no performance statistics');
}
assert(vm.runInContext('DATA.rens.current', context).includes('Borussia Dortmund'));
assert(vm.runInContext('DATA.jordan.current', context).includes('Brighton & Hove'));
assert(!vm.runInContext('Object.keys(DATA.rens.seasons)', context).includes('2040–41'));
assert(vm.runInContext('DATA.jordan.seasons["2030–31"].inProgress', context));
assert(!vm.runInContext('Object.keys(DATA.jordan.seasons)', context).includes('2033–34'));
assert(vm.runInContext('DATA.jordan.intro.at(-1)', context).includes('50 international appearances'));
assert.equal(vm.runInContext('DATA.jordan.stats.at(-2)[5]', context), '6.5');
assert.deepEqual(Array.from(vm.runInContext('Object.values(DATA.jordan.careerAwards["2029–30"])', context)), [0, 0]);
assert(vm.runInContext('DATA.jordan.intro[3]', context).includes('48 appearances'));
assert.deepEqual(Array.from(vm.runInContext('DATA.jordan.stats.at(-2).slice(6)', context)),
    [48, 0, 0, 18], '2029–30 completed-season totals should match the supplied squad and infobox');

// The club/international summaries belong inside the right-hand infobox,
// while the larger Career statistics and Honours remain in the article.
for (const id of ['rens', 'jordan', 'vasi']) {
    const rendered = vm.runInContext(`infobox(DATA.${id})`, context);
    const career = vm.runInContext(`DATA.${id}.career`, context);
    const intl = vm.runInContext(`DATA.${id}.intl`, context);

    assert.match(rendered, /<th colspan="2" id="career">Club career<\/th>/,
        `${id}: missing club career heading inside infobox`);
    assert.match(rendered, /<th colspan="2" id="international-career">International career<\/th>/,
        `${id}: missing international heading inside infobox`);
    assert.equal((rendered.match(/class="infobox-career-table"/g) || []).length, 2,
        `${id}: both career sections should have compact tables`);
    for (const row of [...career, intl]) {
        for (const value of row) {
            assert(rendered.includes(String(value).replace(/&/g, '&amp;')),
                `${id}: missing original career value ${value}`);
        }
    }
}
// The small infobox career tables must remain chronological: no clickable
// headings, sort arrows, or automatic class changes. Other headed tables
// should still receive interactive sorting.
const sortingContext = vm.createContext({
    document: {
        createElement: () => ({
            className: '',
            textContent: '',
            setAttribute() {},
        }),
    },
});
vm.runInContext(excerpt('function enhanceTable(', 'function enhanceTables('), sortingContext);
const classList = names => {
    const values = new Set(names);
    return {
        contains: name => values.has(name),
        add: name => values.add(name),
    };
};
const mockTable = name => {
    const headings = ['Years', 'Team', 'Apps', 'Goals'].map(textContent => ({
        textContent,
        colSpan: 1,
        dataset: {},
        classList: classList([]),
        appendChild(child) { this.indicator = child; },
        addEventListener(eventName) { this.sortListener = eventName; },
    }));
    return {
        classList: classList(name ? [name] : []),
        dataset: {},
        tHead: { rows: [{ cells: headings }] },
        tBodies: [{ rows: [] }],
        headings,
    };
};
for (const tableName of ['infobox-career-table', 'career-stats-table']) {
    const table = mockTable(tableName);
    sortingContext.tableToCheck = table;
    vm.runInContext('enhanceTable(tableToCheck)', sortingContext);
    assert(!table.classList.contains('interactive-table'),
        `${tableName}: sorting class must not be applied`);
    assert(table.headings.every(heading => !heading.indicator && !heading.sortListener),
        `${tableName}: heading arrows and sorting clicks must not be added`);
}
const standardTable = mockTable('wikitable');
sortingContext.tableToCheck = standardTable;
vm.runInContext('enhanceTable(tableToCheck)', sortingContext);
assert(standardTable.classList.contains('interactive-table'),
    'Other tables must remain sortable');
assert(standardTable.headings.every(heading => heading.indicator && heading.sortListener === 'click'),
    'Other tables must retain sorting arrows and click handlers');

const articleRenderer = excerpt('function player(id)', 'function teamFlag(');
assert(!articleRenderer.includes('career-grid'), 'Club/international tables should no longer be full-width');
assert(articleRenderer.includes('careerStatsTable(playerData)'), 'Full career statistics must remain');
assert(articleRenderer.includes('honours(playerData)'), 'Honours must remain in the article');
assert(articleRenderer.includes("event.preventDefault()"), 'Contents links must avoid changing the route');


// Confirm the browser gets a fresh asset request on deployment.
const html = read('index.html');
for (const sourceFile of ['data/vasi.js', 'data/jordan.js', 'app.js']) {
    const line = html.match(new RegExp(`<script src="${sourceFile.replace('.', '\\.')}(\\?v=[^"]+)"`));
    assert(line && line[1].length > 3, `Missing versioned script URL for ${sourceFile}`);
}
console.log('Vasi: 2028–29 awards 2 POTM/10 MOTM, career 6 POTM/42 MOTM; 162 apps, 170 goals — PASS');
console.log('Jordan: 2028–29 stats and 208/1/12/76 club totals; New Balance boots — PASS');
console.log('Rens/Jordan/Vasi: consistent 12-column overview tables — PASS');
console.log('Versioned JS assets — PASS');
