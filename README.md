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


## Photo gallery

The home page has three large character tiles, with a small **Photo gallery**
link at the lower-right. It opens a separate `#gallery` page with a large carousel,
and a link back to the character-select page.

The gallery currently displays seven user-provided photos: one of Rens, four of
Vasi, and two of Jordan, in that order. The current captions are brief
image descriptions and can be replaced with fuller stories later. To add
more photos, place them in `assets/gallery/` and list them in
`data/gallery.js` in the order they should appear:

```js
const GALLERY_ITEMS = [
    {
        src: 'assets/gallery/match-day.jpg',
        alt: 'An accessible description of the image',
        title: 'Match day',
        description: 'A caption describing what happened.'
    }
];
```

The carousel displays captions over each photo and supports previous/next
buttons, indicator dots, keyboard left/right arrows, and touch swipes. At least
two photos are needed to show navigation controls. No framework is required.

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

### Player overview layout

On each character's main overview, the compact **Club career** and
**International career** tables remain inside the right-hand infobox. The
**Honours** section appears directly below Contents, using the space alongside
the infobox; its honour groups flow **left to right** in up to two columns.
Players with a single honour group (such as Vasi) have it aligned at the left.
The large **Career statistics** table begins below both at full width. Narrow
screens display honours in one column. The honours still come from
`DATA.<player>.honours` and are not duplicated or moved into the infobox.

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

On each player overview, the club and international career summaries appear in the right-hand infobox, like Wikipedia. The larger Career statistics table remains full-width below the introductory content; Honours appears beside the infobox. Both infobox summaries are generated from the same `DATA.<player>.career` and `DATA.<player>.intl` fields as before.

Flag and nationality columns in sortable tables are ordered alphabetically by country name, even though the displayed flags are local PNG images. The compact **Club career** and **International career** tables inside player infoboxes are intentionally not sortable, so the chronology stays fixed. Larger league, squad and Head to Head tables remain sortable.

### Head to Head fixture accounting

Head to Head is computed from each character's `FULL_FIXTURES` archive: domestic
league and cup matches, European club competitions, pre-season friendlies and
international fixtures. Only matches involving the character's recorded club
or national team are counted; unrelated tournament fixtures are excluded.
World Cup and Euros editions are kept together on **one season page** (usually
named for the tournament year, e.g. Jordan's *2026 World Cup* is wholly in
**2026–27** and his *Euro 2028* wholly in **2028–29**). Their group standings,
knockout results and season summaries stay with the fixtures. Qualifiers remain
in the seasons in which they were supplied. Jordan's Sweden 0–3 England
and England 0–0 Ecuador results are 2025–26 **International Friendlies**,
not part of the 2026 World Cup. The World Cup page holds only its 35 tournament
results. The numbers reflect the supplied team fixtures (including fixtures
marked as missed through injury), rather than individual player appearances.
Season placeholders do not generate fictional matches.

The **Represented** column shows the number of matches played while representing
*each* club or national team against that opponent, e.g. `Bristol City (5),
Manchester United (2)`. Counts are calculated from the same eligible fixtures
as **P**: two-legged aggregate-only ties count as two played matches, repeated
international fixtures and aggregate-summary duplicates are excluded. The
represented counts on any opponent row should therefore add up to that row's
**P**, even when P differs from W + D + L.


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

Jordan's **2029–30** Manchester United season is now **complete**: all 38
Premier League scores agree with the supplied fourth-place finish (74 points,
23 wins, 5 draws, 10 losses, 72 GF, 44 GA), and the Carabao Cup final is
recorded as a Manchester United win over Leeds United. The complete 39-player
squad is included in `SEASON_TABLES.jordan`, and Jordan's detailed season record
shows 48 appearances and 18 clean sheets. England's career infobox records
42 caps (independently supplied: do not infer caps from fixture lists).
`DATA.jordan.timelineInSeasonSquadUpdates` records roster differences between
snapshots *within* a season; "Left" means missing from the newer supplied list,
not necessarily a confirmed transfer. The provided squad assigns No. 31 to
both Senne Lammens and Marco Palestra; this is preserved pending clarification.
Emeka Adiele and Andre Garcia have confirmed English nationalities and use
the local England flag image.

## Changelog

See [`CHANGELOG.md`](CHANGELOG.md) for a reconstructed history of the major changes made during development.

## Adding an in-progress season

