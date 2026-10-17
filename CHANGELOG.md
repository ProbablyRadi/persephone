## 2026-10-17 — Confirm three Manchester United squad nationalities

- Set Florian Daems to **Belgium**, Rik Dekker to **the Netherlands**, and Mauricio to **Paraguay** in Jordan's 2029–30 Manchester United squad.
- The existing local PNG flag assets are used; no new imagery or player statistics were required.
- Refreshed Jordan's script cache version and expanded the 2029–30 season test to check all three displayed flag images.

## 2026-10-17 — Jordan Vale joins Manchester United (2029–30, in progress)

- Added Jordan's **2029–30** season page with empty pre-season, Premier League, Carabao Cup and FA Cup fixture sections, and an unfilled league-standing row. No new results or statistics were invented.
- Recorded Jordan's move from Bristol City to **Manchester United** ahead of 2029–30; changed the overview current club, kit number to **1**, career-history start year to 2029, and player biography. The Bristol City career total remains 208 apps / 1 goal.
- Added the supplied **37-player Manchester United squad** with blank App/Goals/Asst/CLS values; mapped supported nationality flags and left Florian Daems, Rik Dekker and Mauricio unresolved pending confirmation.
- New season appears in the navigation and Timeline. Kept the one-file-per-player data architecture, existing Head to Head results, 2028–29 totals, themes and favicon unchanged.
- Added regression checks for the new season and refreshed Jordan's script version.

## 2026-10-17 — Jordan Vale 2028–29 season completed

- Replaced Jordan's partial 2028–29 season with the supplied completed season sheet.
- Updated Bristol City career record to **208 apps / 1 goal**, and the final season row to **59 apps, 0 goals, 5 assists, 18 CLS, 6.3 average**, **0 POTM / 2 MOTM**, **11th Premier League (49 points)**. Completed career totals now derive from all four seasons.
- Added all **38 Premier League fixtures**, the full **20-club table**, the **32-player Bristol City squad**, **Champions Trophy** and its 8-team table, Carabao Cup and FA Cup fixtures/finals, Community Shield, and the **31-row Europa League match archive** with its full **36-club league-phase table**.
- Marked Europa League knockout play-offs, Round of 16, quarter-finals and semi-finals as **(agg)**. Two Bristol City aggregate-only results contribute two matches played and only one W/L each to Head to Head, per existing site policy.
- Added four international friendlies, bringing the recorded England caps field from **30 to 34**. Kept overlapping Euros results de-duplicated in Head to Head.
- Updated the player biography, completed-season status, Stats page data and Timeline inputs, including winners/losers of the recorded cup finals and squad changes.
- Added missing team flags in shared definitions and a new `tests/verify-jordan-2028.js` regression check.
- Refreshed script version labels to avoid outdated cached data.

## 2026-10-17 — Standardise SS Lazio club name

- Renamed the club to **SS Lazio** in Rens's recorded Europa League fixture and two competition-table rows.
- Removed an obsolete flag lookup because `SS Lazio` already has an Italian flag entry.
- Updated the affected script version strings so browsers load the revised data.
- No results, standings, Head to Head calculations or character statistics were changed.

## 2026-10-17 — Simplified Head to Head aggregate totals

- Removed the extra `?`, `Agg W` and `Agg L` columns and summary counters.
- Two-legged European ties supplied only as an aggregate score now add two
  matches played, but one W/D/L result based on the aggregate outcome.
- Recorded individual legs still use their actual W/D/L results; duplicate
  aggregate summaries remain excluded and goals are not doubled.
- Added an on-page disclaimer explaining why P can exceed W + D + L.
- Restored Win % to recorded wins divided by matches played and updated tests.
- No fixture scores, character data, seasons or themes were modified.

## 2026-10-17 — Separate UEFA tie outcomes from match outcomes

- Added **Agg W** and **Agg L** to every player's Head to Head table for UEFA two-legged knockout ties.
- Aggregate-only rows now record two matches played but two unknown individual-leg results (`?`); they no longer manufacture two W/D/L results from the overall tie score.
- Ties with two recorded legs use the actual leg W/D/L and record one aggregate tie win/loss. Duplicate aggregate summary rows remain excluded.
- Aggregate goals remain counted only once; win percentage now uses only matches with known results.
- Expanded Head to Head validation and kept all original fixture scores, player data and all three themes unchanged.

