## 2026-10-25 — More readable season comparisons
- Defaulted each graph to the character's clubs, with other teams reduced to faint background lines and their dots/labels hidden.
- Replaced the single-team dropdown with accessible checkboxes for multi-team selection, selected-team chips, Show all teams and Character's clubs reset controls. Selected paths are painted above the background.
- Renamed the bottom row Outside league and retained only entry/exit connections, removing horizontal lines spanning absent seasons. Added subtle green-to-amber table shading with numeric finishes retained and sticky team names.
- Verified default focus, multi-selection, all/reset controls, table shading, SVG geometry and no page-wide overflow at desktop/phone widths in all themes. Added regression coverage for disconnected outside-league segments.

## 2026-10-25 — Promotion entry points on comparison graphs
- New entrants rise from the Relegated/outside-league row in the immediately preceding recorded season, instead of appearing as isolated points. This includes Burnley entering Jordan's Premier League table in 2029–30.
- Kept the underlying finishing-position records unchanged and avoided connecting across unrecorded seasons. Added checks for Burnley's two connected points, their vertical direction and its single real finishing position.

## 2026-10-25 — Solid club lines and secondary-colour points
- Changed comparison lines to solid primary club colours and data-point circles to secondary colours with primary-colour borders.
- Updated table swatches to show the same solid-line/circle combination. Retained line outlines for contrast and refreshed CSS/script cache versions.

## 2026-10-25 — Club colours and relegation on comparison graphs
- Added an editable `data/team-colours.js` palette catalog. Graph lines, points and table swatches use representative main/accent club colours; unmapped clubs keep a name-based fallback across graphs.
- Added accent strokes and theme-aware outlines so white/dark club colours remain visible in Wiki, Dracula and Glass. Kept the existing team-highlighting selector.
- Added a Relegated row below the league positions when departures are supported by the preceding season's relegation-place finish and next season's complete table. Teams remain on that row while absent and return to their recorded finish when promoted back.
- Kept unexplained absences and unrecorded-season gaps separate from confirmed relegations. Original positions and football data remain unchanged.
- Extended tests for palette aliases, relegation, promotion back, missing-season handling and unchanged ranks; refreshed the comparison asset cache versions.

## 2026-10-25 — Season comparison pages
- Added Season comparisons below Head to Head for each character, with separate domestic league graphs showing all recorded teams' final positions over completed seasons.
- Added team/character-club highlighting, bold career-club lines, position labels and expandable exact-position tables. First place is at the top; missing-team seasons break the lines rather than inventing a rank.
- Excluded live seasons, including Vasi's provisional ranked table. Rens has three Eredivisie, five Premier League and two Bundesliga seasons; Jordan has one Championship and four Premier League seasons; Vasi has four Liga F seasons.
- Added `js/comparisons.js`, route/navigation wiring, responsive styling and cache-version updates. Replaced the old absent-feature Competition Performance test with tests for the requested domestic season comparisons.
- Verified all plotted ranks against source tables and checked the three pages at desktop/phone widths in all three themes, including highlighting, SVG geometry and page overflow. Existing regression results are 13 passes and two pre-existing failures concerning international tournament grouping and Jordan's historical England caps.

## 2026-10-25 — Restore home-page tile images
- Fixed home-page background URLs resolving relative to the relocated stylesheet instead of the HTML page. Tile image and crest URLs now resolve from the page before being passed to CSS variables.
- Updated the gallery script cache version and added regression checks for subfolder hosting and direct-file paths.
- Verified actual image decoding for all three tiles in all themes at phone and desktop widths, through root hosting, subfolder hosting and direct-file browsing.

## 2026-10-25 — Interface file structure refactor
- Reduced `app.js` from 1,694 to 123 lines by moving reusable helpers and renderers into eight focused `js/` files. Kept ordinary scripts and direct `index.html` support.
- Split the 2,684-line stylesheet into a 967-line base plus appearance, page and mobile files, preserving the original cascade. Corrected relative asset URLs in the new folders.
- Shared competition standings rows/headers, season fixture panels and chart metric extraction; removed 10 CSS declarations superseded by identical selectors in the same conditions.
- Expanded dense season/statistics markup for readability. Total source size remains similar; the primary improvement is clearer responsibilities rather than compressed code.
- Updated regression tests to read the loaded source files from `index.html` through one shared helper. Results remain 12 passing tests and the same three pre-existing failures.
- Compared all 36 routes at 390px and 1280px in all three themes: 216 matching before/after DOM and computed-style snapshots with no JavaScript exceptions.
- Documented the loading order, file responsibilities and deployment requirements. Character data stays in the existing numbered character files.

