// Application entry point: routing and browser setup.
// Page renderers and reusable helpers are loaded first from js/.

function route() {
    let routePath = 'home';
    try {
        routePath = decodeURIComponent(location.hash.slice(1) || 'home');
    }
    catch (error) {
        // An incomplete percent-encoded URL should still open a usable page.
    }
    let [id, pageName, ...extraSegments] = routePath.split('/');
    const isCharacter = Object.hasOwn(DATA, id);
    const validPage = !pageName || (isCharacter && (
        ['analysis', 'timeline', 'stats', 'comparisons'].includes(pageName)
        || Object.hasOwn(DATA[id].seasons, pageName)
    ));
    if (extraSegments.length || !validPage || (!isCharacter && id !== 'home' && id !== 'gallery'))
        id = 'home';
    const playerData = Object.hasOwn(DATA, id) ? DATA[id] : null;
    // Use a wide, sidebar-free canvas on the home and photo-gallery pages.
    document.body.classList.toggle('is-home', id === 'home');
    document.body.classList.toggle('is-gallery', id === 'gallery');
    if (characterSelect)
        characterSelect.value = playerData ? id : '';
    if (id === 'home')
        home();
    else if (id === 'gallery')
        galleryPage();
    else if (playerData && pageName === 'analysis')
        careerAnalysis(id);
    else if (playerData && pageName === 'timeline')
        careerTimeline(id);
    else if (playerData && pageName === 'stats')
        careerStats(id);
    else if (playerData && pageName === 'comparisons')
        careerComparisons(id);
    else if (playerData && pageName && Object.hasOwn(playerData.seasons, pageName))
        season(id, pageName);
    else if (playerData)
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
