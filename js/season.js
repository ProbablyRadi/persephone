// Season dashboard, competition panels and jump navigation.
// Loaded before app.js; shared functions remain available to the other scripts.

function season(id, seasonName) {
    app.className = 'season-view';
    const playerData = DATA[id];
    const seasonData = playerData.seasons[seasonName];
    const full = FULL_FIXTURES[id]?.[seasonName] || {};
    const meta = SEASON_TABLES[id]?.[seasonName] || null;
    nav.innerHTML = careerNavigator(id, seasonName);
    const entries = Object.entries(full);
    const sideLeagueSeason = !!(meta && meta.league && full[meta.league] && meta.standings && meta.standings.length);
    const jumpItems = [
        [
            'season-overview', 'Overview'
        ], [
            'league-table', 'League table'
        ], [
            'player-list', 'Player list'
        ], ...entries.map(([competitionName]) => [
            sectionId(competitionName), competitionName
        ])
    ];
    const jump = `<nav class="season-jump season-tabs-nav"><b>Season navigation</b><div>${jumpItems.map(([sid, label]) => `<a href="#${sid}" onclick="event.preventDefault();const el=document.getElementById('${sid}');if(el)el.scrollIntoView({behavior:'smooth',block:'start'})">${label}</a>`).join('')}</div></nav>`;
    const blocks = entries.map(([competitionName, fixtures]) => {
        const side = competitionSideTable(id, seasonName, competitionName, meta);
        const leagueId = (sideLeagueSeason && meta && competitionName === meta.league) ? ' id="league-table"' : '';
        const pending = seasonData.pendingFixtures && seasonData.pendingFixtures[competitionName] || [];
        const pendingHtml = pending.length
            ? `<div class="table-note"><b>Scheduled / score pending (not counted in results or Head to Head)</b><ul>${pending.map(item => `<li>${esc(item)}</li>`).join('')}</ul></div>`
            : '';
        const fixturesHtml = (fixtures.length
            ? fixtureTable(fixtures, focalFor(id, seasonName, competitionName), competitionName, id, seasonName)
            : '<p class="muted">No fixtures recorded yet.</p>') + pendingHtml;

        const panel = seasonFixturePanel(competitionName, fixturesHtml, Boolean(side));
        if (!side)
            return panel;
        return `<div class="competition-pair" id="${sectionId(competitionName)}">${panel}<aside class="competition-standings-panel"${leagueId}>${side}</aside></div>`;
    }).join('');
    const leaguePanel = sideLeagueSeason ? '' : `<section class="season-data-panel season-card" id="league-table"><div class="panel-kicker">Standings</div><h2>${meta ? esc(meta.league) : 'League'} table</h2>${standingsTable(meta, seasonData.inProgress)}</section>`;
    const dataTables = `<div class="season-data-grid${sideLeagueSeason ? ' squad-only' : ''}">${leaguePanel}<section class="season-data-panel season-card" id="player-list"><div class="panel-kicker">Squad</div><h2>Player list${meta && meta.club ? ` — ${esc(meta.club)}` : ''}</h2>${squadTable(meta, id, seasonData.inProgress)}</section></div>`;
    const stat = statForSeason(playerData, seasonName);
    const club = meta?.club || (stat ? cleanClubLabel(stat[1]) : '');
    const league = meta?.league || (stat ? stat[3] : '');
    app.innerHTML = `
        <div class="season-page">
            <section class="season-hero" id="season-overview">
                <div class="season-breadcrumb">
                    <a href="#${id}">${esc(playerData.name)}</a><span>›</span><span>${seasonName}</span>
                </div>
                <div class="season-title-row">
                    <div>
                        <div class="season-eyebrow">${club ? `${teamFlag(club)} ${esc(club)}` : 'Career season'}</div>
                        <h1>${seasonName}</h1>
                        <p class="season-subtitle">${league ? esc(league) + ' · ' : ''}${esc(playerData.name)}${seasonData.inProgress ? ' · In progress' : ''}</p>
                    </div>
                    ${seasonData.inProgress ? '<span class="season-live">In progress</span>' : ''}
                </div>
                <p class="lede season-summary">${seasonData.summary}</p>
                ${seasonStatStrip(playerData, seasonName, seasonData, meta)}
                <div class="season-record"><span>League record</span><b>${seasonData.table}</b></div>
            </section>
            ${jump}
            ${dataTables}
            <div class="season-results-head">
                <div>
                    <div class="panel-kicker">Match archive</div>
                    <h2>Competitions & results</h2>
                </div>
                <p>Green = win, amber = draw, red = loss. Grey marks tournament results not involving the player's team.</p>
            </div>
            ${blocks || '<p>No scored fixtures have been recorded yet.</p>'}
        </div>
    `;
}

// Share the fixture-panel markup between standalone and paired competitions.
function seasonFixturePanel(competitionName, fixturesHtml, paired) {
    const panelClass = paired ? ' competition-fixture-panel' : '';
    const panelId = paired ? '' : ` id="${sectionId(competitionName)}"`;
    return `<section class="competition season-competition${panelClass}"${panelId}><div class="competition-heading"><h2>${competitionName}</h2><a href="#season-overview" onclick="event.preventDefault();document.getElementById('season-overview').scrollIntoView({behavior:'smooth'})">Back to top ↑</a></div><div class="competition-fixtures">${fixturesHtml}</div></section>`;
}
