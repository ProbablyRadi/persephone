// Verify the three-player home screen, separate Gallery route and character selector.
// Run: node tests/verify-home-page.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const script = read('app.js');
const css = read('styles.css');
const html = read('index.html');
const activeClasses = new Set();
const classes = {
    toggle(className, active) {
        if (active) activeClasses.add(className);
        else activeClasses.delete(className);
    }
};
const callbacks = {};
const characterSelect = {
    value: '',
    addEventListener(type, callback) { callbacks[type] = callback; }
};
const app = { className: '', innerHTML: '' };
const nav = { innerHTML: '' };
const location = { hash: '#home' };
const context = vm.createContext({
    console,
    document: { body: { classList: classes } },
    window: { scrollTo() {} },
    characterSelect, app, nav, location,
    replaceFlagEmoji() {},
    esc(value) {
        return String(value).replace(/[&<>]/g, c =>
            ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
    },
    player(id) { app.className = `profile-${id}`; },
    season(id) { app.className = `season-${id}`; },
    careerStats(id) { app.className = `stats-${id}`; },
    careerTimeline(id) { app.className = `timeline-${id}`; },
    careerAnalysis(id) { app.className = `analysis-${id}`; }
});
for (const name of ['base', 'definitions', 'rens', 'jordan', 'vasi', 'gallery']) {
    vm.runInContext(read(`data/${name}.js`), context);
}

const changeStart = script.indexOf('if (characterSelect)\n    characterSelect.addEventListener(');
const changeEnd = script.indexOf('const esc =', changeStart);
assert(changeStart >= 0 && changeEnd > changeStart, 'Could not find dropdown handler');
vm.runInContext(script.slice(changeStart, changeEnd), context);

const homeStart = script.indexOf('function galleryItems()');
const homeEnd = script.indexOf("addEventListener('hashchange', route);", homeStart);
assert(homeStart >= 0 && homeEnd > homeStart, 'Could not find gallery/home/router functions');
vm.runInContext(script.slice(homeStart, homeEnd), context);

vm.runInContext('route()', context);
assert(activeClasses.has('is-home'), 'Home page should use sidebar-free layout');
assert(!activeClasses.has('is-gallery'));
assert.equal(app.className, 'home-page');
assert.equal((app.innerHTML.match(/class="home-player-tile has-character-background"/g) || []).length, 3);
assert.match(app.innerHTML, /Rens Adisea/);
assert.match(app.innerHTML, /Jordan Vale/);
assert.match(app.innerHTML, /Vasiliki Dimitriou/);
assert.match(app.innerHTML, /assets\/character-select\/vasi-home-smile-20261024\.jpg/,
    'Vasi home tile must use the newest uploaded screenshot');
assert.match(app.innerHTML, /class="home-gallery-link" href="#gallery"/);
assert(!app.innerHTML.includes('class="gallery-carousel"'), 'Carousel must not occupy a fourth home tile');
assert(!app.innerHTML.includes('gallery-slide'), 'Gallery photos belong on separate page');
assert(!css.includes('body.is-home .home-player-tile:nth-last-child(1):nth-child(odd)'),
    'Keep Vasi bottom-left');
assert.equal(characterSelect.value, '', 'Home should display choose-character placeholder');
assert.match(css, /body\.is-home \.layout > aside\s*\{\s*display:\s*none/);
assert.match(css, /width:\s*min\(75vw,\s*1600px\)/);
assert.match(css, /justify-content:\s*flex-end/);
assert.match(css, /body\.is-home \.home-page \.home-tiles\s*\{\s*grid-template-columns:\s*minmax\(0,\s*1fr\)/);

// Gallery has its own route, canvas and back link; it is not a fourth home tile.
location.hash = '#gallery';
vm.runInContext('route()', context);
assert.equal(app.className, 'gallery-page');
assert(activeClasses.has('is-gallery'));
assert(!activeClasses.has('is-home'));
assert.equal(characterSelect.value, '');
assert.match(app.innerHTML, /href="#home"/);
assert.match(app.innerHTML, /class="gallery-carousel"/);
assert.equal((app.innerHTML.match(/class="gallery-slide"/g) || []).length, 17);
assert.match(css, /body\.is-gallery \.layout > aside\s*\{\s*display:\s*none/);
assert.match(css, /body\.is-gallery \.gallery-carousel/);

// Choose character works from Gallery and character pages; placeholder returns home.
characterSelect.value = 'rens';
callbacks.change();
assert.equal(location.hash, '#rens');
vm.runInContext('route()', context);
assert(!activeClasses.has('is-home'));
assert(!activeClasses.has('is-gallery'));
assert.equal(app.className, 'profile-rens');
location.hash = '#jordan/2030–31';
vm.runInContext('route()', context);
assert.equal(app.className, 'season-jordan');
assert(!activeClasses.has('is-home'));
assert(!activeClasses.has('is-gallery'));
assert.equal(characterSelect.value, 'jordan');
characterSelect.value = '';
callbacks.change();
assert.equal(location.hash, '#home');
vm.runInContext('route()', context);
assert(activeClasses.has('is-home'));
assert.equal(characterSelect.value, '');

assert.match(html, /data\/gallery\.js\?v=20261024-seventeen-gallery-photos/);
assert.match(html, /app\.js\?v=20261024-gallery-page/);
assert.match(html, /styles\.css\?v=20261024-css-refactor/);
console.log('Home page: three character tiles, small gallery link, separate gallery route, dropdown return — PASS');
