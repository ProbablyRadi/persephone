# FC26 Career Wiki

A static FC26 career-mode archive/wiki for four custom career characters.

## Running the site

You can open `index.html` directly in a browser, or serve this folder with any static web server.

The site is also suitable for hosting with services such as GitHub Pages.

## Project structure

```text
site/
├── index.html
├── app.js
├── styles.css
├── README.md
├── assets/
└── data/
    ├── base.js
    ├── definitions.js
    ├── rens.js
    ├── jordan.js
    ├── espen.js
    └── vasi.js
```

## Player data

Character-specific data lives in the `data/` directory, while shared football definitions are kept separately:

- `data/base.js` — creates the shared data containers.
- `data/definitions.js` — shared team flags and canonical team-name overrides.
- `data/rens.js` — Rens profile, fixtures, squad sheets and tables.
- `data/jordan.js` — Jordan profile, fixtures, squad sheets and tables.
- `data/espen.js` — Espen profile, fixtures, squad sheets and tables.
- `data/vasi.js` — Vasi profile, fixtures, squad sheets and tables.

Each character file fills the same shared structures:

```js
DATA
FULL_FIXTURES
SEASON_TABLES
PRESEASON_TABLES
COMPETITION_TABLES
```

Keeping each character's information in one file makes it easier to find and edit their profile, career stats, fixtures, league tables, squad sheets and competition tables without changing the interface used by `app.js`.

## Main pages

Each character has access to:

- Overview
- Timeline
- Stats
- Head to Head
- Individual season pages

The site supports the Wiki, Dracula and Glass themes.

## Development

The project is intentionally formatted for readability and learning. JavaScript, CSS and data files are kept expanded and consistently structured rather than compressed into dense one-line code.

## Changelog

See [`CHANGELOG.md`](CHANGELOG.md) for a reconstructed history of the major changes made during development.
