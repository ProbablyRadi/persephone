// Domestic league finishes across completed seasons, using the supplied tables.
// Relegations and new entrants use the outside-league row. Unexplained gaps stay gaps.
function comparisonLeagueData(id) {
    const player = DATA[id];
    const leagues = new Map();
    for (const [season, meta] of Object.entries(SEASON_TABLES[id] || {}).sort()) {
        const rows = meta.standings || [];
        const positions = rows.map(row => Number(row[0]));
        const complete = rows.length > 0
            && positions.every(rank => Number.isInteger(rank) && rank > 0)
            && new Set(positions).size === rows.length
            && rows.every(row => String(row[9] ?? '').trim() !== '');
        if (player.seasons[season]?.inProgress || !meta.league || !complete)
            continue;

        if (!leagues.has(meta.league)) {
            leagues.set(meta.league, {
                name: meta.league, years: [], positions: new Map(), careerClubs: new Set(), maxPosition: 0
            });
        }
        const league = leagues.get(meta.league);
        league.years.push(season);
        league.careerClubs.add(canonicalTeam(cleanClubLabel(meta.club || '')));
        rows.forEach((row, index) => {
            const team = canonicalTeam(row[1]);
            if (!league.positions.has(team)) league.positions.set(team, new Map());
            league.positions.get(team).set(season, positions[index]);
            league.maxPosition = Math.max(league.maxPosition, positions[index]);
        });
    }
    return [...leagues.values()].map(league => {
        const teams = [...league.positions.keys()].sort((a, b) => a.localeCompare(b));
        return { ...league, teams, relegated: comparisonRelegations(league, teams) };
    });
}

function comparisonRelegations(league, teams) {
    const relegated = new Map();
    const places = LEAGUE_RELEGATION_PLACES[league.name] || 0;

    for (const team of teams) {
        const ranks = league.positions.get(team);
        let outsideLeague = false;
        for (let index = 1; index < league.years.length; index++) {
            const season = league.years[index];
            const previous = league.years[index - 1];
            const consecutive = Number(season.slice(0, 4)) === Number(previous.slice(0, 4)) + 1;
            if (ranks.has(season) || !consecutive) {
                outsideLeague = false;
                continue;
            }
            const previousSize = Math.max(...[...league.positions.values()]
                .map(positions => positions.get(previous) || 0));
            const previousRank = ranks.get(previous);
            if (previousRank > previousSize - places) outsideLeague = true;
            if (outsideLeague) {
                if (!relegated.has(team)) relegated.set(team, new Set());
                relegated.get(team).add(season);
            }
        }
        // A newly listed team rises from the outside-league row in the season
        // immediately before its first appearance. Do not invent earlier ranks
        // or bridge a gap between non-consecutive recorded seasons.
        const firstIndex = league.years.findIndex(season => ranks.has(season));
        if (firstIndex > 0) {
            const firstSeason = league.years[firstIndex];
            const previous = league.years[firstIndex - 1];
            if (Number(firstSeason.slice(0, 4)) === Number(previous.slice(0, 4)) + 1) {
                if (!relegated.has(team)) relegated.set(team, new Set());
                relegated.get(team).add(previous);
            }
        }
    }
    return relegated;
}

function comparisonFinish(league, team, season) {
    const rank = league.positions.get(team).get(season);
    if (rank !== undefined) return rank;
    return league.relegated?.get(team)?.has(season) ? 'Relegated' : null;
}

function comparisonTeamColours(team) {
    const canonical = canonicalTeam(team);
    const name = typeof TEAM_COLOUR_ALIASES === 'undefined'
        ? canonical : TEAM_COLOUR_ALIASES[canonical] || canonical;
    const palette = typeof TEAM_COLOURS === 'undefined' ? null : TEAM_COLOURS[name];
    if (palette) return palette;

    // Unmapped teams keep the same fallback across characters and leagues.
    // Using the name instead of the list index avoids colours changing on promotion.
    let hash = 0;
    for (const character of name) hash = (hash * 31 + character.codePointAt(0)) >>> 0;
    return [`hsl(${hash % 360} 65% 43%)`, '#ffffff'];
}

function comparisonTeamStyle(team) {
    const [main, accent] = comparisonTeamColours(team);
    return `--team-colour: ${main}; --team-accent: ${accent}`;
}

