# FC26 Career Wiki — project guide

This site is a career-mode archive for Rens Adisea, Jordan Vale and Vasiliki
Dimitriou. It displays their profiles, season results, squads, standings,
career statistics, timelines and photos.

It is a static website: HTML provides the page structure, CSS controls its
appearance, and JavaScript turns the recorded data into pages. Everything
runs in the browser. There is no database, build step or application server.
You can open `index.html` directly or serve the folder as a website.

## Folder structure

```text
persephone/
├── index.html
├── app.js
├── styles.css
├── favicon.svg
├── favicon.ico
├── README.md
├── CHANGELOG.md
├── data/
│   ├── base.js
│   ├── definitions.js
│   ├── team-colours.js
│   ├── rens.js
│   ├── jordan.js
│   ├── vasi.js
│   └── gallery.js
├── js/
│   ├── shared.js
│   ├── profile.js
│   ├── matches.js
│   ├── timeline.js
│   ├── stats.js
│   ├── comparisons.js
│   ├── season.js
│   ├── tables.js
│   └── gallery.js
├── styles/
│   ├── appearance.css
│   ├── pages.css
│   └── mobile.css
├── assets/
│   ├── character-select/
│   ├── flags/
│   ├── gallery/
│   ├── portraits/
│   └── stadium-glass-bg.jpg
└── tests/
    ├── fixtures/
    │   └── vasi-2029-final.json
    ├── helpers/
    │   └── site.js
    ├── players/
    │   ├── jordan.test.js
    │   ├── rens.test.js
    │   └── vasi.test.js
    ├── head-to-head.test.js
    ├── home.test.js
    ├── international.test.js
    ├── profiles.test.js
    ├── season-comparisons.test.js
    └── table-sorting.test.js
```

## Files in the main folder

| File | Purpose |
| --- | --- |
| `index.html` | The page shell: header, character/theme selectors, navigation and the empty main content area. It also lists the stylesheets, data files and scripts to load. |
| `app.js` | Starts the site, reads the URL to choose a page, connects the selectors, remembers the chosen theme and manages the mobile career menu. It watches rendered content so flags and table controls can be added. |
| `styles.css` | The first stylesheet. Defines shared colours, basic page layout, tables, navigation and career dashboard styling. |
| `favicon.svg` | Scalable football icon shown in the browser tab. |
| `favicon.ico` | Alternative browser-tab icon for browsers that use the ICO format. |
| `README.md` | This guide to the project's files and how they fit together. |
| `CHANGELOG.md` | The history of changes to the site's code, content and design. |

## `data/` — the information shown on the site

These files hold the football records and image references. The files in
`js/` read this information to build the pages.

| File | Purpose |
| --- | --- |
| `base.js` | Creates the shared objects that the character files fill with data. Loads before the other data files. |
| `definitions.js` | Shared definitions: flag image paths, team flags, alternative team names and league relegation-place counts. |
| `team-colours.js` | Main/accent club palettes for the comparison graphs and table swatches, plus display-name aliases. Colours represent club identity rather than historical kits; unmapped clubs use a stable fallback. |
| `rens.js` | Rens's profile, career history, honours, statistics, season summaries, fixtures, squads and competition tables. |
| `jordan.js` | Jordan's records, using the same structure as Rens's file. |
| `vasi.js` | Vasi's records, using the same structure as the other character files. |
| `gallery.js` | The ordered photo list, with each image's path, alternative text, title and description. |

Each character file has five numbered sections:

| Section | Shared object | Contents |
| --- | --- | --- |
| 01 — Profile, career and season summaries | `DATA` | Personal details, career records, honours, statistics and season summaries. |
| 02 — Match results | `FULL_FIXTURES` | Fixtures grouped by season and competition. |
| 03 — League tables and squads | `SEASON_TABLES` | League standings and player lists for each season. |
| 04 — Pre-season tables | `PRESEASON_TABLES` | Pre-season competition standings. |
| 05 — Other competition tables | `COMPETITION_TABLES` | Other tournament standings, including league phases and groups. |

