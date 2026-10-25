// Run this file with: node --test tests/table-sorting.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { createSite, read } = require('./helpers/site');

test("Flags sort by country names before and after image replacement", () => {
    const site = createSite();
    const { context } = site;
    const countryCases = [
        ['🇧🇪', 'Belgium'],
        ['🇳🇱', 'Netherlands'],
        ['🇵🇾', 'Paraguay'],
        ['🇬🇧', 'United Kingdom'],
    ];

    // Model the two DOM states: before and after the flag image replacement.
    function flagRow(emoji, imageRendered, className = 'player-nation') {
        const imagePath = vm.runInContext(`FLAG_ASSETS[${JSON.stringify(emoji)}]`, context);
        assert(imagePath, `Missing local image for ${emoji}`);
        const image = { getAttribute: attr => attr === 'src' ? imagePath : null };
        return {
            cells: [{
                dataset: {},
                textContent: imageRendered ? '' : emoji,
                classList: { contains: value => value === className },
                querySelector: selector => selector === 'img.country-flag' && imageRendered ? image : null,
            }]
        };
    }

    for (const [emoji, expectedCountry] of countryCases) {
        for (const className of ['player-nation', 'flag']) {
            for (const imageRendered of [false, true]) {
                context.row = flagRow(emoji, imageRendered, className);
                const actual = vm.runInContext('tableCellValue(row, 0)', context);
                assert.equal(actual, expectedCountry);
            }
        }
    }

    // Check sorting is alphabetical, not unchanged because every img has blank text.
    for (const imageRendered of [false, true]) {
        const input = ['🇵🇾', '🇧🇪', '🇳🇱'];
        const names = input.map(emoji => {
            context.row = flagRow(emoji, imageRendered);
            return vm.runInContext('tableCellValue(row, 0)', context);
        });
        assert.deepEqual([...names].sort((a, b) => a.localeCompare(b)), [
            'Belgium', 'Netherlands', 'Paraguay'
        ]);
        assert.deepEqual([...names].sort((a, b) => b.localeCompare(a)), [
            'Paraguay', 'Netherlands', 'Belgium'
        ]);
    }
});

test("Career summaries stay chronological while standard data tables receive sorting controls", () => {
    const site = createSite();
    const { context } = site;
    const sortingContext = vm.createContext({
        document: {
            createElement: () => ({
                className: '',
                textContent: '',
                setAttribute() {},
            }),
        },
    });
    vm.runInContext(read('js/tables.js'), sortingContext);
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
            querySelector() { return this.indicator; },
            addEventListener(eventName, callback) { this.sortListener = eventName; this.click = callback; },
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

    // Exercise the real click handler, not just JavaScript's Array.sort.
    const tbody = standardTable.tBodies[0];
    tbody.rows = [3, 12, 2].map(number => ({
        classList: classList([]),
        cells: ['', '', String(number), ''].map(textContent => ({ textContent, dataset: {}, classList: classList([]) }))
    }));
    tbody.appendChild = row => {
        tbody.rows.splice(tbody.rows.indexOf(row), 1);
        tbody.rows.push(row);
    };
    const click = { target: { closest: () => null } };
    standardTable.headings[2].click(click);
    assert.deepEqual(tbody.rows.map(row => row.cells[2].textContent), ['2', '3', '12']);
    standardTable.headings[2].click(click);
    assert.deepEqual(tbody.rows.map(row => row.cells[2].textContent), ['12', '3', '2']);
});
