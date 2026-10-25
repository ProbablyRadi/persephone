// Home-page rendering, routing, asset wiring and gallery behaviour.
// Run: node --test tests/home.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createSite, root, read, scriptFiles } = require('./helpers/site');

test('Home images resolve from the page; real routes and character controls select the right view', () => {
    const site = createSite();
    const { app, context, evaluate, characterSelect } = site;
    site.startApp();
    assert.equal(app.className, 'home-page');
    assert(site.activeClasses.has('is-home'));
    const characters = evaluate('DATA');
    assert.equal((app.innerHTML.match(/class="home-player-tile /g) || []).length, Object.keys(characters).length);
    for (const player of Object.values(characters)) {
        assert(app.innerHTML.includes(player.displayName));
        assert(fs.existsSync(path.join(root, player.homeBackground)));
        assert(app.innerHTML.includes(new URL(player.homeBackground, site.document.baseURI).href));
    }
    assert(app.innerHTML.includes('href="#gallery"'));
    assert(!app.innerHTML.includes('gallery-carousel'));
    assert.equal(evaluate("homeImageUrl('https://example.test/crest.svg')"), 'https://example.test/crest.svg');
    site.document.baseURI = 'file:///D:/career/index.html';
    assert.equal(evaluate("homeImageUrl('assets/character-select/jordan.jpg')"), 'file:///D:/career/assets/character-select/jordan.jpg');

    const routes = {
        '#gallery': 'gallery-page', '#rens': 'profile-page',
        '#jordan/2030–31': 'season-view', '#vasi/stats': 'stats-page',
        '#rens/timeline': 'timeline-page', '#jordan/analysis': 'analysis-page',
        '#vasi/comparisons': 'comparisons-page', '#not-a-player': 'home-page'
    };
    for (const [hash, className] of Object.entries(routes)) {
        site.navigate(hash);
        assert.equal(app.className, className, hash);
        assert.equal(site.activeClasses.has('is-home'), className === 'home-page');
        assert.equal(site.activeClasses.has('is-gallery'), className === 'gallery-page');
    }
    characterSelect.value = 'rens';
    characterSelect.emit('change');
    assert.equal(context.location.hash, '#rens');
    site.navigate(context.location.hash);
    assert.equal(characterSelect.value, 'rens');
    characterSelect.value = '';
    characterSelect.emit('change');
    site.navigate(context.location.hash);
    assert.equal(app.className, 'home-page');
});

test('Invalid URL hashes fall back to home on startup and navigation; valid links still work', () => {
    const site = createSite();
    site.context.location.hash = '#rens/50%';
    assert.doesNotThrow(() => site.startApp());
    assert.equal(site.app.className, 'home-page');

    for (const hash of [
        '#%', '#rens/%E0%A4%A', '#constructor', '#toString', '#__proto__/stats',
        '#rens/constructor', '#rens/toString', '#rens/__proto__',
        '#unknown/stats', '#rens/unknown-season', '#rens/stats/extra', '#gallery/extra'
    ]) {
        site.navigate('#jordan/analysis');
        assert.doesNotThrow(() => site.navigate(hash), hash);
        assert.equal(site.app.className, 'home-page', hash);
        assert(site.activeClasses.has('is-home'), hash);
        assert(!site.activeClasses.has('is-gallery'), hash);
        assert.equal(site.characterSelect.value, '', hash);
        assert.equal(site.nav.innerHTML, '', hash);
    }

    site.navigate('#rens/' + encodeURIComponent('2031–32'));
    assert.equal(site.app.className, 'season-view');
    assert.equal(site.characterSelect.value, 'rens');
    assert(!site.activeClasses.has('is-home'));
    assert(site.app.innerHTML.includes('2031–32'));
});

test('All declared script/style assets exist, are versioned and load in the required order', () => {
    const html = read('index.html');
    const assets = [...html.matchAll(/<(?:script|link)[^>]+(?:src|href)="([^"#]+)"/g)]
        .map(match => match[1]).filter(url => /\.(js|css)(?:\?|$)/.test(url));
    assert(assets.length > 0);
    for (const url of assets) {
        assert.match(url, /\?v=.+/, 'Missing cache version: ' + url);
        assert(fs.existsSync(path.join(root, url.split('?')[0])), 'Missing asset: ' + url);
    }
    const scripts = scriptFiles();
    assert.equal(scripts.at(-1), 'app.js');
    assert(scripts.indexOf('data/base.js') < scripts.indexOf('data/vasi.js'));
    assert(scripts.indexOf('data/gallery.js') < scripts.indexOf('js/gallery.js'));
    const styles = [...html.matchAll(/<link rel="stylesheet" href="([^"?]+)/g)].map(match => match[1]);
    assert.deepEqual(styles, ['styles.css', 'styles/appearance.css', 'styles/pages.css', 'styles/mobile.css']);
});

test('Gallery handles real image assets, source ordering, empty state, clicks, keyboard and swipes', () => {
    const snippet = read('js/shared.js') + '\n' + read('js/gallery.js');
    const galleryData = read('data/gallery.js');
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
    assert(galleryItems.length > 1);
    for (const [index, item] of galleryItems.entries()) {
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
    assert.deepEqual([...populated.app.innerHTML.matchAll(/<img src="([^"]+)"/g)].map(match => match[1]), Array.from(galleryItems, item => item.src));
    assert.equal((populated.app.innerHTML.match(/class="gallery-slide"/g) || []).length, galleryItems.length);
    assert(populated.app.innerHTML.includes('Gallery · 1 / ' + galleryItems.length));
    assert.match(populated.app.innerHTML, /href="#home"/);
    populated.registered.click({ target: { closest() { return { dataset: { galleryAction: 'previous' } }; } } });
    assert.equal(populated.gallery.dataset.activeIndex, String(galleryItems.length - 1),
        'Previous should wrap to the final image');

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
});