## 2026-10-25 — Mobile browsing improvements
- Added a collapsible career menu on phones, restoring access to Overview, Timeline, Stats, Head to Head and all seasons.
- Reworked the phone header, spacing and touch targets; stacked home tiles and season panels; made the timeline vertical and gallery captions readable below photos.
- Fixed the broad mobile aside rule that hid competition standings. Wide data tables and charts now scroll within their own regions.
- Verified 11 routes in Wiki, Dracula and Glass at 320, 390, 430, 760 and 1280px, with no page-wide overflow or runtime errors. Confirmed mobile menu navigation and reviewed rendered phone screenshots.
- Updated CSS/JS cache versions and the home-page test. Three unrelated regression tests also fail against the original code: Competition Performance, international tournament grouping and Jordan's older England caps assertion.

## 2026-10-24 — Stylesheet consolidation
- Refactored the existing `styles.css` from 4,640 to 2,516 lines (~46% fewer), and from 94,769 to 75,903 bytes (~20% smaller), while retaining readable rules and the original cascade order.
- Removed 119 superseded CSS declarations, unused non-Dracula Terminal-only rules and malformed escaped-newline selector fragments while retaining their valid selectors.
- Verified parity for 2,128 active selector/property winners and passed all 14 JavaScript regression tests. Browsers in this environment block visual page navigation, so no live screenshot comparison was possible.
- Updated the stylesheet cache version in `index.html` without changing any player data or gallery images.

## 2026-10-24 — Vasi home-page tile background
- Replaced Vasi's home-page character-select background with the newly provided screenshot (Vasi smiling on the pitch).
- Kept the three-character home layout and standalone 17-photo gallery unchanged.
- Gave the new image a distinct filename and bumped the Vasi script cache version to prevent stale backgrounds after deployment.
- Updated gallery regression test expectations to cover all 17 already-added photos.

## 2026-10-24 — Expanded photo gallery
- Added 10 more user-provided photos to the standalone carousel page, expanding the gallery from 7 images to 17.
- Included new football scenes for Vasi, Rens / the Netherlands, Jordan Vale / Bristol City, England and additional trophy-celebration shots.
- Stored the new files locally in `assets/gallery/` and added editable titles, alt text and captions in `data/gallery.js` without changing any player statistics or page layouts.

## 2026-10-24 — Vasi 2029–30 mid-season update
- Added 16 Liga F results, updated the 16-club live table (Barcelona 1st, 40 points), and all six UEFA Women’s Champions League league-phase results and 18-club table (Barcelona 1st, 18 points).
- Updated Barcelona’s 27-player squad including Vasi (25 apps, 28 goals, 0 assists, 12 CLS).
- Recomputed Vasi Head to Head; retained the season as in progress and left completed-season totals unchanged.

## 2026-10-24 — Separate photo gallery page
- Restored the home page to three large player tiles, with Vasi bottom-left and a compact Photo gallery link aligned bottom-right beneath the grid.
- Moved the full seven-photo carousel to its own `#gallery` page, with a back link to the home page; retained the original images and captions.
- Preserved arrow/dot/keyboard/swipe controls, improved image fit for the larger gallery viewer, and kept sidebar hidden on both home and gallery pages.
- Updated browser asset cache versions and navigation/gallery regression tests without changing player data.

## 2026-10-24 — Home-page photo gallery populated
- Added seven user-provided photos to the existing home-page Gallery carousel: Rens (1), Vasi (4) and Jordan Vale (2), in upload order.
- Added short descriptive titles, alt text and editable captions in `data/gallery.js` without inventing match details.
- Reused existing carousel controls and 2×2 layout; updated the gallery browser cache version and gallery regression checks.
- Kept all player profiles, fixtures, career statistics, flags and themes unchanged.

## 2026-10-24 — Home-page gallery tile
- Returned Vasi's character-select tile to the lower-left position and added a fourth Gallery tile in the lower-right, keeping the 2×2 desktop layout at roughly 75% width.
- Added an empty gallery with captions, previous/next arrows, dot controls, keyboard navigation and touch swipes for future user-supplied photos and descriptions.
- Created `data/gallery.js` and `assets/gallery/` for easy photo updates without touching character data. No sample photos were added.
- Updated browser cache versions and added gallery-specific tests; kept other data and character profiles unchanged.

