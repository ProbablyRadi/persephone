# FC26 Career Wiki

A static FC26 career-mode archive/wiki for three custom career characters.

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
├── favicon.svg          # Football icon for modern browsers
├── favicon.ico          # Fallback tab icon
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

### European knockout ties and Head to Head

In the Champions League, Europa League, Conference League and Women's Champions League,
knockout **play-offs**, **Round of 16**, **quarter-finals** and **semi-finals** are
labelled `(agg)` when they are shown as two-legged ties. League-phase matches
and finals are single fixtures. The club qualifiers and play-offs that are
separate competition sections also use `(agg)`.

Fixture lists in `FULL_FIXTURES` retain their original scores. The H2H logic in
`app.js` interprets those records as follows:

- An **aggregate-only** score counts as **two matches played (P)**, but its
  overall outcome contributes only **one win, draw or loss** (including
  recorded penalty shoot-outs). Aggregate goals are counted **once**, not twice.
- If the data lists **both individual legs** plus a duplicate aggregate total,
  H2H counts the real results of the two legs; the summary adds nothing.
- **P may not equal W + D + L** because a single aggregate-score entry stands
  for two played matches but contributes just one outcome. The site explains
  this beneath the Head to Head summary, rather than adding extra columns.
- Win percentage is recorded wins divided by matches played (W / P). Because
  only one win can be recorded from an aggregate-only tie, this is a simplified
  accounting convention, **not** a reconstruction of its leg-by-leg results.
- International World Cup/Euros knockout rounds are always single matches and
  are **not** affected by aggregate accounting.

The `tests/verify-h2h.js` regression test checks both the `(agg)` labels and
correct two-leg handling. New season data should preserve accurate
`DATA.<player>.uefaRoundBreaks` positions for its competition stages.

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

On each player overview, the club and international career summaries appear in the right-hand infobox, like Wikipedia. The larger Career statistics and Honours sections remain full-width below the introductory content. Both infobox summaries are generated from the same `DATA.<player>.career` and `DATA.<player>.intl` fields as before.

Flag and nationality columns in sortable tables are ordered alphabetically by country name, even though the displayed flags are local PNG images.

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

### Checking new seasons

Run the automated checks with Node.js from the project directory:

```bash
node tests/verify-h2h.js
node tests/verify-overviews.js
node tests/verify-jordan-2028.js
node tests/verify-jordan-2029.js
node tests/verify-flag-sorting.js
node tests/verify-rens-2035.js
```

Jordan's **Champions Trophy** pre-season fixtures use the same
`PRESEASON_TABLES` structure as other seasons' pre-season friendlies, with
the competition name visible in the season page. European league-phase
standings appear alongside the Europa League results; all other competition
results remain part of the same character file.

For **in-progress seasons**, a league-participant list does not imply a current
ranking: use blank `Pos` entries until positions are known. You can record
statistics for a player's club from supplied fixtures while leaving other
clubs' records blank. The Timeline does not display a provisional top five
until standings with ranked teams and points are available. Rens’s **2035–36 Bundesliga** entry list follows this convention: the 18 confirmed participants are supplied in their listed order, with league positions and unreported results left blank; the Timeline compares names against 2034–35 to identify the new entrants. Keep individual
player season statistics blank until they are separately supplied.

## Changelog

See [`CHANGELOG.md`](CHANGELOG.md) for a reconstructed history of the major changes made during development.

## Adding an in-progress season

The current example is Jordan Vale's **2029–30 Manchester United** season in `data/jordan.js`.

- Add the new season under `DATA.jordan.seasons` with `inProgress: true`, and add a season row to `DATA.jordan.stats` using empty strings for statistics not yet known. Do not use `0` until the figure is confirmed.
- Add competition names with empty arrays in `FULL_FIXTURES.jordan`; they display **No fixtures recorded yet** until results are added.
- Add a `SEASON_TABLES.jordan` entry with the club name, league, a blank standing row, and the squad sheet. Each player row uses `[position, number, name, appearances, goals, assists, clean sheets]`.
- Add nationalities to `DATA.jordan.squadFlags` only when known. Florian Daems (Belgium), Rik Dekker (Netherlands) and Mauricio (Paraguay) have confirmed flags.
- The Timeline reads the new season's club and squad. The Career Overview excludes in-progress statistics from completed career totals, and Head to Head does not gain matches from empty fixture arrays.

Run `node tests/verify-jordan-2029.js` after making season changes.