## 2026-10-17 — Football favicon

- Added a small black-and-white football favicon for the browser tab.
- Included both a scalable `favicon.svg` and a multi-size `favicon.ico` fallback.
- Linked the icons in `index.html`; no player data, themes, or match logic changed.

### UEFA aggregate knockout labelling and H2H accounting (17 October 2026)

- Labelled all recorded UEFA club knockout play-offs, Round of 16,
  quarter-finals and semi-finals with `(agg)`; the final and league phase
  remain single matches.
- Standardised Vasi's Women's Champions League round headings to the same labels.
- Counted aggregate-only ties as two Head to Head matches without doubling
  their total goals, and removed duplicate aggregate summaries where both
  individual legs were already recorded.
- Kept a note explaining that W/D/L per leg is estimated from the aggregate
  result where the individual legs were never supplied.
- Extended H2H regression tests to cover the round headings and representative
  two-legged ties across all three careers.

## 2026-10-17 — Player data file readability and section labels

- Standardised the formatting of Rens, Jordan and Vasi's single-file character archives.
- Gave each file the same five numbered sections, labelled subsections within `DATA`, and season markers within the major season archives.
- Expanded inconsistently indented blocks and compact rows into consistent, readable formatting; kept every field, season, match result, statistic and original key order unchanged.
- Added a section reference guide to `README.md`. No changes to website logic, appearance or player data values.

## 2026-10-17 — Vasi awards and Jordan boot overview verification

- Reconfirmed Vasi's career overview awards: 2025–26 (0 POTM / 9 MOTM), 2026–27 (2 / 11), 2027–28 (2 / 12), completed totals (4 / 32). The 2028–29 award counts are still unknown.
- Reconfirmed Jordan Vale's boot brand as Nike on the overview infobox.
- Normalized season-key dashes when looking up career awards, protecting against mismatched `2025-26` and `2025–26` data.
- Bumped `index.html` versions for Vasi's data, Jordan's data and the page renderer to avoid clients keeping stale cached JavaScript.
- Added an overview rendering regression check for all three characters to prevent the blank-awards/old-boot issue from recurring. No match results, season totals or Head to Head records changed.

## 2026-10-17 — Head to Head fixture audit

- Audited Rens, Jordan and Vasi against every scored fixture in their supplied season archives, including pre-season, domestic cups, European competitions and national-team matches.
- Fixed club Champions League qualifiers being classified as international: Rens's 2027–28 Fenerbahçe 3–4 PEC Zwolle result now contributes to his opponent record and appears as a win on the season page.
- Standardized Brighton's represented-team label to Brighton & Hove; also mapped FC Schalke 04 to the existing Schalke 04 flag and name.
- Preserved deduplication of overlapping World Cup/Euros match results between adjacent season pages and exclusion of unrelated neutral-tournament fixtures. Did not modify any recorded scores or invent missing fixtures.
- Source-data note: Rens's 2029–30 Premier League results include two identical Newcastle United 0–0 Brighton & Hove entries (with three Newcastle fixtures and one Manchester United fixture recorded). These entries were left unchanged pending confirmation of the correct result; H2H continues to reflect the supplied archive.

## 2026-10-16 — Dracula hybrid typography

- Dracula now uses the Wiki/Glass readable UI font (Segoe UI with Arial/Helvetica fallbacks) for paragraphs, statistics, tables, navigation and controls.
- Preserved ProggyForever for page and section headings, the site brand, table heading cells and selected section labels.
- No changes to the other themes, font sizes, player data, or layout.
- Bumped the CSS URL version to ensure browsers load the updated stylesheet.

# Changelog

## Jordan Vale boot brand

- Updated Jordan Vale's profile boot brand from New Balance to Nike.
- Updated the versioned Jordan data script reference to avoid stale browser caches.

## Overview career stats: club column, awards and totals