## 2026-10-24 — Vasi Career Overview award totals
- Confirmed 2028–29 average rating **6.9**, Player of the Month **2**, and Player of the Match **10**, while retaining 43 appearances, 37 goals, 1 assist and 15 clean sheets.
- Career Overview Barcelona completed-season average rating **7.2**, with **6 POTM** and **42 MOTM** across 2025–26 through 2028–29.
- 2029–30 remains in progress with no rating or award totals supplied; excluded from completed-season totals. Updated Vasi data cache token and regression tests.

## 2026-10-24 — Home selection and Vasi nationality flags
- Confirmed Steinunn Einarsdóttir 🇮🇸, Alizée Coulon 🇫🇷 and Teagan McNamara 🇦🇺 in Vasi’s 2029–30 squad using existing PNG assets.
- Hid the left navigation sidebar on the home screen only, centred and enlarged character-select images to approximately 75% of desktop width, and centred the last tile.
- “Choose character” now returns to the home page from any character/season. Updated browser asset versions.

## 2026-10-24 — Vasi 2029–30 begins
- Added Vasi’s live 2029–30 Barcelona season: Champions Trophy draws against Strasbourg and Leicester City, 3–0 win over KC Current, and 8-team pre-season standings (fourth, 5 points).
- Added 16-club Liga F starting membership table without treating the sheet’s starting order as confirmed league positions; no league fixtures have been recorded.
- Updated the 27-player Barcelona squad with all reported appearances, goals, assists and clean sheets; Vasi has 3 appearances, 3 goals, 0 assists and 2 clean sheets so far.
- Added recognised Nigeria and England flags for Chiamaka Nnadozi and Lauren James, and the USA flag for KC Current. Left Steinunn Einarsdóttir, Alizée Coulon and Teagan McNamara unflagged pending user confirmation.
- Kept 2028–29 completed and Barcelona’s 162 appearances / 170 goals completed-season infobox record unchanged. In-progress 2029–30 stats are displayed on Career Overview but excluded from completed totals.
- Head to Head now counts 180 played, 126 wins, 27 draws, 18 losses, 38 opponents. Added a new 2029–30 season regression test and refreshed Vasi / definitions browser script versions.
- Corrected a previously duplicated phrase in Vasi’s career biography without changing any results.

## 2026-10-24 — Brighton / Stuttgart flag corrections
- Confirmed Cherif Diouf (Senegal) and Samuele Fabbri (Italy) in Brighton's 2030–31 squad, using the existing local PNG assets.
- Corrected the Champions Trophy standby table's typo `VfG Stuttgart` to `VfB Stuttgart` so its existing Germany flag mapping appears.
- Refreshed Jordan's browser cache token and updated the season regression test. No statistics, fixtures or standings were changed.

## 2026-10-23 — JV Brighton 2030–31 squad and first scored games
- Updated Brighton's 2030–31 squad to the latest 34-player list, recording all supplied appearances, goals, assists and clean sheets (including the new Cherif Diouf, Samuele Fabbri and Tom Watson entries).
- Recorded three Premier League games (Coventry 0–0 Brighton, Brighton 2–0 Ipswich, Manchester City 2–0 Brighton) and Brighton's 3–1 Carabao Cup win away to MK Dons.
- Updated Jordan Vale's in-progress Brighton total to 7 appearances, 0 goals, 0 assists and 3 clean sheets on the career infobox, overview and season page. League opening record is 3 played, 4 points; ranking remains unreported.
- Tom Watson's England nationality is documented by the Premier League; Cherif Diouf and Samuele Fabbri remain unflagged pending confirmation.
- Preserved England's 50 caps/0 goals record, World Cup 2030, all earlier completed seasons and historical totals. Kept the club-switch Timeline without unsupported squad movement.
- Updated browser cache version and regression checks.

