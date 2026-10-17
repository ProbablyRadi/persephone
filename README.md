# FC26 Career Wiki

A static FC26 career-mode archive/wiki for four custom career characters.

## Running the site

You can open `index.html` directly in a browser, or serve this folder with any static web server.

The site is also suitable for hosting with services such as GitHub Pages.

**After an update:** upload/replace the complete `index.html`, `app.js`, and any
changed `data/*.js` files together (preserving the `data/` folder). The HTML
uses versioned script URLs to force the browser to fetch new versions. If the
live site still shows an old value, reload the page with Ctrl+F5 (or
Cmd+Shift+R on macOS), and verify the updated files reached the hosting service.

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

### Finding information in a character file

Every character file (`rens.js`, `jordan.js`, `vasi.js`) now has the **same five numbered sections**, in the same order. Search for a section heading or a season such as `// 2028–29`:

| Section | JavaScript object | What to edit |
| --- | --- | --- |
| 01 — Profile, career and season summaries | `DATA.<player>` | Identity, biography, club career, international career, career statistics, awards, honours and season summaries |
| 02 — Match results | `FULL_FIXTURES.<player>` | Fixtures organised by season and competition (also powers Head to Head) |
| 03 — League tables and squads | `SEASON_TABLES.<player>` | Domestic league standings and squad lists |
| 04 — Pre-season tables | `PRESEASON_TABLES.<player>` | Friendly/pre-season competition tables |
| 05 — Other competition tables | `COMPETITION_TABLES.<player>` | European and other tournament standings |

Subheadings inside `DATA.<player>` identify player details, career records, honours and season summaries. Season labels throughout the other sections are comments for navigation; they are **not** extra data and have no effect on the website. Some fields appear only for certain players when needed, such as additional timeline data or future overview placeholders.

The website still loads the five data files as ordinary JavaScript using `index.html`. No folders were split, no imports/exports were added, and `app.js` uses the same structures as before.

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

### Head to Head fixture accounting

Head to Head is computed from each character's `FULL_FIXTURES` archive: domestic
league and cup matches, European club competitions, pre-season friendlies and
international fixtures. Only matches involving the character's recorded club
or national team are counted; unrelated tournament fixtures are excluded.
Overlapping World Cup/Euros fixtures recorded on adjacent season pages are
counted once. The numbers reflect the supplied team fixtures (including
fixtures marked as missed through injury), rather than individual player
appearances. Season placeholders do not generate fictional matches.


## Development

The project is intentionally formatted for readability and learning. JavaScript, CSS and data files are kept expanded and consistently structured rather than compressed into dense one-line code.

## Changelog

See [`CHANGELOG.md`](CHANGELOG.md) for a reconstructed history of the major changes made during development.
