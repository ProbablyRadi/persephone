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
    └── vasi.js
```

## Player data

Character-specific data lives in the `data/` directory, while shared football definitions are kept separately:

- `data/base.js` — creates the shared data containers.
- `data/definitions.js` — shared team flags and canonical team-name overrides.
- `data/rens.js` — Rens profile, fixtures, squad sheets and tables.
- `data/jordan.js` — Jordan profile, fixtures, squad sheets and tables.
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

### Career-overview statistics and awards

The career-statistics table on every player's **Overview** page is generated from
`DATA.<player>.stats` (the same 10-field season rows used by season pages and Stats charts).
All players get the same columns for Role, League, Position, Average Rating,
Player of the Month, Player of the Match, appearances, goals, assists and clean sheets.
Every player has the Club column, including players who have only played for one club.
The column order is identical for all players. Club subtotals and multi-club grand
totals are calculated from **completed** seasons; live stats are visible in their
season rows but are excluded from these totals.

Optional season award counts live in `DATA.<player>.careerAwards`:

```js
"careerAwards": {
  "2025–26": { "playerOfTheMonth": 0, "playerOfTheMatch": 9 }
}
```

Use numbers including `0` only for **known** award counts. If an award count has not
been supplied, omit it or leave the season out: the overview will show `—` instead.
The awards appear **only in the Overview career-statistics table**, and do not
change the season-stat rows or any underlying match/season calculations.

Optional `careerOverviewFutureRows` can show supplied future-season placeholders
without creating playable seasons or affecting Timeline, H2H, or the career totals.
Each entry is `[season, club, role?, league?]`.

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