- The Club column is now shown **first on every character's overview table**, even when every season is with the same club.
- Matched table headings and ordering across Rens, Jordan and Vasi, including Player of the Month and Man of the Match.
- Recorded the newly supplied season award counts for Rens (2025–26 through 2034–35) and Jordan (2025–26 through 2027–28).
- Added per-club totals and multi-club grand totals, calculated from completed seasons. Current in-progress statistics remain on their own rows but are excluded from the completed totals.
- Included the supplied future placeholder rows for Rens (PEC Zwolle and Dortmund) and Jordan (2029–30 Bristol City), without creating new playable seasons or changing existing season pages or fixtures.
- Adjusted Rens's 2030–31 role to CAM to match the newly supplied overview table.
- Retained Vasi's existing monthly/match award figures and all three characters' recorded live-season statistics.


This file summarizes the major changes made to the FC26 Career Wiki during the development conversation.

It is a reconstructed project history rather than a Git commit log, so it intentionally does not invent version numbers or exact release tags that were not created in Git.

## Career-overview table consistency

- Standardized the career-statistics table on Rens, Jordan and Vasi overview pages.
- Player of the Month and Player of the Match columns now appear for all three.
- Updated later: the Club column now appears for every character, regardless of club changes.
- Award totals live in per-character `careerAwards` maps; missing counts display `—` instead of being assumed to be zero.
- Preserved Vasi's supplied award counts and removed her duplicate career-statistics row/column definitions.
- Kept the original season stats data format, season pages and Stats charts unchanged.
- Added horizontal scrolling to keep wide career tables usable on smaller screens.

## Definitions and app.js cleanup

- Added `data/definitions.js` for shared team flags and canonical team-name overrides.
- Removed team flag maps, team aliases and Vasi-specific flag patches from `app.js`.
- Moved each character's international focal team, squad focus name and home-page crest into that character's data file.
- Moved squad-player nationality flag lookups into the relevant character data files.
- Moved Jordan's manually supplied Timeline cup-final records into `data/jordan.js`.
- Removed the hard-coded character route map; the character selector now routes directly from the shared `DATA` keys.
- Replaced two hard-coded long squad-name exceptions with generic name-length handling.
- Kept `app.js` focused on rendering, routing, calculations, charts, Timeline, H2H and table behaviour.

## Timeline league movement

- Added promoted and relegated teams to Timeline season cards where consecutive supplied tables exist for the same league.
- Promotion/relegation is derived by comparing team membership between consecutive supplied league tables rather than guessing league rules.
- Team aliases are normalized before comparison so spelling/name variants do not create false movements.
- When a following table for the same league is unavailable, the Timeline explicitly says the movement cannot be derived.

### Timeline league movement refinement

- Changed Timeline league movement to describe the season being shown.
- **Entered** now means teams present in the current season that were absent from the previous supplied table for the same league.
- If there is no previous supplied table for that league, Entered is shown as **Unknown**.
- **Relegated** now uses the current season's defined direct relegation places instead of looking forward to the following season.
- In-progress seasons do not show final relegated teams.
- This allows a club to appear in both Entered and Relegated if it was promoted and immediately relegated in the same season.


### Jordan 2026–27 league-entry baseline

- Added a Jordan-specific real-world 2025–26 Premier League membership baseline for the 2026–27 Timeline.
- The Timeline can now derive 2026–27 **Entered** clubs even though Jordan's preceding career season was in the EFL Championship.
- Compared with the real-world 2025–26 Premier League field, Jordan's 2026–27 save table adds Bristol City, Ipswich and Southampton.
- The baseline is stored in `data/jordan.js`; `app.js` remains generic and only knows how to consume an optional baseline.


### Jordan 2026–27 entry alias fix

- Fixed shared team-name aliases used by Timeline league-entry comparisons.
- Normalized `Tottenham Hotspur` / `Tottenham Hotspurs`, `West Ham United` / `West Ham`, and `Wolverhampton Wanderers` / `Wolves`.
- Jordan's 2026–27 **Entered** list now resolves to Bristol City, Ipswich and Southampton only.


### Home crest, Vasi flags and Timeline league movement

- Replaced Jordan Vale's broken Bristol City home-page crest URL with a working Bristol City crest source.
- Added missing Vasi squad flags: Giulia Dragoni 🇮🇹, Rosalía Domínguez 🇪🇸 and Martine Trollsas Fenger 🇳🇴.
- Timeline league movement is now shown only for the Premier League and Bundesliga.
- Eredivisie and Liga F Timeline cards no longer render a league-movement section because those in-game league systems do not produce reliable promotion/relegation data for this archive.


### Vasi 2026–27 final season