function comparisonChart(league) {
    const hasRelegation = (league.relegated?.size || 0) > 0;
    const relegatedRank = league.maxPosition + 1.5;
    const bottomRank = hasRelegation ? relegatedRank : league.maxPosition;
    const width = Math.max(820, league.years.length * 130 + 280);
    const height = Math.max(460, (league.maxPosition + (hasRelegation ? 2 : 0)) * 24 + 80);
    const padding = { left: hasRelegation ? 124 : 58, right: 220, top: 36, bottom: 54 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const x = index => padding.left + (league.years.length === 1 ? plotWidth / 2 : index * plotWidth / (league.years.length - 1));
    const y = position => padding.top + (position - 1) * plotHeight / Math.max(1, bottomRank - 1);

    const grid = Array.from({ length: league.maxPosition }, (_, index) => {
        const rank = index + 1;
        return `<g class="comparison-grid-row">
            <line x1="${padding.left}" y1="${y(rank)}" x2="${width - padding.right}" y2="${y(rank)}" />
            <text x="${padding.left - 12}" y="${y(rank) + 5}" text-anchor="end">${rank}</text>
        </g>`;
    }).join('');
    const relegationRow = !hasRelegation ? '' : `<g class="comparison-relegation-row">
        <rect x="${padding.left}" y="${y(relegatedRank) - 12}" width="${plotWidth}" height="24" />
        <line x1="${padding.left}" y1="${y(relegatedRank)}" x2="${width - padding.right}" y2="${y(relegatedRank)}" />
        <text x="${padding.left - 12}" y="${y(relegatedRank) + 5}" text-anchor="end">Outside league</text>
    </g>`;
    const seasons = league.years.map((season, index) => `
        <text class="comparison-season-label" x="${x(index)}" y="${height - 20}" text-anchor="middle">${esc(season)}</text>
    `).join('');
    const series = league.teams.map((team, index) => {
        const points = league.positions.get(team);
        let previousIndex = -2;
        let previousOutside = false;
        let path = '';
        const dots = league.years.map((season, seasonIndex) => {
            const finish = comparisonFinish(league, team, season);
            if (finish === null) return '';
            const outside = finish === 'Relegated';
            // Show only the outside points adjoining an actual entry or exit.
            // Never draw horizontal lines across a team's absent seasons.
            if (outside && !points.has(league.years[seasonIndex - 1]) && !points.has(league.years[seasonIndex + 1])) return '';
            const rank = outside ? relegatedRank : finish;
            const connected = previousIndex === seasonIndex - 1 && !(outside && previousOutside);
            path += `${connected ? 'L' : 'M'} ${x(seasonIndex)} ${y(rank)} `;
            previousIndex = seasonIndex;
            previousOutside = outside;
            return `<circle cx="${x(seasonIndex)}" cy="${y(rank)}" r="3.5"><title>${esc(team)} · ${season}: ${outside ? 'Outside league' : ordinal(rank)}</title></circle>`;
        }).join('');
        const lastRank = points.get(league.years.at(-1));
        const label = lastRank === undefined ? '' : `
            <text class="comparison-team-label" x="${width - padding.right + 12}" y="${y(lastRank) + 5}">${esc(team)}</text>`;
        const title = league.years.map(season => {
            const finish = comparisonFinish(league, team, season);
            return `${season}: ${finish === 'Relegated' ? 'Outside league' : finish === null ? 'not listed' : ordinal(finish)}`;
        }).join(', ');
        const focus = league.careerClubs.has(team);
        return `<g class="comparison-series ${focus ? 'comparison-career comparison-series-selected' : 'comparison-series-dimmed'}" data-team-index="${index}" style="${comparisonTeamStyle(team)}">
            <title>${esc(team)} — ${title}</title>
            <path d="${path.trim()}" class="comparison-line-outline" />
            <path d="${path.trim()}" class="comparison-line" />${dots}${label}
        </g>`;
    }).join('');
    return `<svg class="comparison-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="League finishing positions, first place at the top">
        ${grid}${relegationRow}${seasons}${series}
    </svg>`;
}

function comparisonCard(league, index) {
    const choices = league.teams.map((team, teamIndex) => `<label class="comparison-team-choice">
        <input type="checkbox" value="${teamIndex}" ${league.careerClubs.has(team) ? 'checked data-career="true"' : ''}>
        <span class="comparison-swatch" style="${comparisonTeamStyle(team)}" aria-hidden="true"></span><span>${esc(team)}</span>
    </label>`).join('');
    const headers = league.years.map(season => `<th scope="col">${esc(season)}</th>`).join('');
    const rows = league.teams.map((team, teamIndex) => {
        const cells = league.years.map(season => {
            const finish = comparisonFinish(league, team, season);
            const hue = Number.isFinite(finish) ? Math.round(140 - (finish - 1) / Math.max(1, league.maxPosition - 1) * 120) : null;
            return `<td${hue === null ? ' class="comparison-unranked"' : ` class="comparison-ranked" style="--finish-hue: ${hue}"`}>${finish === null ? '—' : finish === 'Relegated' ? 'Outside league' : ordinal(finish)}</td>`;
        }).join('');
        return `<tr data-team-index="${teamIndex}"${league.careerClubs.has(team) ? ' class="comparison-career-row"' : ''}>
            <th scope="row"><span class="comparison-swatch" style="${comparisonTeamStyle(team)}" aria-hidden="true"></span>${esc(team)}</th>${cells}
        </tr>`;
    }).join('');
    return `<section class="season-card comparison-card" aria-labelledby="comparison-title-${index}">
        <div class="comparison-card-header">
            <div><div class="panel-kicker">${league.years.length} completed ${league.years.length === 1 ? 'season' : 'seasons'} · ${league.teams.length} teams</div>
                <h2 id="comparison-title-${index}">${esc(league.name)}</h2></div>
        </div>
        <div class="comparison-controls">
            <details class="comparison-team-menu">
                <summary>Choose teams <span class="comparison-selection-count">${league.careerClubs.size} selected</span></summary>
                <fieldset><legend>Teams to compare in ${esc(league.name)}</legend>${choices}</fieldset>
            </details>
            <button type="button" data-comparison-action="reset">Character's clubs</button>
            <button type="button" data-comparison-action="all">Show all teams</button>
        </div>
        <div class="comparison-selected-teams" aria-label="Selected teams"></div>
        <p class="chart-note">1st is at the top. Selected teams are in colour; faint lines show the rest of the league.${league.years.length === 1 ? ' One completed season is available, so points show its final standings.' : ''}</p>
        <p class="comparison-mobile-hint">Swipe sideways to see all seasons and team names.</p>
        <div class="comparison-scroll" tabindex="0" role="region" aria-label="Scrollable league position graph">${comparisonChart(league)}</div>
        <p class="comparison-key">Solid lines use primary club colours; dots use secondary colours.${league.relegated.size ? ' Outside league points mark entry and exit only.' : ''} Unreported seasons remain gaps.</p>
        <details class="comparison-data">
            <summary>View all team finishes</summary>
            <div class="table-scroll"><table class="wikitable comparison-table">
                <caption>${esc(league.name)} final positions. Green shading marks higher finishes; amber marks lower finishes. — means not listed.</caption>
                <thead><tr><th scope="col">Team</th>${headers}</tr></thead><tbody>${rows}</tbody>
            </table></div>
        </details>
        <p class="comparison-status" role="status"></p>
    </section>`;
}

function enableComparisonPickers() {
    app.querySelectorAll('.comparison-card').forEach(card => {
        const choices = [...card.querySelectorAll('.comparison-team-choice input')];
        const series = [...card.querySelectorAll('.comparison-series')];
        function updateSelection(announce = true) {
            const selected = new Set(choices.filter(input => input.checked).map(input => input.value));
            series.forEach(line => {
                const active = selected.has(line.dataset.teamIndex);
                line.classList.toggle('comparison-series-dimmed', !active);
                line.classList.toggle('comparison-series-selected', active);
                // Paint selected teams above background lines at crossings.
                if (active) line.parentElement.append(line);
            });
            card.querySelector('.comparison-selection-count').textContent = `${selected.size} selected`;
            const names = card.querySelector('.comparison-selected-teams');
            names.replaceChildren();
            choices.filter(input => input.checked).forEach(input => {
                const chip = document.createElement('span');
                chip.className = 'comparison-team-chip';
                chip.append(input.closest('label').querySelector('.comparison-swatch').cloneNode(true));
                chip.append(document.createTextNode(input.closest('label').querySelector('span:last-child').textContent));
                names.append(chip);
            });
            if (!selected.size) names.textContent = 'Choose one or more teams to compare.';
            if (announce) card.querySelector('[role="status"]').textContent = `${selected.size} teams selected.`;
        }
        choices.forEach(input => input.addEventListener('change', () => updateSelection()));
        card.querySelectorAll('[data-comparison-action]').forEach(button => {
            button.addEventListener('click', () => {
                choices.forEach(input => { input.checked = button.dataset.comparisonAction === 'all' || input.dataset.career === 'true'; });
                updateSelection();
            });
        });
        updateSelection(false);
    });
}

function careerComparisons(id) {
    const player = DATA[id];
    const leagues = comparisonLeagueData(id);
    app.className = 'comparisons-page';
    nav.innerHTML = careerNavigator(id, '', 'comparisons');
    app.innerHTML = `<div class="comparisons-wrap">
        <p><a href="#${id}">← ${esc(player.displayName || player.name)}</a></p>
        <h1>${esc(player.displayName || player.name)} — Season comparisons</h1>
        <p class="lede">Follow the character's clubs, then add rivals to compare their league finishes.</p>
        <p class="note">Only completed seasons are shown. In-progress seasons will appear once their final standings are recorded.</p>
        ${leagues.length ? leagues.map(comparisonCard).join('') : '<p>No completed league standings are available yet.</p>'}
    </div>`;
    enableComparisonPickers();
}
