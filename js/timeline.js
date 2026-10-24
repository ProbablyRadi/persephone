// Season-by-season timeline and squad/league movement.
// Loaded before app.js; shared functions remain available to the other scripts.

function timelinePlayerKey(name) {
    return String(name || '')
        .replace(/\s*\(C\)\s*/gi, ' ')
        .replace(/\s*⭐\s*/g, ' ')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ').trim().toLowerCase();
}
function timelineSquadNames(meta) {
    return (meta && meta.squad ? meta.squad : []).map(squadRow => String(squadRow[2] || '').replace(/\s*\(C\)\s*/gi, ' ').replace(/\s*⭐\s*/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean);
}
function timelineSquadChanges(id, season, prevSeason) {
    const cur = (typeof SEASON_TABLES !== 'undefined' && SEASON_TABLES[id] && SEASON_TABLES[id][season]) || null;
    const prev = prevSeason && SEASON_TABLES[id] && SEASON_TABLES[id][prevSeason] ? SEASON_TABLES[id][prevSeason] : null;
    if (!cur || !cur.squad || !cur.squad.length)
        return {
            joined: [], left: [], note: 'No squad list supplied for this season.'
        };
    if (!prev || !prev.squad || !prev.squad.length)
        return {
            joined: [], left: [], note: 'Baseline squad — no previous supplied player list to compare.'
        };
    if (canonicalTeam(cur.club || '') !== canonicalTeam(prev.club || ''))
        return {
            joined: [], left: [], note: '', comparisonSkipped: true
        };
    const curNames = timelineSquadNames(cur), prevNames = timelineSquadNames(prev);
    const curMap = new Map(curNames.map(playerName => [
        timelinePlayerKey(playerName), playerName
    ])), prevMap = new Map(prevNames.map(playerName => [
        timelinePlayerKey(playerName), playerName
    ]));
    return {
        joined: [
            ...curMap
        ].filter(([playerKey]) => !prevMap.has(playerKey)).map(([, playerName]) => playerName),
        left: [
            ...prevMap
        ].filter(([playerKey]) => !curMap.has(playerKey)).map(([, playerName]) => playerName),
        note: ''
    };
}
// Determine the winning side of a recorded final or third-place play-off.
// Penalties are used only when the score is level; no winner is invented for a draw.
function timelineFixtureWinner(fixture) {
    if (!fixture.home || !fixture.away)
        return '';
    if (fixture.hg > fixture.ag)
        return fixture.home;
    if (fixture.ag > fixture.hg)
        return fixture.away;
    if (fixture.hp != null && fixture.ap != null && fixture.hp !== fixture.ap)
        return fixture.hp > fixture.ap ? fixture.home : fixture.away;
    return '';
}
function timelineCupFinals(id, season) {
    const manualFinals = DATA[id].timelineManualFinals || {};
    const out = manualFinals[season] ? [
        ...manualFinals[season]
    ] : [];
    const comps = (FULL_FIXTURES[id] && FULL_FIXTURES[id][season]) || {};
    Object.entries(comps).forEach(([comp, items]) => {
        if (comp === 'Pre-season friendlies' || out.some(existingFinal => existingFinal.comp === comp))
            return;
        let finalRaw = (items || []).find(fixtureText =>
            /^F\s+—\s+/i.test(String(fixtureText).trim())
        );

        // Older European competition sheets do not always prefix the
        // final fixture with "F —". When a supplied UEFA round map marks
        // a fixture index as the Final, use that fixture instead.
        if (!finalRaw) {
            const roundBreaks = tournamentRounds(comp, items || [], id, season);
            const finalEntry = Object.entries(roundBreaks).find(([, roundName]) =>
                /final/i.test(String(roundName))
                && !/semi|quarter|third/i.test(String(roundName))
            );

            if (finalEntry) {
                const finalIndex = Number(finalEntry[0]);

                if (Number.isInteger(finalIndex) && items[finalIndex]) {
                    finalRaw = items[finalIndex];
                }
            }
        }

        if (!finalRaw)
            return;

        const fixture = parseFixture(finalRaw);
        if (!fixture.home)
            return;
        const winner = timelineFixtureWinner(fixture);
        const runner = winner
            ? (winner === fixture.home ? fixture.away : fixture.home)
            : '';
        const score = `${fixture.hg} - ${fixture.ag}`;

        // World Cup fixtures include a separate third-place play-off. Read its
        // winner from the supplied round labels rather than assuming a ranking.
        let third = '';
        if (/^World Cup(?:\s+\d{4})?$/i.test(comp)) {
            const rounds = tournamentRounds(comp, items || [], id, season);
            const thirdRound = Object.entries(rounds).find(([, roundName]) =>
                /third[- ]place/i.test(String(roundName))
            );
            if (thirdRound && items[Number(thirdRound[0])])
                third = timelineFixtureWinner(parseFixture(items[Number(thirdRound[0])]));
        }

        if (winner)
            out.push({
                comp, winner, runner, score, third
            });
    });
    const cupOrder = {
        'Carabao Cup': 1, 'FA Cup': 2
    };
    out.sort((firstFinal, secondFinal) => (cupOrder[firstFinal.comp] || 99) - (cupOrder[secondFinal.comp] || 99));
    return out;
}
function timelineTopFive(id, season) {
    const meta = (typeof SEASON_TABLES !== 'undefined' && SEASON_TABLES[id] && SEASON_TABLES[id][season]) || null;
    if (!meta || !meta.standings || meta.standings.length < 5)
        return [];
    // A supplied list of league participants is not a live ranking.
    // Show leaders only when the first five rows have actual positions/points.
    const leading = meta.standings.slice(0, 5);
    return leading.every(row => /^\d+$/.test(String(row[0])) && /^\d+$/.test(String(row[9])))
        ? leading
        : [];
}
function timelineLeagueMovement(id, season, previousSeason) {
    const currentMeta = (typeof SEASON_TABLES !== 'undefined' && SEASON_TABLES[id] && SEASON_TABLES[id][season]) || null;
    const previousMeta = previousSeason
        ? (typeof SEASON_TABLES !== 'undefined' && SEASON_TABLES[id] && SEASON_TABLES[id][previousSeason]) || null
        : null;

    if (!currentMeta || !currentMeta.standings || !currentMeta.standings.length)
        return null;

    const movementEnabled = typeof LEAGUE_RELEGATION_PLACES !== 'undefined'
        && Number.isInteger(LEAGUE_RELEGATION_PLACES[currentMeta.league]);

    if (!movementEnabled)
        return null;

    const currentTeams = currentMeta.standings.map(standingRow => ({
        canonicalName: canonicalTeam(cleanTeamName(standingRow[1])),
        displayName: cleanTeamName(standingRow[1])
    }));

    let entered = null;

    if (
        previousMeta
        && previousMeta.league === currentMeta.league
        && previousMeta.standings
        && previousMeta.standings.length
    ) {
        const previousNames = new Set(
            previousMeta.standings.map(standingRow => canonicalTeam(cleanTeamName(standingRow[1])))
        );

        entered = currentTeams
            .filter(team => !previousNames.has(team.canonicalName))
            .map(team => team.displayName);
    }
    else {
        const playerData = DATA[id] || {};
        const baseline = playerData.timelineLeagueEntryBaselines
            ? playerData.timelineLeagueEntryBaselines[season]
            : null;

        if (
            baseline
            && baseline.league === currentMeta.league
            && Array.isArray(baseline.teams)
            && baseline.teams.length
        ) {
            const baselineNames = new Set(
                baseline.teams.map(team => canonicalTeam(cleanTeamName(team)))
            );

            entered = currentTeams
                .filter(team => !baselineNames.has(team.canonicalName))
                .map(team => team.displayName);
        }
    }

    const seasonData = DATA[id] && DATA[id].seasons ? DATA[id].seasons[season] : null;
    let relegated = null;

    if (!seasonData || !seasonData.inProgress) {
        const relegationPlaces = typeof LEAGUE_RELEGATION_PLACES !== 'undefined'
            ? LEAGUE_RELEGATION_PLACES[currentMeta.league]
            : null;

        if (Number.isInteger(relegationPlaces) && relegationPlaces > 0) {
            relegated = currentTeams
                .slice(-relegationPlaces)
                .map(team => team.displayName);
        }
    }

    return {
        league: currentMeta.league,
        entered,
        relegated,
        inProgress: !!(seasonData && seasonData.inProgress)
    };
}
function careerTimeline(id) {
    app.className = 'timeline-page';
    const playerData = DATA[id], seasons = Object.keys(playerData.seasons || {});
    nav.innerHTML = careerNavigator(id, '', 'timeline');
    const cards = seasons.map((season, seasonIndex) => {
        const meta = (typeof SEASON_TABLES !== 'undefined' && SEASON_TABLES[id] && SEASON_TABLES[id][season]) || null;
        const stat = statForSeason(playerData, season);
        const club = meta && meta.club
            ? meta.club
            : (stat ? cleanClubLabel(stat[1]) : '');
        const leagueName = meta && meta.league
            ? meta.league
            : (stat ? stat[3] : '');

        const top = timelineTopFive(id, season);
        const cups = timelineCupFinals(id, season);
        const moves = timelineSquadChanges(id, season, seasons[seasonIndex - 1]);
        const leagueMovement = timelineLeagueMovement(id, season, seasons[seasonIndex - 1]);

        const topHtml = top.length ? `<ol class="timeline-topfive">${top.map(standingRow => `<li class="${canonicalTeam(cleanTeamName(standingRow[1])) === canonicalTeam(meta && meta.club ? meta.club : '') ? 'focus' : ''}"><span>${teamFlag(cleanTeamName(standingRow[1]))} ${esc(standingRow[1])}</span><b>${standingRow[9] !== '' && standingRow[9] != null ? esc(standingRow[9]) + ' pts' : ''}</b></li>`).join('')}</ol>` : '<p class="muted">League top five not yet available.</p>';
        const cupHtml = cups.length ? cups.map(cupFinal => `<div class="timeline-cup"><b>${esc(cupFinal.comp)}</b><span>Winner: ${teamFlag(cupFinal.winner)} ${esc(cupFinal.winner)}</span><span>Runner-up: ${teamFlag(cupFinal.runner)} ${esc(cupFinal.runner)}</span>${/^World Cup(?:\s+\d{4})?$/i.test(cupFinal.comp) ? `<span>Third place: ${cupFinal.third ? `${teamFlag(cupFinal.third)} ${esc(cupFinal.third)}` : 'Not recorded'}</span>` : ''}</div>`).join('') : '<p class="muted">No recorded cup final for this season.</p>';
        const moveHtml = moves.comparisonSkipped ? '' : moves.note ? `<p class="muted">${esc(moves.note)}</p>` : `<div class="timeline-moves"><div><b>Joined</b>${moves.joined.length ? `<ul>${moves.joined.map(playerName => `<li>+ ${esc(playerName)}</li>`).join('')}</ul>` : '<span class="muted">None recorded</span>'}</div><div><b>Left</b>${moves.left.length ? `<ul>${moves.left.map(playerName => `<li>− ${esc(playerName)}</li>`).join('')}</ul>` : '<span class="muted">None recorded</span>'}</div></div>`;
        // A second roster snapshot within the current season can reveal changes
        // that season-to-season comparisons cannot show (especially after a move).
        // A missing name is not necessarily evidence of a transfer.
        const inSeason = playerData.timelineInSeasonSquadUpdates && playerData.timelineInSeasonSquadUpdates[season];
        const inSeasonHtml = inSeason ? `<div class="timeline-moves"><div><b>Joined</b>${inSeason.added && inSeason.added.length ? `<ul>${inSeason.added.map(name => `<li>+ ${esc(name)}</li>`).join('')}</ul>` : '<span class="muted">None</span>'}</div><div><b>Left</b>${inSeason.removed && inSeason.removed.length ? `<ul>${inSeason.removed.map(name => `<li>− ${esc(name)}</li>`).join('')}</ul>` : '<span class="muted">None</span>'}</div></div>` : '';
        const enteredHtml = leagueMovement && Array.isArray(leagueMovement.entered)
            ? (leagueMovement.entered.length
                ? `<ul>${leagueMovement.entered.map(team => `<li>↑ ${teamFlag(team)} ${esc(team)}</li>`).join('')}</ul>`
                : '<span class="muted">None</span>')
            : '<span class="muted">Unknown — no previous table for this league is supplied.</span>';

        const relegatedHtml = leagueMovement
            ? (leagueMovement.inProgress
                ? '<span class="muted">Not final — season in progress.</span>'
                : (Array.isArray(leagueMovement.relegated)
                    ? (leagueMovement.relegated.length
                        ? `<ul>${leagueMovement.relegated.map(team => `<li>↓ ${teamFlag(team)} ${esc(team)}</li>`).join('')}</ul>`
                        : '<span class="muted">None</span>')
                    : '<span class="muted">Relegation places are not defined for this league.</span>'))
            : '<span class="muted">No league table supplied.</span>';

        const leagueMovementSection = leagueMovement
            ? `<section><h3>League movement</h3><div class="timeline-league-movement"><div><b>Entered</b>${enteredHtml}</div><div><b>Relegated</b>${relegatedHtml}</div></div></section>`
            : '';

        return `
            <article class="timeline-season-card">
                <a
                    class="timeline-dot"
                    href="#${id}/${season}"
                    aria-label="Open ${season} season"
                ></a>

                <div class="timeline-season-head">
                    <span>${season}</span>
                    ${playerData.seasons[season].inProgress ? '<em>Live</em>' : ''}
                </div>

                <h2>
                    ${club ? `${teamFlag(club)} ${esc(club)}` : 'Career season'}
                </h2>

                ${leagueName
                    ? `<p class="timeline-league-name">${esc(leagueName)}</p>`
                    : ''}

                <section>
                    <h3>League top 5</h3>
                    ${topHtml}
                </section>

                <section>
                    <h3>Cup finals</h3>
                    ${cupHtml}
                </section>

                ${leagueMovementSection}

                ${moveHtml || inSeasonHtml ? `<section>
                    <h3>Squad movement</h3>
                    ${moveHtml}
                    ${inSeasonHtml}
                </section>` : ''}
            </article>
        `;
    }).join('');
    app.innerHTML = `<div class="timeline-wrap"><p><a href="#${id}">← ${esc(playerData.displayName || playerData.name)}</a></p><h1>${playerData.flag} ${esc(playerData.displayName || playerData.name)} — Career timeline</h1><p class="lede">Season-by-season view of league leaders, recorded cup finals and squad changes. Premier League and Bundesliga cards also show league movement: Entered teams are derived from the previous supplied table, while Relegated teams come from that season's direct relegation places. Squad movement is calculated from consecutive supplied player lists and resets when the player changes club.</p><div class="timeline-scroll"><div class="career-timeline">${cards}</div></div></div>`;
}