- Finalized Vasi's 2026–27 FC Barcelona Femení season.
- Updated her season total to 42 appearances, 53 goals, 7 assists and 15 clean sheets.
- Updated Barcelona's Liga F record to 1st with 73 points after 30 matches.
- Added the complete supplied Liga F fixture list and final table.
- Replaced the interim 2026–27 squad sheet with the final supplied player totals.
- Added Ana Sampaio to the supplied squad sheet; no nationality flag was added because none was supplied.
- Added the full UWCL league phase, knockout results and 4–1 final win over Chelsea.
- Updated Vasi's Barcelona career aggregate to 75 appearances and 91 goals.
- Added 2026–27 Liga F and UWCL honours.
- Timeline, Head to Head and Stats now derive from the finalized season data.

### Vasi overview career statistics

- Updated Vasi's 2025–26 average rating to 7.6.
- Updated Vasi's 2026–27 average rating to 7.1.
- Added Player of the Month and Man of the Match columns to Vasi's overview career-statistics table.
- 2025–26: 0 Player of the Month awards and 9 Man of the Match awards.
- 2026–27: 2 Player of the Month awards and 11 Man of the Match awards.
- Kept the site's internal season-stat schema unchanged so season pages, Stats charts and navigation continue to work normally.


### Timeline European cup finals and Vasi flag

- Timeline cup finals now also use supplied UEFA round-break data to identify European finals when the fixture itself is not prefixed with `F —`.
- This allows Rens's supplied European club finals to appear in the Timeline cup section alongside domestic cup finals.
- Added the Portuguese flag for Ana Sampaio in Vasi's 2026–27 Barcelona squad.


### Rens 2033–34 international data correction

- Re-evaluated Rens's 2033–34 international data from the supplied source.
- Separated eight Netherlands international friendlies that had accidentally been appended to the World Cup fixture list.
- Kept the 2033–34 World Cup data through the Round of 16 only.
- Moved the World Cup quarter-finals onward into 2034–35, matching the supplied note that the tournament continued in that season.
- Added World Cup round labels for the split across 2033–34 and 2034–35.
- Removed the duplicated 2034–35 World Cup group table; the group-stage table belongs with 2033–34.
- Head to Head now derives from the corrected, non-duplicated international fixtures.


### Vasi 2027–28 in-progress season

- Added Vasi's 2027–28 FC Barcelona Femení season as in progress.
- Added supplied pre-season fixtures and Champions Trophy table, displayed as Pre-season friendlies.
- Added the opening Liga F result and preserved the supplied placeholder league table exactly, including blank statistic cells and zero points.
- Added the current 2027–28 Barcelona squad sheet.
- Added an empty UEFA Women's Champions League placeholder that displays on the season page as “No fixtures recorded yet.”
- Updated Vasi's running Barcelona career aggregate to 79 appearances and 93 goals.
- Added the 2027–28 overview/career-stat row using only supplied values; rating and monthly/match awards remain unknown.
- Timeline squad movement now derives the 2026–27 to 2027–28 changes automatically.
- Head to Head now includes the four supplied 2027–28 Barcelona fixtures and ignores the empty UWCL placeholder.


### Rens international tournament consolidation

- Consolidated the full **Euros 2032** tournament onto the 2032–33 season page instead of splitting it across 2031–32 and 2032–33.
- Separated the international friendlies that had been mixed into the Euros fixture lists.
- Consolidated the full **World Cup 2034** tournament onto the 2034–35 season page instead of splitting it across 2033–34 and 2034–35.
- Kept 2033–34 Netherlands friendlies as their own International Friendlies section.
- Moved the supplied Euros and World Cup group-table data to the same season as the consolidated tournaments.
- Updated tournament round labels and kept Head to Head counting each match once.


### Jordan Vale boot update

- Updated Jordan Vale's preferred boot brand from Nike to New Balance.


### Timeline league labels

- Added the league name directly beneath the club heading on every Timeline season card.
- Timeline cards now make the season's league immediately visible before the league top-five section.


### Jordan Vale 2028–29 in-progress update