## 2026-10-23 — Jordan Vale Brighton nationality confirmations
- Confirmed nine 2030–31 Brighton squad nationalities: Amnay Aït Zekran (Algeria), Lance White (England), Besian Kutleshi (Australia), Josen Escobar (Colombia), Kirk Leitch (Scotland), Nehemiah Oriola (England), Kamari Doyle (England), Maxloren Castro (Peru) and Felipe Chavez (Spain).
- Corrected the duplicate 2030–31 Premier League entry: Fulham replaces the second Wolves listing; the original Wolves entry is retained.
- Confirmed Jordan Vale international career remains 50 caps and **0 goals**.
- Refreshed the `jordan.js` browser cache version.

## 2026-10-23 — Jordan Vale 2030–31 and 2030 World Cup

- Added Brighton & Hove 2030–31 in-progress season: all 3 Champions Trophy fixtures, 8-team pre-season standings, 33-player squad, and 20-club Premier League membership list. The league sheet contains no completed scores; scaffold positions and 38 scheduled games are intentionally not displayed as actual results.
- Added complete 2030 World Cup archive (35 knockout/group fixtures, 12 group tables), with England beating Spain 1–0 in the final and Uruguay third, including the World Cup podium in Jordan's Timeline.
- Updated Jordan international infobox from the user-provided 42 caps/1 goal to the latest supplied 50 caps/0 goals; note that 8 England World Cup games support the possible increase but do not verify individual participation. Prior 1 goal conflicts with the new zero and awaits confirmation.
- Updated England honours: 2030 World Cup winner and Golden Glove; 2026 runner-up and 2028 Euro Golden Glove preserved. Current Brighton number 99 and New Balance boots preserved.
- League movement compares Brighton's Premier League membership with the 2029–30 Premier League table, even though Jordan changed clubs. It identifies Leeds United and Ipswich as new entrants; duplicate Wolves in the new sheet obscures another entrant. No misleading squad joins/leaves for a club switch.
- Unconfirmed Brighton player nationalities are left blank, as is VfG Stuttgart's club flag until the club spelling is confirmed.
- Added `tests/verify-jordan-2030.js` and revised tournament, H2H, overview and timeline regression assertions. 

## 2026-10-23
- Updated Jordan Vale overview: current club Brighton & Hove, shirt number 99, career path adjusted to Manchester United (2029–2030), Brighton & Hove (2030–2035), PSV (2035–2040).

## 2026-10-23 — World Cup podiums in Career Timeline

- Added the World Cup third-place finisher alongside winner and runner-up in the existing Cup finals section of any season with recorded World Cup final and third-place play-off fixtures.
- 2026 (Jordan, 2026–27): Netherlands / England / Spain. 2034 (Rens, 2034–35): Netherlands / Belgium / England.
- Podiums are derived from the supplied match results and round labels; missing third-place results display “Not recorded”. No player data or match results changed.
- Bumped the app renderer browser cache version and added regression coverage.

## 2026-10-23 — Vasi birthplace correction

- Updated Vasiliki Dimitriou’s birthplace from Heraklion to **Arachnes, Greece**, in her profile and biography, as requested.
- Updated the Vasi data cache version and regression checks. All career statistics, fixtures and other player details are unchanged.

## 2026-10-23 — Player profile details

- Updated Jordan Vale’s preferred boot brand from Nike to **New Balance**.
- Corrected Vasiliki Dimitriou’s place of birth from Thessaloniki to **Heraklion, Greece**, including her profile biography.
- Refreshed the browser cache tokens for Jordan and Vasi’s data files and aligned the regression tests with the supplied details. No other player information, matches or statistics changed.

## 2026-10-23 — Jordan Vale career overview refresh

- Updated Manchester United career years to 2029–2031 (48 apps, 0 goals recorded through 2029–30).
- Moved PSV placeholder period to 2031–2037 and replaced Celtic with AS Monaco (2037–2040) in the infobox and career overview.
- Added placeholder rows for all six PSV seasons and all three AS Monaco Ligue 1 seasons, without inventing fixtures, appearances or awards.
- Confirmed Jordan's 2029–30 average rating of 6.5 and zero Player of the Month / Man of the Match awards; preserved Bristol City's four completed seasons, honours, caps and totals.
- Clarified shirt-number history and bumped the Jordan data cache version.

## 2026-10-20 — Vasi 2028–29 Juventus result corrected

- Corrected **Juventus 0–2 FC Barcelona** in both the season summary and full Women’s Champions League fixtures. The fixture had previously been reversed.
- Barcelona’s six league-phase results now reconcile with the supplied UEFA table: **4 wins, 1 draw, 1 loss; 12 GF, 7 GA; 13 points**.
- Recalculated Vasi’s Head to Head: **177 played / 125 wins / 25 draws / 18 losses**. All other fixture results and player statistics are unchanged.

