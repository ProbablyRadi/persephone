// Application entry point: routing and browser setup.
// Page renderers and reusable helpers are loaded first from js/.

function route() {
    let routePath = decodeURIComponent(location.hash.slice(1) || 'home'), [id, pageName] = routePath.split('/');
    // Use a wide, sidebar-free canvas on the home and photo-gallery pages.
    document.body.classList.toggle('is-home', id === 'home' || (!DATA[id] && id !== 'gallery'));
    document.body.classList.toggle('is-gallery', id === 'gallery');
    if (characterSelect)
        characterSelect.value = DATA[id] ? id : '';
    if (id === 'home')
        home();
    else if (id === 'gallery')
        galleryPage();
    else if (DATA[id] && pageName === 'analysis')
        careerAnalysis(id);
    else if (DATA[id] && pageName === 'timeline')
        careerTimeline(id);
    else if (DATA[id] && pageName === 'stats')
        careerStats(id);
    else if (DATA[id] && pageName && DATA[id].seasons[pageName])
        season(id, pageName);
    else if (DATA[id])
        player(id);
    else
        home();

    replaceFlagEmoji(app);
    replaceFlagEmoji(nav);
    window.scrollTo(0, 0);
}
addEventListener('hashchange', route);

function updateTopPlayerShortcuts() {
    const hash = (location.hash || '#home').toLowerCase();
    const isMain = hash === '' || hash === '#main' || hash === '#home';
    document.querySelectorAll('.site-navigation a[data-page]').forEach(link => {
        link.style.display = isMain ? '' : 'none';
    });
}

// Browser controls.
const app = document.querySelector('#app'), nav = document.querySelector('#seasonNav');
const characterSelect = document.querySelector('#characterSelect');
const themeSelect = document.querySelector('#themeSelect');
const THEMES = [
    'light', 'dracula', 'glass'
];
// Native disclosure keeps the complete career archive available on phones.
const careerMenu = document.querySelector('#careerMenu');
if (careerMenu) {
    const mobileLayout = window.matchMedia('(max-width: 760px)');
    const syncCareerMenu = () => { careerMenu.open = !mobileLayout.matches; };
    syncCareerMenu();
    mobileLayout.addEventListener('change', syncCareerMenu);
    careerMenu.addEventListener('click', event => {
        if (mobileLayout.matches && event.target.closest('a')) {
            careerMenu.open = false;
            app.focus({ preventScroll: true });
        }
    });
    window.addEventListener('hashchange', () => {
        if (mobileLayout.matches)
            careerMenu.open = false;
    });
}
function setTheme(mode) {
    if (!THEMES.includes(mode))
        mode = 'light';
    document.body.classList.toggle('theme-terminal', mode === 'dracula');
    document.body.classList.toggle('theme-dracula', mode === 'dracula');
    document.body.classList.toggle('theme-glass', mode === 'glass');
    document.body.classList.toggle('font-proggy', mode === 'dracula');
    if (themeSelect) {
        themeSelect.value = mode;
    }
    try {
        localStorage.setItem('fc26-theme', mode);
    }
    catch (error) {
    }
}
let initialTheme = 'light';
try {
    initialTheme = localStorage.getItem('fc26-theme') || 'light';
}
catch (error) {
}
setTheme(initialTheme);
if (themeSelect)
    themeSelect.addEventListener('change', () => setTheme(themeSelect.value));
if (characterSelect)
    characterSelect.addEventListener('change', () => {
        const selectedCharacter = characterSelect.value;
        // The placeholder option is also a shortcut back to the home page.
        if (!selectedCharacter) {
            location.hash = '#home';
            return;
        }
        if (DATA[selectedCharacter])
            location.hash = `#${selectedCharacter}`;
    });

// Rendering enhancements.
const renderObserver = new MutationObserver(() => {
    enhanceTables(app);
    replaceFlagEmoji(app);
    replaceFlagEmoji(nav);
});

renderObserver.observe(app, {
    childList: true,
    subtree: true
});

renderObserver.observe(nav, {
    childList: true,
    subtree: true
});

route();
updateTopPlayerShortcuts();
window.addEventListener('hashchange', updateTopPlayerShortcuts);