A good example to study is the earlier in-progress structure (now completed) of Jordan Vale's **2029–30 Manchester United** season in `data/jordan.js`. For a current example, refer to Rens’s **2035–36** entry in `data/rens.js`.

- Add the new season under `DATA.jordan.seasons` with `inProgress: true`, and add a season row to `DATA.jordan.stats` using empty strings for statistics not yet known. Do not use `0` until the figure is confirmed.
- Add competition names with empty arrays in `FULL_FIXTURES.jordan`; they display **No fixtures recorded yet** until results are added.
- Add a `SEASON_TABLES.jordan` entry with the club name, league, known standings values and squad sheet. Each player row uses `[position, number, name, appearances, goals, assists, clean sheets]`; keep any unreported entries blank.
- Add nationalities to `DATA.jordan.squadFlags` only when known. Florian Daems (Belgium), Rik Dekker (Netherlands) and Mauricio (Paraguay) have confirmed flags.
- The Timeline reads the season's club and squad, plus optional in-season roster additions/removals from `timelineInSeasonSquadUpdates`. The Career Overview's subtotals and grand total exclude in-progress seasons, even if the current-season row has supplied statistics. The smaller club-career infobox can show up-to-date appearances. Head to Head only counts scored fixtures, not pending fixtures.

Run `node tests/verify-jordan-2029.js` after editing Jordan’s completed 2029–30 season; the test validates all 38 league scores, the final standings, cup results, squad, Timeline, and overview.

## Vasi's completed 2028–29 season

Vasi's final 2028–29 Barcelona statistics are recorded in `data/vasi.js`: **43 appearances, 37 goals, 1 assist, 15 clean sheets**, and a **Liga F title** on **78 points**. The file contains 30 league results, the 16-team final league table, 24 squad rows, the 17-line Women's Champions League bracket (including neutral-club results), and the pre-season Champions Trophy. The career infobox totals **162 appearances and 170 goals** over her four completed Barcelona seasons.

Her **2028–29 average rating and POTM/MOTM counts were not supplied**. Leave them unreported until confirmed; the award grand total displays a dash because that season is missing award counts (the earlier three years' supplied awards remain intact). Anna Affolter's nationality is confirmed as Swiss and her flag uses the local Switzerland image.

**Corrected UEFA result:** The 2028–29 Women's Champions League league phase includes **Juventus 0–2 FC Barcelona** (previously recorded the wrong way round). Barcelona’s six recorded results now agree with the supplied league-phase standings: **4 W / 1 D / 1 L, 12 GF / 7 GA and 13 points**.

Run `node tests/verify-vasi-2028.js` along with the existing regression tests after future updates.


Latest local change: Jordan Vale overview updated to Brighton & Hove / number 99 / future PSV plan.


### 2030–31 Jordan data notes
Brighton's 2030–31 Premier League membership list is recorded with placeholder ranks and incomplete points; it must **not** be displayed as final standings. The separate fixture archive currently contains 3 Brighton Premier League results (1 win, 1 draw, 1 loss; 4 points) and one Carabao Cup result (3–1 win at MK Dons), on top of 3 pre-season wins. Jordan's latest user-supplied 34-player Brighton roster lists 7 appearances, 0 goals, 0 assists and 3 clean sheets for him. These are in-progress season figures and are excluded from completed-season career totals.

The 2030–31 Premier League entrant comparison now recognises Fulham, Leeds United and Ipswich after the user corrected the duplicate Wolves entry. The England World Cup source contains 8 England fixtures but not Jordan's individual appearances; the user explicitly confirmed his international record as **50 caps, 0 goals**. The user confirmed nine earlier Brighton squad nationalities. Tom Watson is English (Premier League player biography); Cherif Diouf and Samuele Fabbri have unknown nationalities and are shown without flags until confirmed. The Champions Trophy source still says "VfG Stuttgart", which is left unchanged pending user correction.

### Latest Vasi season (2029–30)

Vasi's 2029–30 FC Barcelona Femení season is **in progress**. The currently recorded three Champions Trophy fixtures and 27-player squad live in `data/vasi.js`. The Liga F teams are listed without actual rankings until league games are supplied. Three squad nationalities are awaiting confirmation (Steinunn Einarsdóttir, Alizée Coulon and Teagan McNamara).


### Character-select home screen

The home screen uses a full-width layout (no left sidebar), with image-backed tiles taking approximately 75% of the viewport width on desktops and stacking on phones. Selecting “Choose character” in the top Character menu from any player or season returns to `#home`.