## 2026-10-20 — Vasi 2028–29: Anna Affolter nationality

- Confirmed Anna Affolter (CAM, No. 22) as Swiss, using the existing local Switzerland flag image. No squad statistics or match results changed.

## 2026-10-20 — Vasi 2028–29 final season

- Completed Vasi’s 2028–29 Barcelona season from the supplied final sheet: **43 appearances, 37 goals, 1 assist and 15 clean sheets**. No average rating or POTM/MOTM figures were supplied; those remain unknown rather than being invented.
- Added all **30 Liga F fixtures**, the final **16-team table** (Barcelona champions: **25 W, 3 D, 2 L, 77 GF, 23 GA, 78 pts**) and Barcelona's **fourth consecutive Liga F title** to Honours.
- Added the full 2028–29 **Women's Champions League** knockout bracket and final: Barcelona lost **2–4 (agg) to Paris SG** in the semi-finals, and FC Bayern München beat Paris SG **3–0** in the final. The UWCL league-phase table was preserved from the user's sheet.
- Updated the complete **24-player Barcelona squad**, including Anna Affolter (nationality unreported), with all supplied App/Goals/Assists/CLS figures. The Timeline now reflects the season's cup result, final standings and squad movements.
- Updated Barcelona's club career infobox to **162 appearances / 170 goals** from the four completed seasons. Head to Head now reads **177 played / 124 W / 25 D / 19 L**, preserving the aggregate-only-tie accounting rule.
- Added `tests/verify-vasi-2028.js` and updated the Head to Head and Overview regression expectations. Existing Rens/Jordan data and website themes remain unchanged.
- Source discrepancy: the six supplied Barcelona UWCL league-phase fixtures imply **3 W / 1 D / 2 L**, while the supplied league-phase table says **4 W / 1 D / 1 L**. Both are preserved exactly pending confirmation.

## 2026-10-20 — Career infobox flags match the site

- Removed the compact 19px flag override from Club career and International career tables on all three character overviews.
- Career-table flags now inherit the regular `.country-flag` sizing (30px wide, up to 22px tall), matching other infobox flag displays.
- Changed only the flag styling and CSS cache version; all career records, table columns, and themes are unchanged.

## 2026-10-20 — Honours aligned from the left

- Switched the Overview honours lists from balanced newspaper columns to a left-first grid for Rens, Jordan and Vasi.
- Vasi's single Barcelona honour group now occupies the left side of the available row instead of being pushed into the right column.
- Preserved the existing headings, honours, right-hand infobox and full-width career statistics; mobile still shows one column.
- Updated the layout regression test and cache version. No player data changed.

## 2026-10-20 — Honours repositioned on all career overviews

- Moved **Honours** immediately below the Contents box on Rens's, Jordan's, and Vasi's main profiles so it fills the space to the left of the taller Wikipedia-style infobox.
- Kept the full-width **Career statistics** table below the infobox and honours, and changed the Contents order to match the page's visual order.
- Made the honours columns responsive (up to two columns beside the infobox; one column on narrow screens). No honours, statistics, or career data were changed.
- Added `tests/verify-overview-honours.js` to check the section layout on all three profiles.

## 2026-10-20 — Jordan international friendly classification correction

- Moved **Sweden 0–3 England** and **England 0–0 Ecuador** from the 2026 World Cup's extra-results section into Jordan's **2025–26 International Friendlies** fixtures and season summary.
- Restored the 2026 World Cup to its original **35 matches** under **2026–27**, without the misleading additional-results heading.
- Updated tournament-placement regression checks. Match results were preserved and Head to Head accounting remains unchanged.

## 2026-10-20 — World Cup and Euros season consolidation

- Consolidated Jordan's **2026 World Cup** into **2026–27**, removing duplicate tournament fixture, summary and standings sections from 2025–26.
- Combined the 35 World Cup bracket results on the 2026–27 page; two other England results were initially retained as additional matches, later correctly reclassified as 2025–26 friendlies (see correction above).
- Consolidated all **18 Euro 2028 fixtures** and the duplicate group standings into **2028–29**, removing the 2027–28 tournament sections. Euros qualifiers were not moved.
- Audited all three careers: Rens's World Cup and Euros were already on single pages and Vasi had no split tournament. No other competition, career statistics, or fixture scores changed.
- Updated the international fixture Head to Head regression check and added `tests/verify-international-tournaments.js`; Head to Head totals remain unchanged.

