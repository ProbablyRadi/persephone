# Changelog

This file summarizes the major changes made to the FC26 Career Wiki during the development conversation.

It is a reconstructed project history rather than a Git commit log, so it intentionally does not invent version numbers or exact release tags that were not created in Git.

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


## Current development state

### Project structure

- Refactored the site into a readable static JavaScript project.
- Split character-specific data into individual files:
  - `data/rens.js`
  - `data/jordan.js`
  - `data/espen.js`
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
  - Espen Sæheim
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

### Espen Sæheim

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