The character name is a key inside each shared object. For example,
`DATA.rens` holds Rens's profile and season summaries, while
`FULL_FIXTURES.rens` holds his match results. Season records are nested under
season names such as `2025–26`.

These are JavaScript data files, rather than separate HTML pages. Keeping all
of a character's records together lets the different page renderers use the
same information.

## `js/` — building the pages and controls

A renderer is a function that builds HTML from data and places it in the
page. These files contain the renderers and their supporting functions.

| File | Purpose |
| --- | --- |
| `shared.js` | Shared helpers for escaping text, replacing flag emoji with local images and creating basic tables. |
| `profile.js` | Builds character overviews, portrait infoboxes, career summaries, honours and the career navigation links. |
| `matches.js` | Reads recorded score strings, identifies teams and outcomes, builds fixture/standings/squad tables and calculates Head to Head records. |
| `timeline.js` | Builds season timeline cards, including league finishes, cup podiums, squad changes and movement between leagues. |
| `stats.js` | Prepares career statistics and draws charts as SVG markup. Also builds the Stats page and its season totals table. |
| `comparisons.js` | Builds focused, club-coloured league graphs with multi-team selection, character-club defaults, an optional all-teams view and shaded exact-position tables. Outside-league points mark entry/exit without long lines across absent seasons; unreported records remain gaps. Only completed seasons are included. |
| `season.js` | Assembles a season page: summary, headline statistics, section links, squad, standings and competition panels. Uses table builders from `matches.js`. |
| `tables.js` | Adds sorting controls to eligible tables, works out country names for flag sorting and creates scrollable table regions. |
| `gallery.js` | Builds the home character-selection tiles and photo gallery. Handles gallery arrows, dots, keyboard navigation and touch swipes. |

These are ordinary browser scripts, sharing one JavaScript scope. They do
not use `import` or `export`. `index.html` loads them before `app.js` starts
rendering, so the entry point can call their functions.

## `styles/` — appearance and responsive layouts

The browser loads the stylesheets in this order:

1. `styles.css` — shared layout and base styling.
2. `styles/appearance.css` — Glass and Dracula appearance, header controls and competition-layout overrides.
3. `styles/pages.css` — home, timeline, charts, profile summaries and gallery styling, plus shared typography.
4. `styles/mobile.css` — phone layouts, mobile navigation, touch controls, vertical timelines and reduced-motion styling.

CSS rules loaded later can override earlier ones, so this order matters.
The same pages support Wiki, Dracula and Glass through classes on the
`body` element. The selected theme is saved in the browser's local storage.

CSS image paths are relative to the stylesheet containing them. A file in
`styles/` therefore uses `../assets/` to reach the main assets folder.

## `assets/` — images

| Folder or file | Purpose |
| --- | --- |
| `character-select/` | Image backgrounds for the character tiles on the home page. |
| `flags/` | Local country flag PNGs used in profiles, navigation, fixtures and tables. |
| `gallery/` | Photo-gallery images. Its `README.txt` is an older note about the image collection; `data/gallery.js` defines the actual current list and order. |
| `portraits/` | Character portrait images used in profile infoboxes. |
| `stadium-glass-bg.jpg` | Stadium background for the Glass theme. |

The data and stylesheets refer to these images by their paths. An image
appears on the site when a data entry or CSS rule points to it.

## `tests/` — checks for the data and interface

These are development files. The website does not load them, and you do not
need to upload this folder to hosting. They use Node.js's built-in test runner
and require no npm packages. The suite was checked with Node.js 22.

Run every test from the project folder:

```powershell
node --test
```

Run just one feature or character:

```powershell
node --test tests/head-to-head.test.js
node --test tests/players/vasi.test.js
```