## 2026-10-19 — Jordan English flags and Timeline cleanup

- Confirmed Emeka Adiele and Andre Garcia as **English** in Jordan's 2029–30 Manchester United squad, using the existing local England flag image.
- Removed the visible "Club changed — squad comparison resets for the new club" and "In-season squad update" explanatory notes from the Timeline, keeping the **Joined** and **Left** lists.
- Updated the Jordan regression test and script version references. No fixtures, statistics, squad memberships or Head to Head records changed.

## 2026-10-19 — Jordan 2029–30 European finals

- Added the UEFA Champions League final (OM 2–2 Real Madrid, Real Madrid won 4–2 on penalties), Europa League final (SSC Napoli 1–2 VfB Stuttgart), and Conference League final (Real Sociedad 2–1 AS Roma) to Jordan’s 2029–30 season fixtures and competition summaries.
- Marked each competition section as a Final, allowing the existing Career Timeline to display the winners and runners-up without manually duplicating them.
- Kept the three neutral finals outside Jordan’s Head to Head and personal honours. Added regression checks for all three results and unchanged Head to Head totals.

## 2026-10-19 — Jordan Vale 2029–30 completed season

- Replaced the mid-season Manchester United snapshot with **38 scored Premier League fixtures** and the complete table: **4th, 74 points, 23 W / 5 D / 10 L, 72 GF / 44 GA**.
- Updated Jordan's detailed **2029–30** statistics and career infobox to **48 appearances, 0 goals, 0 assists and 18 clean sheets**. England's career record is now **42 appearances / 1 goal**, as separately supplied.
- Completed the Carabao Cup run, including the **1–0 final win over Leeds United** and the resulting **2029–30 Carabao Cup honour**. Added the FA Cup results and final, plus the remaining two international friendlies. No pending fixtures remain.
- Replaced the player list with the **39-player final squad**, updating all supplied player totals. Added Andre Garcia, Marco Palestra, Hugo Ekitiké and Gabriele Biancheri; recorded Sergiño Dest's absence alongside previously removed players in the Timeline. Missing squad names are not asserted to have transferred.
- Added Stevenage to shared team-flag definitions. Kept Emeka Adiele's and Andre Garcia's nationality flags blank pending confirmation, and preserved the source's overlapping No. 31 assigned to Senne Lammens and Marco Palestra.
- Recalculated Jordan's Head to Head: **304 played / 152 W / 65 D / 85 L against 106 opponents**. Rens and Vasi unchanged. Updated and passed all regression tests.

## 2026-10-19 — Jordan Vale career overview: PSV and updated totals

- Updated Jordan's **career infobox** to Manchester United (2029–2033, **34 apps / 0 goals**), PSV (2033–2037, no results yet) and Celtic (2037–2040, no results yet); Bristol City remains at 208 apps / 1 goal.
- Updated his England infobox record to **40 appearances / 1 goal** and adjusted the biography to reflect those current career-summary figures.
- Reassigned the 2033–34 through 2036–37 future **Career Statistics** placeholders from Manchester United to PSV (Eredivisie). No match results, future season pages or honours were invented.
- Kept the detailed **2029–30 Manchester United squad/season sheet at 24 appearances / 8 clean sheets**, as that is the latest supplied breakdown. The new 34-app career summary is a separate, user-confirmed overview figure pending a later season-sheet update.
- Updated overview/season regression checks and the Jordan data asset version; other players, fixtures, Head to Head and themes were preserved.

## 2026-10-19 — Head to Head represented-team display format

- Changed the **Represented** column to show full team names followed by match counts in parentheses (e.g. `Bristol City (6), Manchester United (1)`) for all three characters.
- Kept the underlying per-club match counts, sortability, aggregate accounting, fixtures and statistics unchanged.
- Updated the Head to Head regression checks and script cache version.

## 2026-10-19 — Vasi career overview update