- Updated Jordan's 2028–29 Bristol City season from the latest supplied sheet.
- Jordan now has 22 appearances and 8 clean sheets in the in-progress season.
- Updated his Bristol City career aggregate to 171 appearances and 1 goal.
- Added the latest Premier League result against Fulham.
- Updated the full 2028–29 Bristol City squad sheet and pre-season table.
- Preserved the supplied placeholder Premier League table values exactly.
- Kept the 2028–29 Europa League standings excluded because the supplied rows are placeholders.
- Added an empty FA Cup placeholder.
- Head to Head and Timeline now derive from the updated fixtures and roster.


### Vasi 2027–28 in-progress update

- Updated the latest 2027–28 snapshot to 27 appearances, 25 goals, 5 assists and 3 clean sheets.
- Liga F now contains the supplied 18 completed fixtures and current table, with Barcelona 2nd on 38 points.
- Added all six completed UEFA Women's Champions League league-phase fixtures and the supplied 18-team table.
- Updated the current Barcelona squad/player sheet.
- Left the supplied future UWCL playoff, quarter-final, semi-final and final slots without invented scores.
- Head to Head and Timeline derive from the updated completed fixtures and current squad list.


### Vasi 2027–28 finalized

- Marked 2027–28 as complete.
- Final season totals: 44 appearances, 42 goals, 9 assists and 11 clean sheets, average rating 7.1.
- Barcelona finished 1st in Liga F with 64 points and won the UEFA Women's Champions League.
- Added the complete final Liga F fixture list, final standings and final squad sheet.
- Added the completed UWCL knockout rounds through the 3–2 final win over VfL Wolfsburg.
- Updated Vasi's career aggregate to 119 appearances and 133 goals.
- Extended Barcelona career to 2036 and added future Gotham FC career entry for 2036–2040.
- Updated the Overview career statistics table and honours, including the Liga F Goalscoring Record.
- Timeline and Head to Head now derive from the completed season.


### Character portrait placeholders

- Added a consistent portrait area to each character Overview infobox.
- The temporary portrait space uses a neutral grey placeholder until character images are supplied.
- The placeholder keeps a fixed 4:5 portrait ratio and adapts to Wiki, Dracula and Glass themes.


### Character profile portraits

- Added supplied profile portraits for Rens, Jordan and Vasi.
- Portrait files live under `assets/portraits/`.
- Each character owns its portrait path in its own data file.
- The Overview infobox now renders the portrait image and keeps the grey placeholder as a fallback.


### Vasi character-select artwork

- Added the supplied Vasi collage as her character-select tile background.
- The artwork fills the full tile in Wiki, Dracula and Glass themes.
- Other character tiles continue using the existing club-crest fallback.
- Vasi's profile portrait remains unchanged.


### Character biography refresh

- Rewrote the Overview biographies for Rens, Jordan and Vasi using the career information already recorded across the site.
- Bios now summarise nationality, position, recorded seasons, club path, major honours and international careers.
- Future career entries are described as supplied career paths rather than completed history.
- No unsupported statistics or honours were added.


### Wikipedia-style biography leads

- Reworked the Rens, Jordan and Vasi Overview introductions into three-paragraph encyclopedia-style leads.
- Removed references to planned or future transfers from the biography prose.
- Leads now focus on current club, nationality, position, career development, established honours and completed international achievements.
- The Overview renderer now supports multiple lead paragraphs while retaining compatibility with single-paragraph bios.


### Biography story details

- Added Rens's motivation for leaving Bayern after two dominant seasons.
- Expanded Jordan's 2027–28 FA Cup final into the key extra-time and penalty-shootout sequence.
- Added the final-day story behind Vasi breaking the Liga F single-season goalscoring record in her second senior season.
- Kept the additions in a neutral, Wikipedia-style biographical tone.


### Rens biography details

- Added the significance of No. 46 as Rens's personal shirt number and his refusal to wear the traditional No. 10.
- Added context around his delayed Netherlands call-up, including the competition for midfield places and his development from a raw prospect into a senior international in 2031.


### Image-based country flags

- Added the uploaded 32px flag pack under `assets/flags/`.
- Replaced visible country and subdivision emoji flags with PNG images at render time.
- This avoids Chromium/Vivaldi displaying regional-indicator country codes such as `NL` or `GR`.
- The image renderer applies across profiles, home cards, fixtures, squad lists, standings, Timeline and Head to Head.
- Native character selector options now use names without emoji because browser-native `<option>` elements do not reliably support inline images.


### Larger borderless flags