| File | What it checks |
| --- | --- |
| `home.test.js` | Real app routing, character selection, absolute home-image URLs, versioned asset files, gallery image order and click/keyboard/swipe behaviour. |
| `profiles.test.js` | Profile content, career/award totals, future placeholders, live-season exclusions and the order of infobox, honours and career statistics. |
| `head-to-head.test.js` | All three characters' opponent totals, represented-club counts, penalty outcomes, two-legged ties and duplicate aggregate summaries. |
| `table-sorting.test.js` | Country-name sorting for PNG/emoji flags, actual numeric sorting clicks and chronological tables that must not be sortable. |
| `international.test.js` | Tournament editions staying within one season, matching fixtures/tables/summaries and World Cup podiums. Distinguishes World Cup 2026 from World Cup 2030 even when both use the name World Cup. |
| `season-comparisons.test.js` | League finishes, team colours, completed-season filtering, promotions/relegations, missing records and entry/exit line geometry. |
| `players/jordan.test.js` | Jordan's 2028–29 and 2029–30 completed seasons, the live 2030–31 Brighton season, squads, nationalities and related timeline/results views. |
| `players/rens.test.js` | Rens's 2035–36 league entrants, Dortmund roster, confirmed flags and unreported figures remaining blank. |
| `players/vasi.test.js` | Vasi's 2028–29 and 2029–30 seasons, corrected scores, final standings/squads, aggregate accounting and dependent charts/pages. |
| `helpers/site.js` | Loads the real data and renderer scripts listed in `index.html` into a fresh isolated JavaScript context for each check. Supplies minimal browser doubles for routing tests. |
| `fixtures/vasi-2029-final.json` | A reference copy of the supplied final season sheet, used to verify every imported score, table and squad row independently of the current data file. |

The nine test files contain named checks, so a failure identifies the feature
or season that needs investigation. Character-specific checks stay grouped
by character rather than creating a new file for every season.

The reference-data checks are worth keeping: general tests might still pass
if a specific score, squad member or confirmed zero were accidentally changed.
When new data is supplied, confirm it against the source before updating the
relevant expectations. A historical-season test should not depend on a later
international-cap total; current profile totals belong in profile checks.

These Node tests check calculations, generated markup and selected control
behaviour. They do not render a browser layout. Changes to appearance still
need a visual check on desktop and phone widths and in the supported themes.

## How a page is displayed

1. The browser opens `index.html` and creates the header, navigation and main content area.
2. It loads the four stylesheets in order.
3. It runs `data/base.js`, shared definitions, the three character files and the gallery data.
4. It loads the functions in `js/`, then runs `app.js` to connect the controls and display the initial page.
5. `route()` in `app.js` reads the part of the URL after `#` and calls the appropriate renderer.
6. That renderer reads the shared data and replaces the contents of `<main id="app">`. It also updates the career navigation where needed.
7. The rendering observer adds table controls and converts flag emoji into images as content changes.

The URL selects a view inside the same HTML file:

| URL ending | View |
| --- | --- |
| `#home` | Character selection. |
| `#gallery` | Photo gallery. |
| `#rens` | Rens's overview. |
| `#rens/timeline` | Rens's career timeline. |
| `#rens/stats` | Rens's statistics and charts. |
| `#rens/analysis` | Rens's Head to Head records. |
| `#rens/comparisons` | League finishing-position comparisons across Rens's completed seasons. |
| `#rens/2025–26` | Rens's 2025–26 season page. |

Replace `rens` with `jordan` or `vasi` to open the equivalent character view.
Changing the hash triggers the router without downloading a separate HTML
page. On phones, the same content uses the layouts in `styles/mobile.css`.

The `?v=100` values attached to script and stylesheet paths in `index.html`
are cache-version numbers. When a file changes, increase its number (for
example, to `?v=101`) so browsers request the updated file. Each file can
have its own version number; the underlying filename stays the same.