- Confirmed Vasi's supplied name, nickname, birth information, height, position, current club and number in the overview infobox.
- Updated the FC Barcelona Femení club career summary to **119 appearances / 133 goals** (completed 2025–26 through 2027–28 seasons), retaining the separate 2028–29 in-progress season record of 24 appearances / 22 goals.
- Kept **Gotham FC (2036–2040)** and added **OFI Crete W.F.C. (2040–2043)** as future club career rows with unreported appearances and goals shown as dashes.
- Preserved the Greece international career summary at **4 appearances / 2 goals**, all honours, detailed season statistics, fixtures and Head to Head records.
- Updated Vasi's script cache version and added regression checks for the three club rows, personal details and the absence of fabricated future season pages.

## 2026-10-19 — Head to Head represented-team match counts

- The **Represented** column now shows match counts by club or national team (for example `5× Bristol City, 2× Manchester United`) for all three character profiles.
- Counts use the same eligible and deduplicated fixture records as the **P** column; aggregate-only UEFA knockout ties count as two matches, without inventing extra wins or losses.
- Kept the existing table columns, sorting, flag rendering, outcomes and player data unchanged. Added regression checks ensuring each row’s represented counts total its played matches.

## 2026-10-19 — Timeline squad movement wording

- Renamed in-season squad update headings from **Added to list** / **Removed from list** to the usual **Joined** / **Left** in the Career Timeline.
- Kept Jordan's existing 2029–30 squad names and the note that changes to a supplied squad list do not necessarily confirm transfers.
- Updated the Timeline regression test and the `app.js` cache version. No fixture, player or other page data changed.

## 2026-10-19 — Jordan Vale 2029–30 mid-season update

- Updated Jordan's Manchester United 2029–30 record to **24 appearances, 0 goals, 0 assists and 8 clean sheets**, including his club career infobox and season statistics (career-statistics totals still exclude incomplete seasons).
- Added the 14 newly supplied Premier League scores (17 known in total), three further Carabao Cup results, and six England friendlies. Preserved the existing three Champions Trophy results and eight-team table.
- Updated the provisional Premier League table: **Manchester United 3rd, 18 played, 34 points**; retained the source's rankings and points for all 20 clubs. Only 17 league scorelines were supplied, so the unidentified 18th score and unreported W/D/L, goals and goal difference remain blank instead of being invented.
- Kept unplayed **Manchester United vs Liverpool** (league) and **Manchester City vs Manchester United** (Carabao Cup) in a separate pending-fixtures display, excluded from Head to Head.
- Replaced the 38-player early squad with the latest **36-player** Manchester United roster, including all supplied appearances, goals, assists and clean sheets. Added No. 5 left-back **Emeka Adiele** with an unconfirmed nationality; no flag was guessed.
- Added an **in-season squad update** to the Timeline: Emeka Adiele added; Benjamin Šeško, Florian Daems and Rik Dekker removed from the latest squad list. Absence is not asserted as a confirmed transfer.
- Recalculated Jordan's Head to Head: **277 played, 136 wins, 61 draws, 78 losses, 105 opponents**, retaining the aggregate accounting rules. Rens and Vasi are unchanged.
- Extended the 2029–30 tests for the new roster, Timeline, league snapshot, pending scores and player values.

## 2026-10-19 — Static infobox career summaries

- Removed automatic sort arrows and click-to-sort handlers from the compact Club career and International career tables in all three player infoboxes.
- Preserved their original chronological row order and left the other sortable tables unchanged.
- Added regression checks for the static infobox summaries and retained sorting elsewhere.

## 2026-10-19 — Career overview updates (Rens and Jordan)

- Updated Rens's Netherlands infobox record to 42 appearances and 31 goals.
- Added explicit Dortmund (2035–2040) and future PEC Zwolle (2040–2043) club career rows; aligned the 2039–40 overview placeholder with Dortmund.
- Updated Jordan's infobox with Manchester United (2029–2037, 7 appearances/0 goals) and Celtic (2037–2040) as the later planned career move; removed the outdated PSV entry.
- Updated Jordan's England record to 36 appearances and 1 goal, and preserved his prior Bristol City shirt number on the infobox.
- Added future overview-only season rows for both players, without generating fixtures, season pages, stats or Head to Head results.
- Kept their current clubs as Borussia Dortmund and Manchester United, matching the seasons already recorded; the pasted current-team labels referenced prior clubs.
- Honours and completed-season statistics were already consistent with the supplied tables, so those values were not overwritten.

## 18 October 2026 — Confirm Rens's Dortmund squad flags