- Replaced the previous flag assets with the supplied 64px set.
- Increased normal flag display size to 30px wide.
- Increased fixture, table and squad flags to 28px wide.
- Increased home-card, navigation and profile flags to 36px wide.
- Removed all flag borders, rounded corners, outlines and box shadows.


### Vasi 2028–29 update

- Added Vasi's in-progress 2028–29 FC Barcelona Femení season.
- Added all supplied pre-season, Liga F and UEFA Women's Champions League fixtures and tables.
- Updated Vasi to 24 appearances, 22 goals, 0 assists and 11 clean sheets for the season.
- Updated her Barcelona career aggregate to 143 appearances and 155 goals.
- Added the 2028–29 squad so Timeline derives same-club squad movement automatically.
- Added confirmed nationalities for Océane Deslandes and Julie Dufour (France), and Teagan Cook (Australia).
- Head to Head now includes the newly supplied Barcelona fixtures automatically.
- No missing knockout results or unsupplied ratings/awards were fabricated.


## Current development state

### Project structure

- Refactored the site into a readable static JavaScript project.
- Split character-specific data into individual files:
  - `data/rens.js`
  - `data/jordan.js`
  - `data/vasi.js`
- Added `data/base.js` for the shared data containers.
- Merged each character's profile data, fixtures, season tables, squad sheets, preseason standings and competition standings into that character's own file.
- Removed the need for the old monolithic `data.js`, `season_tables.js` and `competition_tables.js` layout.
- Replaced `README.txt` with `README.md`.
- Added this `CHANGELOG.md`.

### Readability and learning refactor

- Reformatted `app.js` from dense JavaScript into readable, consistently indented code.
- Replaced one-letter variable names with descriptive names.
- Standardized all four players to the same data-storage pattern.
- Reformatted the old season and competition table files before they were later merged into per-player data files.
- Reformatted `styles.css` into a readable teaching-friendly layout with one declaration per line.
- Preserved functionality while prioritizing clear code that can be studied by a learner.
- Kept JavaScript data objects instead of converting the project to JSON, avoiding unnecessary asynchronous loading and keeping the project easy to run as a static site.

## Stats and visualisations

- Added a **Stats** page for all four characters.
- Added a Stats link to each character's career navigation.
- Added graphs for:
  - goals per season
  - assists per season
  - clean sheets / CLS per season
  - league finishing position by season
- Added a source-data table beneath the charts.
- Implemented charts with local SVG/JavaScript rather than requiring an external charting dependency.
- Charts use the existing recorded season data and do not invent missing values.

## Vasiliki Dimitriou

### 2026–27 season

- Added Vasi's 2026–27 FC Barcelona Femení season as **in progress**.
- Added supplied preseason friendlies:
  - FC Barcelona 3–0 Leverkusen
  - Gotham FC 1–3 FC Barcelona
  - FC Barcelona 2–0 West Ham
- Added the supplied preseason standings table.
- Added the current Liga F fixtures.
- Added the current Liga F standings.
- Added the 2026–27 Barcelona squad/player sheet.
- Added current UEFA Women's Champions League fixtures and league-phase standings.
- Added 2026–27 data to Vasi's Timeline and Head to Head calculations.
- Fixed an early nesting issue that prevented the friendly table, player sheet and Liga F table from rendering.
- Marked 2026–27 as a live/in-progress season in navigation.

### Profile and career

- Changed Vasi's preferred boot brand to **Nike**.
- Simplified her planned club career to:
  - 2025–2035 — FC Barcelona Femení
- Removed previously planned future spells at OL Lyonnes, Manchester City Women and Gotham FC because those destinations are now undecided.
- Updated her recorded Barcelona career totals as new season data was added.
- Preserved Greece international data separately.

### Honours

- Added:
  - Liga F Championship: 2025–26 🏆
  - UEFA Women's Champions League: 2025–26 🏆
  - Golden Boot: 2026

### 2026–27 squad flags

Added supplied nationalities for new Barcelona players:

- Teresa Moyano — 🇪🇸 Spain
- Lauren Leal — 🇧🇷 Brazil
- Rasheedat Ajibade — 🇳🇬 Nigeria

### 2025–26 final season update

- Finalized Vasi's 2025–26 season rather than leaving it in progress.
- Updated season totals to:
  - 33 appearances
  - 38 goals
  - 5 assists
  - 10 clean sheets
