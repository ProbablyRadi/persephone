// Verify separate gallery page: real assets, empty state, captions and navigation.
// Run: node tests/verify-home-gallery.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const appCode = read('app.js');
const galleryData = read('data/gallery.js');
const css = read('styles.css');
const index = read('index.html');
assert.match(index, /data\/gallery\.js.*?<\/script>\s*<script src="app\.js/s,
    'Gallery data must load before the app');
assert.match(css, /\.gallery-slide\[hidden\]\s*\{\s*display:\s*none/);
assert.match(css, /body\.is-gallery \.gallery-carousel/);
assert.match(css, /object-fit:\s*contain/);

const start = appCode.indexOf('function galleryItems()');
const end = appCode.indexOf('function route() {', start);
assert(start >= 0 && end > start, 'Could not find gallery and home functions');
const snippet = appCode.slice(start, end);

function sandbox(items) {
    const registered = {};
    const slides = Array.from({ length: items.length }, (_, i) => ({
        hidden: i > 0,
        attributes: {},
        setAttribute(key, value) { this.attributes[key] = value; }
    }));
    const dots = items.map(() => ({
        attributes: {},
        setAttribute(key, value) { this.attributes[key] = value; }
    }));
    const counter = { textContent: '' };
    const gallery = {
        dataset: {},
        querySelectorAll(selector) {
            if (selector === '.gallery-slide') return slides;
            if (selector === '.gallery-dot') return dots;
            throw new Error('Unexpected selector: ' + selector);
        },
        querySelector(selector) {
            assert.equal(selector, '.gallery-count');
            return counter;
        },
        addEventListener(type, cb) { registered[type] = cb; }
    };
    const app = {
        className: '',
        innerHTML: '',
        querySelector(selector) {
            assert.equal(selector, '.gallery-carousel:not(.is-empty)');
            return items.length ? gallery : null;
        }
    };
    const nav = { innerHTML: '' };
    const context = vm.createContext({
        GALLERY_ITEMS: items,
        DATA: {
            rens: { flag: 'R', displayName: 'Rens' },
            jordan: { flag: 'J', displayName: 'JV' },
            vasi: { flag: 'V', displayName: 'Vasi' }
        },
        app, nav,
        esc(value) {
            return String(value).replace(/[&<>]/g, c =>
                ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
        }
    });
    vm.runInContext(snippet, context);
    vm.runInContext('home()', context);
    const homeMarkup = app.innerHTML;
    assert(!homeMarkup.includes('gallery-carousel'), 'Home page should not contain carousel');
    assert.equal((homeMarkup.match(/class="home-player-tile/g) || []).length, 3);
    assert.match(homeMarkup, /href="#gallery"/);
    vm.runInContext('galleryPage()', context);
    return { app, gallery, registered, slides, dots, counter, context };
}

const empty = sandbox([]);
assert.match(empty.app.innerHTML, /Photos and their stories will appear here/);
assert(!empty.app.innerHTML.includes('data-gallery-action="next"'),
    'No carousel arrows until there are multiple photos');
assert.equal(empty.app.className, 'gallery-page');

// Verify all 17 uploads, in original order, are present and readable.
const galleryItems = vm.runInNewContext(galleryData + '\nGALLERY_ITEMS;');
const expectedGalleryFiles = [
    'rens-dortmund-celebration.png',
    'vasi-on-the-ball.png',
    'vasi-player-of-the-match.png',
    'vasi-pointing-to-crowd.png',
    'vasi-touchline.png',
    'jordan-bristol-city-celebration.jpg',
    'jordan-manchester-united.jpg',
    'vasi-open-mouth-celebration.jpg',
    'rens-netherlands-huddle.jpg',
    'fa-cup-winners-podium.jpg',
    'efl-winners-podium.jpg',
    'bristol-fa-cup-closeup.jpg',
    'stokes-trophy-lift.jpg',
    'england-team-photo.jpg',
    'vasi-sliding-challenge.jpg',
    'vasi-kneeling-smile.jpg',
    'vasi-on-the-turf.jpg'
];
assert.equal(galleryItems.length, expectedGalleryFiles.length);
for (const [index, item] of galleryItems.entries()) {
    assert.equal(item.src, `assets/gallery/${expectedGalleryFiles[index]}`);
    assert(item.alt && item.title && item.description,
        `Gallery photo ${index + 1} needs alt text, a title and a caption`);
    const buffer = fs.readFileSync(path.join(root, item.src));
    const signature = item.src.endsWith('.png')
        ? Buffer.from('89504e470d0a1a0a', 'hex')
        : Buffer.from('ffd8ff', 'hex');
    assert(buffer.subarray(0, signature.length).equals(signature),
        `Gallery image ${item.src} is missing or unreadable`);
}

const populated = sandbox(galleryItems);
assert.equal((populated.app.innerHTML.match(/class="gallery-slide"/g) || []).length, 17);
assert.match(populated.app.innerHTML, /Gallery · 1 \/ 17/);
assert.match(populated.app.innerHTML, /Rens — Dortmund/);
assert.match(populated.app.innerHTML, /JV — Manchester United/);
assert.match(populated.app.innerHTML, /href="#home"/);
populated.registered.click({ target: { closest() { return { dataset: { galleryAction: 'previous' } }; } } });
assert.equal(populated.gallery.dataset.activeIndex, '16',
    'Previous should wrap to seventeenth image');

const sample = sandbox([
    { src: 'assets/gallery/photo1.jpg', title: 'First', description: 'A debut' },
    { src: 'assets/gallery/photo2.jpg', title: 'Second', description: 'A trophy' },
    { src: 'assets/gallery/photo3.jpg', title: 'Third', description: 'A celebration' }
]);
assert.match(sample.app.innerHTML, /A debut/);
assert.match(sample.app.innerHTML, /A trophy/);
assert.match(sample.app.innerHTML, /data-gallery-action="previous"/);
assert.match(sample.app.innerHTML, /data-gallery-action="next"/);
assert.equal((sample.app.innerHTML.match(/class="gallery-slide"/g) || []).length, 3);
const click = (action, index) => sample.registered.click({
    target: { closest() { return { dataset: { galleryAction: action, galleryIndex: String(index) } }; } }
});
click('next');
assert.equal(sample.gallery.dataset.activeIndex, '1');
assert.equal(sample.counter.textContent, 'Gallery · 2 / 3');
assert.equal(sample.slides[0].hidden, true);
assert.equal(sample.slides[1].hidden, false);
assert.equal(sample.dots[1].attributes['aria-current'], 'true');
click('previous');
assert.equal(sample.gallery.dataset.activeIndex, '0');
click('previous');
assert.equal(sample.gallery.dataset.activeIndex, '2');
click('go', 1);
assert.equal(sample.gallery.dataset.activeIndex, '1');
sample.registered.keydown({ key: 'ArrowRight', preventDefault() {} });
assert.equal(sample.gallery.dataset.activeIndex, '2');
sample.registered.touchstart({ changedTouches: [{ screenX: 200 }] });
sample.registered.touchend({ changedTouches: [{ screenX: 100 }] });
assert.equal(sample.gallery.dataset.activeIndex, '0', 'Swipe left must advance');
console.log('Standalone gallery: 17 assets, captions, arrows, dots, keyboard and touch — PASS');