- Filled all 11 previously unknown 2035–36 Borussia Dortmund squad nationalities using user-provided countries: Everton Teixeira (Brazil), Kai Riedel (Germany), Giulio Valentini (Italy), Samuel Flament (France), Tariq Benzai (Tunisia), Pedro Villalba (Paraguay), Jonathan Friedrich (Germany), Petr Vávra (Slovenia), João Paulo Soares (Brazil), Andon Mihov (North Macedonia) and Patrik Novotný (Czechia).
- Added the 🇲🇰 flag mapping to the existing local `Macedonia.png` asset and shared country definitions; no new flag image needed.
- Extended the Rens 2035–36 test to verify all 11 flags and their local image paths. Updated the player/definitions script versions to refresh browser caches.
- No squad names, shirt numbers, results or player statistics were changed.

## 18 October 2026 — Rens 2035–36 Borussia Dortmund squad

- Added the 23-player Borussia Dortmund squad exactly as supplied, preserving position, number and order.
- Kept App, Goals, Asst and CLS blank: those statistics have not been provided for the in-progress season.
- Added verified nationality flags for established squad members and retained Ryan Cordier and Rens Adisea flags already in the data. Eleven unconfirmed nationalities remain blank pending user confirmation.
- Refreshed Rens’s data-script version and extended the Bundesliga season regression test; previous player statistics, fixtures and standings remain unchanged.

## 18 October 2026 — Rens 2035–36 Bundesliga entrants

- Replaced the outdated 2035–36 Bundesliga placeholder teams with the exact 18 participants supplied in the entry list, preserving their order without inventing league positions or match statistics.
- The 2035–36 Timeline now correctly shows **Hannover 96** and **1. FC Nürnberg** as entered from 2034–35, in place of **Holstein Kiel** and **Mönchengladbach** (the previous season's bottom two).
- Added Hannover 96 to the shared German flag mappings. The season remains in progress; its relegated teams remain unknown.
- Added an automated regression test for Bundesliga entries and refreshed only the affected data-script versions. No fixture or player statistics were changed.

## 18 October 2026 — Rens career placeholders

- Replaced the two "In progress" values for Rens’s Borussia Dortmund club career (appearances and goals) with em dashes (`—`) in the infobox.
- Changed the 2035–36 league-position placeholder in his overview Career Statistics table to `—`.
- Kept the 2035–36 season correctly marked as in progress; no fixtures, statistics or other player data were changed.

## 18 October 2026 — Wikipedia-style career infoboxes

- Moved the club career and international career summary tables into each player's right-hand profile infobox (Rens, Jordan and Vasi).
- Preserved the existing career data and the full-width Career statistics and Honours sections.
- Added compact responsive styling for all three themes, including local nationality flag images.
- Kept the Contents links functional as in-page scrolling without interfering with the hash-based character router.

## 2026-10-17 — Jordan Vale 2029–30 first results and James Scanlon

- Recorded Manchester United's three **Champions Trophy** results and supplied eight-team group table, plus the first three **Premier League** wins and a **Carabao Cup** penalty-shootout win over Brighton & Hove.
- Added **James Scanlon**, number **28**, **CAM**, with Gibraltar nationality to United's squad (38 players). Added the existing local Gibraltar flag asset to the country's flag mapping.
- Added missing shared club-country flags for Rayo Vallecano, RC Mallorca, Al Ahli and Al Nassr.
- Calculated the known Manchester United league record (3 P, 3 W, 0 D, 0 L, 7 GF, 0 GA, 9 pts) while leaving league position and other clubs' unreported table statistics blank. A placeholder 38-game season schedule is not treated as 38 completed matches.
- Updated the season summary and player biography. Timeline no longer mistakes an incomplete list of league participants for a current top-five ranking.
- Kept Jordan's own appearance/goals/assists/clean-sheet statistics unreported until supplied, and continued the existing Head to Head accounting conventions.

## 2026-10-17 — Restore alphabetical flag-column sorting

- Restored alphabetical sorting for flag and nationality columns in squad, standings and Head to Head tables after emoji flags were replaced by local image files.
- Sorting now uses the country's name from its local flag asset (for example, Belgium, Netherlands, Paraguay), rather than the empty text content of an image-only cell.
- Kept the flag artwork, player data, match results and sorting of other columns unchanged; refreshed the `app.js` cache version.

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