- Finalized the full 30-match Liga F fixture list.
- Finalized the Liga F standings with Barcelona champions on 73 points.
- Updated the final Barcelona squad sheet with the supplied player totals.
- Finalized the preseason friendlies and preseason standings.
- Finalized the UEFA Women's Champions League league phase and knockout rounds.
- Recorded Barcelona's 4–0 UWCL final win over Paris FC.
- Preserved source-supplied quirks in standings rather than silently correcting them.

## Timeline

- Added a dedicated Timeline route for each character.
- Timeline cards show:
  - club and season
  - top five league positions
  - recorded cup finals
  - joined players
  - departed players
- Squad changes are derived by comparing consecutive supplied squad lists.
- Squad comparison resets when a character changes club.
- Added links from Timeline cards to individual season pages.
- Added no-data messaging where league tables, squad sheets or finals are unavailable.
- Added support for in-progress seasons.
- Added Vasi's season and squad movement information.

## Head to Head

- Added a dedicated **Head to Head** page.
- Aggregates recorded matches from the career player's perspective.
- Added columns for:
  - opponent
  - represented team
  - match type
  - played
  - wins
  - draws
  - losses
  - goals for
  - goals against
  - goal difference
  - win percentage
- Added sortable tables.
- Added fixture alias normalization for club names.
- Penalty shootouts determine match outcome while regulation goals remain the GF/GA values.
- Excluded unrelated neutral tournament matches from player H2H records.
- Deduplicated overlapping international fixture records.
- Fixed Vasi's preseason/friendly handling so club friendlies are not confused with international friendlies.

## Season pages

- Reworked season pages into a database/dashboard-style layout.
- Added:
  - season hero section
  - club and flag
  - season status
  - league name
  - player summary
  - KPI strip
  - jump navigation
  - league table
  - squad/player sheet
  - competition fixture sections
- Positioned fixtures on the left and standings on the right where both exist.
- Added exact-width handling for fixtures-only Wiki-layout panels.
- Added a league record summary.
- Added competition round separators.
- Added UEFA knockout-round headings.
- Renamed displayed "Champions Trophy" sections to **Pre-season friendlies**.
- Added responsive handling for wide tables.
- Added winner shading to fixture team cells.
- Added green / amber / red W-D-L result markers.
- Added pale-yellow focus rows for the career player's club and player.
- Kept focus-row text readable in Dracula theme.
- Later removed general table-row hover highlighting at the user's request.
- Kept sortable-header hover as an interaction cue.

## League, competition and squad data

- Added full season standings and squad sheets across supplied careers.
- Added separate competition standings where supplied, including European league phases and preseason tournaments.
- Added supplied player nationality flags to squad tables.
- Established a rule not to invent missing player nationalities.
- Avoided white-placeholder flags where data was uncertain.
- Preserved user-supplied numbers even when they looked arithmetically unusual rather than silently changing source data.

## Career overview pages

- Simplified player overview pages to focus on:
  - infobox
  - title and introduction
  - club career
  - international career
  - career statistics
  - honours
- Removed old season-archive and promotional sections from overview pages.
- Kept season navigation in the dedicated career navigator.
- Standardized character display names.
- Added boot-brand information.

## Career navigation and header

- Added a centered character selector to the header.
- Added the theme selector on the right.
- Character navigation now includes:
  - Overview
  - Timeline
  - Stats
  - Head to Head
  - seasons grouped by club
- In-progress seasons display a **Live** marker.
- Static player shortcut links are hidden away from the home page.

## Home page

- Built a four-character 2×2 home grid.
- Added:
  - Rens Adisea
  - Jordan Vale
  - Vasi Dimitriou
- Added player flags.
- Added blurred/semi-transparent current-team crest watermarks.
- Added responsive one-column behaviour on smaller screens.
- Removed the old About section.

## Themes

### Wiki

- Preserved the Wikipedia-inspired light layout.
- Tuned table widths and season-page layouts.

### Dracula

- Added a Dracula-inspired dark theme.
- Added Proggy-style monospace typography through a remote font face with fallbacks.
- Increased general Dracula text sizing for readability.
- Kept highlighted table rows readable with dark text on pale-yellow focus backgrounds.

### Glass

- Added a glassmorphism theme.
- Added translucent panels and background treatment.
- Preserved readable text and table styling across the site.

### Theme system

- Reduced selectable themes to:
  - Wiki
  - Dracula
  - Glass
- Kept legacy internal terminal classes where they are used by existing Dracula layout rules.
- Added theme persistence through local storage.

## Character data

### Rens Adisea

- Added and maintained his PEC Zwolle, Brighton & Hove Albion, FC Bayern München and Borussia Dortmund career.
- Added Netherlands international data.
- Added season statistics, honours, competition records, league tables and squad sheets.
- Added European competition rounds and tournament results.
- Added career Timeline, H2H and Stats support.

### Jordan Vale

- Added and maintained his Bristol City career with future Manchester United and Borussia Dortmund entries.
- Added England international data.
- Added goalkeeper season statistics and clean sheets.
- Added supplied domestic and international fixtures.
- Excluded the 2028–29 Europa standings where requested.
- Removed Harry Cornick from the 2027–28 squad when corrected.
- Added Timeline, H2H and Stats support.


- Added Hull City loan career data with later PSV, Monaco and Köln career plans.
- Added Norway international profile data.
- Added supplied Hull season statistics, fixtures, league standings and squad sheet.
- Preserved the distinction between overview aggregate totals and supplied season-sheet totals.
- Added Timeline, H2H and Stats support.

### Vasi Dimitriou

- Added Vasi as the fourth playable career character.
- Added Barcelona and Greece profile/career data.
- Added full season tables, fixtures, squad sheets, UWCL records, honours, H2H, Timeline and Stats support.
- Continued updating Vasi with the most recent supplied season sheets.

## Flags and aliases

- Added extensive team and country flag mappings.
- Added explicit mappings for clubs such as:
  - OL Lyonnes
  - FC Rosengård
  - Glasgow City FC
  - FC Zürich
- Added UK subdivision flags where appropriate.
- Added club-name aliases used by H2H and fixture matching.
- Established the project rule: do not guess missing flags when uncertain.

## Table behaviour

- Added sortable column headers to site tables.
- Added numeric and text-aware sorting.
- Added rank refresh for sorted H2H tables.
- Standardized focus styling.
- Removed general row-hover effects across Wiki, Dracula and Glass themes.

## Data handling rules established during development

- User-supplied final data supersedes earlier intermediate values.
- Do not invent blank or future career statistics.
- Do not invent missing nationalities or flags.
- Preserve source-provided standings values even if a calculated GD looks unusual.
- Penalty shootouts determine W/D/L outcome, while GF/GA use regulation scores.
- Exclude unrelated neutral tournament fixtures from H2H.
- Treat international and club friendlies as separate competition types.
- Display "Champions Trophy" as "Pre-season friendlies".
- Only mark a cup finalist/winner when supported by supplied data.

## Git and deployment preparation

- Prepared the site for GitHub Pages as a static website.
- Kept routes hash-based so pages work under GitHub Pages without server-side routing.
- Discussed using:
  - `dev` for active development
  - `main` for the stable/live site
- Established a workflow of merging `dev` into `main` before publishing.
- Discussed descriptive Git commit messages and Git version tags.
- Discussed optional custom-domain hosting through GitHub Pages.

## Documentation

- Added a learning guide explaining how the FC26 site was built and how its HTML, CSS, JavaScript and Python tooling fit together.
- Added a separate handover document for adapting the approach to an F1 Manager project.
- Replaced the original text README with Markdown documentation.
- Refactored the source specifically so future changes remain readable for learning purposes.

### Character roster update

- Reduced the site to three career profiles and removed the retired fourth character's data/routes.
- Character roster is now Rens Adisea, Jordan Vale and Vasiliki Dimitriou.
- Updated Jordan Vale career path to Bristol City (2025–2030), Manchester United (2030–2036) and PSV (2036–2040).


### Dracula theme size/layout parity

- Matched Dracula text and heading sizes and line heights to Wiki and Glass (16px body; 32/24/19px headings).
- Removed terminal-only full-width page/table overrides and 1.5x career-navigation scaling from Dracula.
- Matched fixture-only competition panel width and standings layout to Wiki/Glass.
- Kept Dracula palette and ProggyForever headings/table headers, with Segoe UI for normal text.
