const app = document.querySelector('#app'), nav = document.querySelector('#seasonNav');
const characterSelect = document.querySelector('#characterSelect');
const themeSelect = document.querySelector('#themeSelect');
const THEMES = [
    'light', 'dracula', 'glass'
];
function setTheme(mode) {
    if (!THEMES.includes(mode))
        mode = 'light';
    document.body.classList.toggle('theme-terminal', mode === 'dracula');
    document.body.classList.toggle('theme-dracula', mode === 'dracula');
    document.body.classList.toggle('theme-glass', mode === 'glass');
    document.body.classList.toggle('font-proggy', mode === 'dracula');
    if (themeSelect) {
        themeSelect.value = mode;
    }
    try {
        localStorage.setItem('fc26-theme', mode);
    }
    catch (error) {
    }
}
let initialTheme = 'light';
try {
    initialTheme = localStorage.getItem('fc26-theme') || 'light';
}
catch (error) {
}
setTheme(initialTheme);
if (themeSelect)
    themeSelect.addEventListener('change', () => setTheme(themeSelect.value));
if (characterSelect)
    characterSelect.addEventListener('change', () => {
        const selectedCharacter = characterSelect.value;
        if (!DATA[selectedCharacter])
            return;
        location.hash = `#${selectedCharacter}`;
    });
const esc = value => String(value).replace(/[&<>]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;'
}[character]));
function table(headers, rows) {
    return `<table class="wikitable"><thead><tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((cellValue, columnIndex) => `<td class="${columnIndex > 1 ? 'num' : ''}">${cellValue}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
function infobox(playerData) {
    return `<table class="infobox"><tr><th colspan="2">${playerData.flag} ${playerData.name}</th></tr>${playerData.nickname ? `<tr><td>Nickname</td><td>${playerData.nickname}</td></tr>` : ''}<tr><td>Born</td><td>${playerData.dob}<br>${playerData.birth}</td></tr><tr><td>Height</td><td>${playerData.height}</td></tr><tr><td>Boot brand</td><td>${playerData.bootBrand || 'Unknown'}</td></tr><tr><td>Position</td><td>${playerData.position}</td></tr><tr><td>Current team</td><td>${playerData.current}</td></tr><tr><td>Number</td><td>${playerData.number}</td></tr><tr><td>National team</td><td>${playerData.international}</td></tr></table>`;
}
function honours(playerData) {
    return `<div class="honours">${Object.entries(playerData.honours).map(([honourGroupName, honourItems]) => `<section><h3>${honourGroupName}</h3><ul>${honourItems.map(honour => `<li>${honour}</li>`).join('')}</ul></section>`).join('')}</div>`;
}
function cleanClubLabel(value) {
    return String(value || '').replace(/^\s*(?:[\u{1F1E6}-\u{1F1FF}]{2}|🏴[^ ]*)\s*/u, '').trim();
}
function careerGroups(playerData) {
    const groups = [];
    Object.keys(playerData.seasons).forEach(season => {
        const row = (playerData.stats || []).find(statRow => statRow[0] === season);
        const club = row ? String(row[1]) : '';
        const key = cleanClubLabel(club) || 'Career';
        let group = groups.find(candidateGroup => candidateGroup.key === key);
        if (!group) {
            group = {
                key, label: club || key, seasons: []
            };
            groups.push(group);
        }
        group.seasons.push(season);
    });
    return groups;
}
function careerNavigator(id, activeSeason = '', activePage = '') {
    const playerData = DATA[id];
    const groups = careerGroups(playerData);
    return `<div class="career-nav"><div class="career-nav-player"><span>${playerData.flag}</span><div><b>${esc(playerData.displayName || playerData.name)}</b><small>Career navigator</small></div></div><a class="career-nav-main ${!activeSeason && !activePage ? 'active' : ''}" href="#${id}">Overview</a><a class="career-nav-main ${activePage === 'timeline' ? 'active' : ''}" href="#${id}/timeline">Timeline</a><a class="career-nav-main ${activePage === 'stats' ? 'active' : ''}" href="#${id}/stats">Stats</a><a class="career-nav-main ${activePage === 'analysis' ? 'active' : ''}" href="#${id}/analysis">Head to Head</a>${groups.map(group => `<div class="career-nav-club"><div class="career-nav-clubname">${group.label}</div>${group.seasons.map(season => `<a class="${activeSeason === season ? 'active' : ''}" href="#${id}/${season}"><span>${season}</span>${playerData.seasons[season].inProgress ? '<em>Live</em>' : ''}</a>`).join('')}</div>`).join('')}</div>`;
}
function statForSeason(playerData, seasonName) {
    return (playerData.stats || []).find(statRow => statRow[0] === seasonName) || null;
}
function seasonStatStrip(playerData, seasonName, seasonData, meta) {
    const statRow = statForSeason(playerData, seasonName);
    if (!statRow)
        return '';
    const cards = [
        [
            'Role', statRow[2]
        ], [
            'League', statRow[3]
        ], [
            'Position', statRow[4]
        ], [
            'Average', statRow[5]
        ], [
            'Apps', statRow[6]
        ], [
            'Goals', statRow[7]
        ], [
            'Assists', statRow[8]
        ], [
            'CLS', statRow[9]
        ]
    ];
    return `<div class="season-kpis">${cards.map(([label, value]) => `<div><span>${label}</span><b>${value === '' || value == null ? '—' : value}</b></div>`).join('')}</div>`;
}
function player(id) {
    let playerData = DATA[id];
    app.className = 'profile-page';
    nav.innerHTML = careerNavigator(id);
    app.innerHTML = `${infobox(playerData)}
    <h1>${playerData.displayName || playerData.name}</h1>
    <p class="lede">${playerData.intro}</p>
    <div class="toc">
      <b>Contents</b>
      <ol>
        <li><a href="#career">Club career</a></li>
        <li><a href="#stats">Career statistics</a></li>
        <li><a href="#honours">Honours</a></li>
      </ol>
    </div>
    <div class="clear"></div>
    <div class="career-grid">
      <section>
        <h2 id="career">Club career</h2>
        ${table([
        'Years', 'Team', 'Apps', 'Goals'
    ], playerData.career)}
      </section>
      <section>
        <h2>International career</h2>
        ${table([
        'Years', 'Team', 'Apps', 'Goals'
    ], [
        playerData.intl
    ])}
      </section>
    </div>
    <h2 id="stats">Career statistics</h2>
    ${table([
        'Season', 'Club', 'Role', 'League', 'Pos.', 'Avg', 'Apps', 'Goals', 'Assists', 'CLS'
    ], playerData.stats)}
    <h2 id="honours">Honours</h2>
    ${honours(playerData)}`;
}

function teamFlag(teamName) {
    return TEAM_FLAGS[teamName] || '';
}

function playerFlag(name, id) {
    const playerData = DATA[id];
    if (!playerData || !playerData.squadFlags)
        return '';
    return playerData.squadFlags[name] || '';
}
function sectionId(name) {
    return 'section-' + name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function parseFixture(raw) {
    let label = '', fixtureText = raw.trim();
    if (fixtureText.includes(' — ')) {
        let labelParts = fixtureText.split(' — ');
        label = labelParts.shift();
        fixtureText = labelParts.join(' — ');
    }
    let match = fixtureText.match(/^(.+?)\s+(?:\((\d+)\)\s*)?(\d+)\s*-\s*(\d+)(?:\s*\((\d+)\))?\s+(.+)$/);
    if (!match)
        return {
            raw, label
        };
    return {
        label, home: match[1].trim(), hp: match[2] ? +match[2] : null, hg: +match[3], ag: +match[4], ap: match[5] ? +match[5] : null, away: match[6].trim()
    };
}
function focalFor(id, seasonName, comp) {
    const playerData = DATA[id];
    if (!playerData)
        return '';
    if (isInternationalCompetition(comp))
        return playerData.internationalTeam || '';
    const statRow = (playerData.stats || []).find(row => row[0] === seasonName);
    if (!statRow)
        return '';
    return canonicalTeam(cleanClubLabel(statRow[1]));
}
function sameTeam(teamA, teamB) {
    const normalizeTeamName = teamName => teamName.toLowerCase().replace(/fc |afc |& hove albion|borussia |münchen/g, '').replace(/\s+/g, ' ').trim();
    return normalizeTeamName(teamA) === normalizeTeamName(teamB) || normalizeTeamName(teamA).includes(normalizeTeamName(teamB)) || normalizeTeamName(teamB).includes(normalizeTeamName(teamA));
}
function outcome(fixture, focal) {
    if (!fixture.home || (!sameTeam(fixture.home, focal) && !sameTeam(fixture.away, focal)))
        return 'neutral';
    let homeWin = fixture.hg > fixture.ag, awayWin = fixture.ag > fixture.hg;
    if (fixture.hg === fixture.ag && fixture.hp != null && fixture.ap != null) {
        homeWin = fixture.hp > fixture.ap;
        awayWin = fixture.ap > fixture.hp;
    }
    if (!homeWin && !awayWin)
        return 'draw';
    let focalHome = sameTeam(fixture.home, focal);
    return (focalHome && homeWin) || (!focalHome && awayWin) ? 'win' : 'loss';
}

function tournamentRounds(comp, items, id, seasonName) {
    const playerRoundBreaks = DATA[id] && DATA[id].uefaRoundBreaks ? DATA[id].uefaRoundBreaks : {};
    const uefa = playerRoundBreaks[`${seasonName}|${comp}`];
    if (uefa)
        return uefa;
    if (comp === 'Euros' && items.length >= 18)
        return {
            0: 'Group stage', 3: 'Round of 16', 11: 'Quarter-finals', 15: 'Semi-finals', 17: 'Final'
        };
    if (comp === 'World Cup' && items.length >= 35)
        return {
            0: 'Group stage', 3: 'Round of 32', 19: 'Round of 16', 27: 'Quarter-finals', 31: 'Semi-finals', 33: 'Third-place play-off', 34: 'Final'
        };
    return {};
}
function fixtureTable(items, focal, comp, id, seasonName) {
    let breaks = tournamentRounds(comp, items, id, seasonName);
    let rows = items.map((raw, fixtureIndex) => {
        let heading = breaks[fixtureIndex] ? `<tr class="round-separator"><th colspan="6">${breaks[fixtureIndex]}</th></tr>` : '';
        if (/^Quarter Finals \(agg\)$/i.test(String(raw).trim()))
            return heading + `<tr class="round-separator"><th colspan="6">${esc(String(raw).trim())}</th></tr>`;
        let fixture = parseFixture(raw);
        let roundEnd = (fixtureIndex === items.length - 1 || breaks[fixtureIndex + 1]) ? ' round-end' : '';
        if (!fixture.home)
            return heading + `<tr class="${roundEnd.trim()}"><td colspan="5">${esc(raw)}</td><td class="marker neutral"></td></tr>`;
        let score = `${fixture.hp != null ? `(${fixture.hp}) ` : ''}${fixture.hg} - ${fixture.ag}${fixture.ap != null ? ` (${fixture.ap})` : ''}`;
        let title = fixture.label ? ` title="${esc(fixture.label)}"` : '';
        let homeWin = fixture.hg > fixture.ag, awayWin = fixture.ag > fixture.hg;
        if (fixture.hg === fixture.ag && fixture.hp != null && fixture.ap != null) {
            homeWin = fixture.hp > fixture.ap;
            awayWin = fixture.ap > fixture.hp;
        }
        let homeClass = homeWin ? ' winner' : '', awayClass = awayWin ? ' winner' : '';
        return heading + `<tr class="fixture-match${roundEnd}"${title}><td class="flag">${teamFlag(fixture.home)}</td><td class="team home${homeClass}">${esc(fixture.home)}</td><td class="scorecell">${score}</td><td class="team away${awayClass}">${esc(fixture.away)}</td><td class="flag">${teamFlag(fixture.away)}</td><td class="marker ${outcome(fixture, focal)}"></td></tr>`;
    }).join('');
    return `<table class="fixture-table"><tbody>${rows}</tbody></table>`;
}
function cleanTeamName(teamName) {
    return String(teamName).replace(/\s*[🥇🥈🥉🏆]+\s*$/u, '').trim();
}
function standingsTable(meta, inProgress) {
    if (!meta || !meta.standings || !meta.standings.length)
        return '<p class="muted">No league standings were populated in the supplied season sheet.</p>';
    const focusClub = canonicalTeam(meta.club || '');
    let rows = meta.standings.map(standingRow => {
        const rowClub = canonicalTeam(cleanTeamName(standingRow[1]));
        return `<tr class="${rowClub === focusClub ? 'focus-team' : ''}"><td class="stand-pos">${esc(standingRow[0])}</td><td class="flag">${teamFlag(cleanTeamName(standingRow[1]))}</td><td class="stand-team">${esc(standingRow[1])}</td>${standingRow.slice(2).map(value => `<td class="num">${value === '' ? '' : esc(value)}</td>`).join('')}</tr>`;
    }).join('');
    return `${inProgress ? '<p class="table-note">In-progress table: incomplete cells are preserved from the supplied sheet.</p>' : ''}<div class="table-scroll"><table class="wikitable standings-table"><thead><tr><th>Pos</th><th></th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function competitionLeagueTable(data, focal, title = 'Standings') {
    if (!data || !data.rows || !data.rows.length)
        return '';
    const focus = canonicalTeam(focal || '');
    const rows = data.rows.map(standingRow => {
        const team = canonicalTeam(cleanTeamName(standingRow[1]));
        return `<tr class="${team === focus ? 'focus-team' : ''}"><td>${esc(standingRow[0])}</td><td class="flag">${teamFlag(standingRow[1])}</td><td class="stand-team">${esc(standingRow[1])}</td>${standingRow.slice(2).map(value => `<td class="num">${value === '' ? '' : esc(value)}</td>`).join('')}</tr>`;
    }).join('');
    return `<div class="competition-side-table"><div class="panel-kicker">${esc(title)}</div><div class="table-scroll"><table class="wikitable standings-table comp-standings"><thead><tr><th>Pos</th><th></th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
function competitionGroupTables(data, focal) {
    if (!data || !data.groups || !data.groups.length)
        return '';
    const focus = canonicalTeam(focal || '');
    return `<div class="competition-side-table group-tables"><div class="panel-kicker">Group tables</div>${data.groups.map(group => {
        const rows = group.rows.map(standingRow => {
            const team = canonicalTeam(cleanTeamName(standingRow[1]));
            return `<tr class="${team === focus ? 'focus-team' : ''}"><td>${esc(standingRow[0])}</td><td class="flag">${teamFlag(standingRow[1])}</td><td class="stand-team">${esc(standingRow[1])}</td>${standingRow.slice(2).map(value => `<td class="num">${value === '' ? '' : esc(value)}</td>`).join('')}</tr>`;
        }).join('');
        return `<div class="group-table-block"><h3>${esc(group.name)}</h3><div class="table-scroll"><table class="wikitable standings-table group-table"><thead><tr><th>Pos</th><th></th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
    }).join('')}</div>`;
}
function competitionSideTable(id, seasonName, comp, meta) {
    const focal = focalFor(id, seasonName, comp);
    if (comp === 'Pre-season friendlies') {
        const pre = (typeof PRESEASON_TABLES !== 'undefined' && PRESEASON_TABLES[id] && PRESEASON_TABLES[id][seasonName]) || null;
        if (pre)
            return competitionLeagueTable(pre, meta && meta.club ? meta.club : focal, 'Pre-season table');
    }
    if (meta && meta.league && comp === meta.league && meta.standings && meta.standings.length) {
        return competitionLeagueTable({
            rows: meta.standings
        }, meta.club, `${meta.league} table`);
    }
    const data = (typeof COMPETITION_TABLES !== 'undefined' && COMPETITION_TABLES[id] && COMPETITION_TABLES[id][seasonName] && COMPETITION_TABLES[id][seasonName][comp]) || null;
    if (!data)
        return '';
    return data.type === 'groups' ? competitionGroupTables(data, focal) : competitionLeagueTable(data, focal, 'League phase table');
}
function squadTable(meta, id, inProgress) {
    if (!meta || !meta.squad || !meta.squad.length)
        return `<p class="muted">${inProgress ? 'The player list has not yet been populated in the supplied in-progress season sheet.' : 'No player list was populated in the supplied season sheet.'}</p>`;
    const target = DATA[id].squadFocusName || DATA[id].displayName || DATA[id].name;
    let rows = meta.squad.map(squadRow => `<tr class="${squadRow[2].includes(target) ? 'focus-player' : ''}"><td>${esc(squadRow[0])}</td><td class="player-nation">${playerFlag(squadRow[2].replace(' ⭐', ''), id)}</td><td class="num">${esc(squadRow[1])}</td><td class="squad-name${squadRow[2].replace(' ⭐', '').length > 20 ? ' compact-name' : ''}">${esc(squadRow[2])}</td>${squadRow.slice(3).map(value => `<td class="num">${value === '' ? '' : esc(value)}</td>`).join('')}</tr>`).join('');
    return `${inProgress ? '<p class="table-note">In-progress player list: blank statistics are preserved from the supplied sheet.</p>' : ''}<div class="table-scroll"><table class="wikitable squad-table"><thead><tr><th>Pos</th><th title="Nationality">Nat.</th><th>No.</th><th>Name</th><th>App</th><th>Goals</th><th>Asst</th><th>CLS</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function canonicalTeam(teamName) {
    let normalizedTeamName = cleanTeamName(teamName);
    return TEAM_ALIASES[normalizedTeamName] || normalizedTeamName;
}
function isInternationalCompetition(comp) {
    return /World Cup|Euros|Qualif|International Friendlies/i.test(comp);
}
function careerOpponentRows(id) {
    const seasons = FULL_FIXTURES[id] || {}, rec = new Map(), seenTournament = new Set();
    Object.entries(seasons).forEach(([season, competitions]) => Object.entries(competitions || {}).forEach(([comp, items]) => {
        const focal = focalFor(id, season, comp);
        if (!focal)
            return;
        (items || []).forEach(raw => {
            const fixture = parseFixture(raw);
            if (!fixture.home)
                return;
            const focalHome = sameTeam(fixture.home, focal), focalAway = sameTeam(fixture.away, focal);
            if (!focalHome && !focalAway)
                return;
            // World Cups/Euros in the supplied sheets can straddle two season pages; do not count copied-over matches twice.
            if (/World Cup|Euros(?:$|\s)/i.test(comp)) {
                const dedupe = `${comp}|${raw.replace(/^.*? — /, '')}`;
                if (seenTournament.has(dedupe))
                    return;
                seenTournament.add(dedupe);
            }
            const opponent = canonicalTeam(focalHome ? fixture.away : fixture.home), key = opponent.toLowerCase();
            if (!rec.has(key))
                rec.set(key, {
                    opponent, played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, seasons: new Set(), represented: new Set(), international: 0, club: 0
                });
            const opponentRecord = rec.get(key), matchOutcome = outcome(fixture, focal);
            opponentRecord.played++;
            opponentRecord.seasons.add(season);
            opponentRecord.represented.add(canonicalTeam(focal));
            if (isInternationalCompetition(comp))
                opponentRecord.international++;
            else
                opponentRecord.club++;
            const gf = focalHome ? fixture.hg : fixture.ag, ga = focalHome ? fixture.ag : fixture.hg;
            opponentRecord.gf += gf;
            opponentRecord.ga += ga;
            if (matchOutcome === 'win')
                opponentRecord.wins++;
            else if (matchOutcome === 'loss')
                opponentRecord.losses++;
            else
                opponentRecord.draws++;
        });
    }));
    return [
        ...rec.values()
    ].map(opponentRecord => ({
        ...opponentRecord, gd: opponentRecord.gf - opponentRecord.ga, winPct: opponentRecord.played ? 100 * opponentRecord.wins / opponentRecord.played : 0, type: opponentRecord.international && !opponentRecord.club ? 'International' : opponentRecord.club && !opponentRecord.international ? 'Club' : 'Mixed', representedLabel: [
            ...opponentRecord.represented
        ].join(', ')
    }))
        .sort((firstRecord, secondRecord) => secondRecord.wins - firstRecord.wins || secondRecord.winPct - firstRecord.winPct || secondRecord.played - firstRecord.played || (firstRecord.opponent.localeCompare(secondRecord.opponent)));
}
function careerAnalysis(id) {
    app.className = 'analysis-page';
    const playerData = DATA[id], rows = careerOpponentRows(id), totals = rows.reduce((totalsAccumulator, opponentRecord) => ({
        played: totalsAccumulator.played + opponentRecord.played, wins: totalsAccumulator.wins + opponentRecord.wins, draws: totalsAccumulator.draws + opponentRecord.draws, losses: totalsAccumulator.losses + opponentRecord.losses, gf: totalsAccumulator.gf + opponentRecord.gf, ga: totalsAccumulator.ga + opponentRecord.ga
    }), {
        played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0
    });
    nav.innerHTML = careerNavigator(id, '', 'analysis');
    let body = rows.map((opponentRecord, rowIndex) => `<tr><td class="rank">${rowIndex + 1}</td><td class="flag">${teamFlag(opponentRecord.opponent)}</td><td class="opponent">${esc(opponentRecord.opponent)}</td><td class="represented">${esc(opponentRecord.representedLabel)}</td><td>${opponentRecord.type}</td><td class="num">${opponentRecord.played}</td><td class="num">${opponentRecord.wins}</td><td class="num">${opponentRecord.draws}</td><td class="num">${opponentRecord.losses}</td><td class="num">${opponentRecord.gf}</td><td class="num">${opponentRecord.ga}</td><td class="num">${opponentRecord.gd > 0 ? '+' : ''}${opponentRecord.gd}</td><td class="num">${opponentRecord.winPct.toFixed(1)}%</td></tr>`).join('');
    const rate = totals.played ? 100 * totals.wins / totals.played : 0;
    app.innerHTML = `<p><a href="#${id}">← ${playerData.name}</a></p><h1>${playerData.flag} ${playerData.name.split(' ')[0]} vs Teams</h1><p class="lede">Combined head-to-head record against every opponent across ${playerData.name}'s recorded career, regardless of which club or national team ${playerData.name.split(' ')[0]} was representing. Ranked by most wins by default.</p><div class="analysis-summary"><div><b>${rows.length}</b><span>Opponents</span></div><div><b>${totals.played}</b><span>Matches</span></div><div><b>${totals.wins}</b><span>Wins</span></div><div><b>${totals.draws}</b><span>Draws</span></div><div><b>${totals.losses}</b><span>Losses</span></div><div><b>${rate.toFixed(1)}%</b><span>Win rate</span></div></div><div class="note analysis-note">Penalty shoot-outs are treated as wins or losses for the result record; goals for/against use the match score before the shoot-out. Repeated World Cup/Euros fixtures carried over between adjacent season pages are counted once.</div><div class="table-scroll"><table class="wikitable analysis-table"><thead><tr><th>#</th><th></th><th>Opponent</th><th>Represented</th><th>Type</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Win %</th></tr></thead><tbody>${body}</tbody></table></div>`;
}
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
            joined: [], left: [], note: 'Club changed — squad comparison resets for the new club.'
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
function timelineCupFinals(id, season) {
    const manualFinals = DATA[id].timelineManualFinals || {};
    const out = manualFinals[season] ? [
        ...manualFinals[season]
    ] : [];
    const comps = (FULL_FIXTURES[id] && FULL_FIXTURES[id][season]) || {};
    Object.entries(comps).forEach(([comp, items]) => {
        if (comp === 'Pre-season friendlies' || out.some(existingFinal => existingFinal.comp === comp))
            return;
        const finalRaw = (items || []).find(fixtureText => /^F\s+—\s+/i.test(String(fixtureText).trim()));
        if (!finalRaw)
            return;
        const fixture = parseFixture(finalRaw);
        if (!fixture.home)
            return;
        let winner = '', runner = '', score = `${fixture.hg} - ${fixture.ag}`;
        if (fixture.hg > fixture.ag) {
            winner = fixture.home;
            runner = fixture.away;
        }
        else if (fixture.ag > fixture.hg) {
            winner = fixture.away;
            runner = fixture.home;
        }
        else if (fixture.hp != null && fixture.ap != null) {
            winner = fixture.hp > fixture.ap ? fixture.home : fixture.away;
            runner = fixture.hp > fixture.ap ? fixture.away : fixture.home;
        }
        if (winner)
            out.push({
                comp, winner, runner, score
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
    return meta && meta.standings && meta.standings.length ? meta.standings.slice(0, 5) : [];
}
function timelineLeagueMovement(id, season, previousSeason) {
    const currentMeta = (typeof SEASON_TABLES !== 'undefined' && SEASON_TABLES[id] && SEASON_TABLES[id][season]) || null;
    const previousMeta = previousSeason
        ? (typeof SEASON_TABLES !== 'undefined' && SEASON_TABLES[id] && SEASON_TABLES[id][previousSeason]) || null
        : null;

    if (!currentMeta || !currentMeta.standings || !currentMeta.standings.length)
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
        const stat = statForSeason(playerData, season), club = meta && meta.club ? meta.club : (stat ? cleanClubLabel(stat[1]) : '');
        const top = timelineTopFive(id, season);
        const cups = timelineCupFinals(id, season);
        const moves = timelineSquadChanges(id, season, seasons[seasonIndex - 1]);
        const leagueMovement = timelineLeagueMovement(id, season, seasons[seasonIndex - 1]);

        const topHtml = top.length ? `<ol class="timeline-topfive">${top.map(standingRow => `<li class="${canonicalTeam(cleanTeamName(standingRow[1])) === canonicalTeam(meta && meta.club ? meta.club : '') ? 'focus' : ''}"><span>${teamFlag(cleanTeamName(standingRow[1]))} ${esc(standingRow[1])}</span><b>${standingRow[9] !== '' && standingRow[9] != null ? esc(standingRow[9]) + ' pts' : ''}</b></li>`).join('')}</ol>` : '<p class="muted">No league table supplied.</p>';
        const cupHtml = cups.length ? cups.map(cupFinal => `<div class="timeline-cup"><b>${esc(cupFinal.comp)}</b><span>Winner: ${teamFlag(cupFinal.winner)} ${esc(cupFinal.winner)}</span><span>Runner-up: ${teamFlag(cupFinal.runner)} ${esc(cupFinal.runner)}</span></div>`).join('') : '<p class="muted">No recorded cup final for this season.</p>';
        const moveHtml = moves.note ? `<p class="muted">${esc(moves.note)}</p>` : `<div class="timeline-moves"><div><b>Joined</b>${moves.joined.length ? `<ul>${moves.joined.map(playerName => `<li>+ ${esc(playerName)}</li>`).join('')}</ul>` : '<span class="muted">None recorded</span>'}</div><div><b>Left</b>${moves.left.length ? `<ul>${moves.left.map(playerName => `<li>− ${esc(playerName)}</li>`).join('')}</ul>` : '<span class="muted">None recorded</span>'}</div></div>`;
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

        const leagueMovementHtml = leagueMovement
            ? `<div class="timeline-league-movement"><div><b>Entered</b>${enteredHtml}</div><div><b>Relegated</b>${relegatedHtml}</div></div>`
            : '<p class="muted">No league table supplied.</p>';

        return `<article class="timeline-season-card"><a class="timeline-dot" href="#${id}/${season}" aria-label="Open ${season} season"></a><div class="timeline-season-head"><span>${season}</span>${playerData.seasons[season].inProgress ? '<em>Live</em>' : ''}</div><h2>${club ? `${teamFlag(club)} ${esc(club)}` : 'Career season'}</h2><section><h3>League top 5</h3>${topHtml}</section><section><h3>Cup finals</h3>${cupHtml}</section><section><h3>League movement</h3>${leagueMovementHtml}</section><section><h3>Squad movement</h3>${moveHtml}</section></article>`;
    }).join('');
    app.innerHTML = `<div class="timeline-wrap"><p><a href="#${id}">← ${esc(playerData.displayName || playerData.name)}</a></p><h1>${playerData.flag} ${esc(playerData.displayName || playerData.name)} — Career timeline</h1><p class="lede">Season-by-season view of league leaders, league movement, recorded cup finals and squad changes. Entered teams are derived by comparing a season with the previous supplied table for the same league; relegated teams come from that season's defined direct relegation places. Squad movement is calculated from consecutive supplied player lists and resets when the player changes club.</p><div class="timeline-scroll"><div class="career-timeline">${cards}</div></div></div>`;
}

function numericStat(value) {
    if (typeof value === 'number' && Number.isFinite(value))
        return value;
    const text = String(value == null ? '' : value).trim();
    if (!text || text === '—' || /^in progress$/i.test(text))
        return null;
    const parsed = Number(text);
    return Number.isFinite(parsed) ? parsed : null;
}
function numericPosition(value) {
    const match = String(value == null ? '' : value).match(/(\d+)/);
    return match ? Number(match[1]) : null;
}
function ordinal(value) {
    if (!Number.isFinite(value))
        return '—';
    const moduloTen = value % 10;
    const moduloHundred = value % 100;
    if (moduloTen === 1 && moduloHundred !== 11)
        return `${value}st`;
    if (moduloTen === 2 && moduloHundred !== 12)
        return `${value}nd`;
    if (moduloTen === 3 && moduloHundred !== 13)
        return `${value}rd`;
    return `${value}th`;
}
function statHistory(playerData) {
    return (playerData.stats || []).map(statRow => ({
        season: statRow[0],
        club: cleanClubLabel(statRow[1]),
        league: statRow[3],
        goals: numericStat(statRow[7]),
        assists: numericStat(statRow[8]),
        cleanSheets: numericStat(statRow[9]),
        position: numericPosition(statRow[4]),
        positionLabel: statRow[4]
    }));
}
function niceMetric(value) {
    return value == null ? '—' : String(value);
}
function metricScale(values) {
    const validValues = values.filter(value => Number.isFinite(value));
    const maxValue = validValues.length ? Math.max(...validValues) : 0;
    if (maxValue <= 5)
        return 5;
    if (maxValue <= 10)
        return 10;
    return Math.ceil(maxValue / 5) * 5;
}
function barChartSvg(points, options = {}) {
    const width = 760;
    const height = 280;
    const padding = { top: 20, right: 16, bottom: 60, left: 44 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const values = points.map(point => point.value);
    const maxValue = metricScale(values);
    const count = Math.max(points.length, 1);
    const step = plotWidth / count;
    const barWidth = Math.min(48, Math.max(20, step * 0.52));
    const ticks = [0, maxValue / 2, maxValue].map(value => Math.round(value));
    const gridLines = ticks.map(value => {
        const y = padding.top + plotHeight - (value / maxValue) * plotHeight;
        return `<g class="chart-grid-group"><line class="chart-grid" x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}"></line><text class="chart-axis-label" x="${padding.left - 8}" y="${y + 4}" text-anchor="end">${value}</text></g>`;
    }).join('');
    const bars = points.map((point, index) => {
        const value = Number.isFinite(point.value) ? point.value : 0;
        const barHeight = maxValue ? (value / maxValue) * plotHeight : 0;
        const x = padding.left + index * step + (step - barWidth) / 2;
        const y = padding.top + plotHeight - barHeight;
        const labelX = padding.left + index * step + step / 2;
        return `<g class="chart-bar-group"><rect class="chart-bar ${options.className || ''}" x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="5"></rect><text class="chart-value-label" x="${labelX}" y="${Math.max(padding.top + 12, y - 8)}" text-anchor="middle">${value}</text><text class="chart-axis-label chart-season-label" x="${labelX}" y="${height - 18}" text-anchor="middle">${esc(point.label)}</text></g>`;
    }).join('');
    return `<svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(options.ariaLabel || options.title || 'Career chart')}"><line class="chart-axis" x1="${padding.left}" y1="${padding.top + plotHeight}" x2="${width - padding.right}" y2="${padding.top + plotHeight}"></line><line class="chart-axis" x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + plotHeight}"></line>${gridLines}${bars}</svg>`;
}
function positionChartSvg(points, options = {}) {
    const validPoints = points.filter(point => Number.isFinite(point.value));
    if (!validPoints.length)
        return '<div class="chart-empty">No league position data recorded yet.</div>';
    const width = 760;
    const height = 280;
    const padding = { top: 20, right: 16, bottom: 60, left: 48 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const maxPosition = Math.max(...validPoints.map(point => point.value), 5);
    const xStep = validPoints.length > 1 ? plotWidth / (validPoints.length - 1) : 0;
    const positionY = value => {
        if (maxPosition <= 1)
            return padding.top + plotHeight / 2;
        return padding.top + ((value - 1) / (maxPosition - 1)) * plotHeight;
    };
    const tickValues = Array.from(new Set([1, Math.ceil((1 + maxPosition) / 2), maxPosition])).sort((first, second) => first - second);
    const gridLines = tickValues.map(value => {
        const y = positionY(value);
        return `<g class="chart-grid-group"><line class="chart-grid" x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}"></line><text class="chart-axis-label" x="${padding.left - 8}" y="${y + 4}" text-anchor="end">${ordinal(value)}</text></g>`;
    }).join('');
    const pointsWithCoords = validPoints.map((point, index) => ({
        ...point,
        x: padding.left + index * xStep,
        y: positionY(point.value)
    }));
    const path = pointsWithCoords.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const pointMarkup = pointsWithCoords.map(point => `<g class="chart-point-group"><circle class="chart-point ${options.className || ''}" cx="${point.x}" cy="${point.y}" r="5"></circle><text class="chart-value-label" x="${point.x}" y="${Math.max(14, point.y - 10)}" text-anchor="middle">${ordinal(point.value)}</text><text class="chart-axis-label chart-season-label" x="${point.x}" y="${height - 18}" text-anchor="middle">${esc(point.label)}</text></g>`).join('');
    return `<svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(options.ariaLabel || options.title || 'League position chart')}"><line class="chart-axis" x1="${padding.left}" y1="${padding.top + plotHeight}" x2="${width - padding.right}" y2="${padding.top + plotHeight}"></line><line class="chart-axis" x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + plotHeight}"></line>${gridLines}<path class="chart-line ${options.className || ''}" d="${path}"></path>${pointMarkup}</svg>`;
}
function chartCard(title, subtitle, chartMarkup) {
    return `<section class="chart-card season-card"><div class="panel-kicker">Visualisation</div><h2>${title}</h2><p class="chart-note">${subtitle}</p>${chartMarkup}</section>`;
}
function careerStats(id) {
    app.className = 'stats-page';
    const playerData = DATA[id];
    const history = statHistory(playerData);
    nav.innerHTML = careerNavigator(id, '', 'stats');
    const seasonLabels = history.map(seasonRow => seasonRow.season);
    const goalsPoints = history.filter(seasonRow => Number.isFinite(seasonRow.goals)).map(seasonRow => ({ label: seasonRow.season, value: seasonRow.goals }));
    const assistsPoints = history.filter(seasonRow => Number.isFinite(seasonRow.assists)).map(seasonRow => ({ label: seasonRow.season, value: seasonRow.assists }));
    const cleanSheetPoints = history.filter(seasonRow => Number.isFinite(seasonRow.cleanSheets)).map(seasonRow => ({ label: seasonRow.season, value: seasonRow.cleanSheets }));
    const positionPoints = history.filter(seasonRow => Number.isFinite(seasonRow.position)).map(seasonRow => ({ label: seasonRow.season, value: seasonRow.position }));
    const summaryRows = history.map(seasonRow => [
        seasonRow.season,
        seasonRow.club,
        niceMetric(seasonRow.goals),
        niceMetric(seasonRow.assists),
        niceMetric(seasonRow.cleanSheets),
        seasonRow.positionLabel || '—'
    ]);
    app.innerHTML = `<div class="stats-wrap"><p><a href="#${id}">← ${esc(playerData.displayName || playerData.name)}</a></p><h1>${playerData.flag} ${esc(playerData.displayName || playerData.name)} — Stats</h1><p class="lede">Visual summary of recorded career output by season. These charts use the same season-by-season stats shown on the overview page, focusing on goals, assists, clean sheets and league finishing position.</p><div class="stats-grid">${chartCard('Goals per season', 'Recorded goals in each supplied season.', barChartSvg(goalsPoints, { className: 'chart-goals', title: 'Goals per season' }))}${chartCard('Assists per season', 'Recorded assists in each supplied season.', barChartSvg(assistsPoints, { className: 'chart-assists', title: 'Assists per season' }))}${chartCard('Clean sheets per season', 'Recorded clean sheets or clean-sheet tally (CLS) for each season.', barChartSvg(cleanSheetPoints, { className: 'chart-clean-sheets', title: 'Clean sheets per season' }))}${chartCard('League finishing position', 'Lower is better: 1st place is shown at the top of the chart.', positionChartSvg(positionPoints, { className: 'chart-position', title: 'League finishing position by season' }))}</div><section class="stats-summary season-card"><div class="panel-kicker">Source data</div><h2>Season totals</h2>${table(['Season', 'Club', 'Goals', 'Assists', 'CLS', 'League finish'], summaryRows)}</section></div>`;
}
function season(id, seasonName) {
    app.className = 'season-view';
    let playerData = DATA[id], seasonData = playerData.seasons[seasonName], full = (FULL_FIXTURES[id] && FULL_FIXTURES[id][seasonName]) || {}, meta = (typeof SEASON_TABLES !== 'undefined' && SEASON_TABLES[id] && SEASON_TABLES[id][seasonName]) || null;
    nav.innerHTML = careerNavigator(id, seasonName);
    let entries = Object.entries(full).filter(([competitionName, fixtures]) => fixtures.length);
    const sideLeagueSeason = !!(meta && meta.league && full[meta.league] && meta.standings && meta.standings.length);
    let jumpItems = [
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
    let jump = `<nav class="season-jump season-tabs-nav"><b>Season navigation</b><div>${jumpItems.map(([sid, label]) => `<a href="#${sid}" onclick="event.preventDefault();const el=document.getElementById('${sid}');if(el)el.scrollIntoView({behavior:'smooth',block:'start'})">${label}</a>`).join('')}</div></nav>`;
    let blocks = entries.map(([competitionName, fixtures]) => {
        const side = competitionSideTable(id, seasonName, competitionName, meta);
        const leagueId = (sideLeagueSeason && meta && competitionName === meta.league) ? ' id="league-table"' : '';
        if (side) {
            return `<div class="competition-pair" id="${sectionId(competitionName)}"><section class="competition season-competition competition-fixture-panel"><div class="competition-heading"><h2>${competitionName}</h2><a href="#season-overview" onclick="event.preventDefault();document.getElementById('season-overview').scrollIntoView({behavior:'smooth'})">Back to top ↑</a></div><div class="competition-fixtures">${fixtureTable(fixtures, focalFor(id, seasonName, competitionName), competitionName, id, seasonName)}</div></section><aside class="competition-standings-panel"${leagueId}>${side}</aside></div>`;
        }
        return `<section class="competition season-competition" id="${sectionId(competitionName)}"><div class="competition-heading"><h2>${competitionName}</h2><a href="#season-overview" onclick="event.preventDefault();document.getElementById('season-overview').scrollIntoView({behavior:'smooth'})">Back to top ↑</a></div><div class="competition-fixtures">${fixtureTable(fixtures, focalFor(id, seasonName, competitionName), competitionName, id, seasonName)}</div></section>`;
    }).join('');
    let leaguePanel = sideLeagueSeason ? '' : `<section class="season-data-panel season-card" id="league-table"><div class="panel-kicker">Standings</div><h2>${meta ? esc(meta.league) : 'League'} table</h2>${standingsTable(meta, seasonData.inProgress)}</section>`;
    let dataTables = `<div class="season-data-grid${sideLeagueSeason ? ' squad-only' : ''}">${leaguePanel}<section class="season-data-panel season-card" id="player-list"><div class="panel-kicker">Squad</div><h2>Player list${meta && meta.club ? ` — ${esc(meta.club)}` : ''}</h2>${squadTable(meta, id, seasonData.inProgress)}</section></div>`;
    const stat = statForSeason(playerData, seasonName), club = meta && meta.club ? meta.club : (stat ? cleanClubLabel(stat[1]) : ''), league = meta && meta.league ? meta.league : (stat ? stat[3] : '');
    app.innerHTML = `<div class="season-page"><section class="season-hero" id="season-overview"><div class="season-breadcrumb"><a href="#${id}">${esc(playerData.name)}</a><span>›</span><span>${seasonName}</span></div><div class="season-title-row"><div><div class="season-eyebrow">${club ? `${teamFlag(club)} ${esc(club)}` : 'Career season'}</div><h1>${seasonName}</h1><p class="season-subtitle">${league ? esc(league) + ' · ' : ''}${esc(playerData.name)}${seasonData.inProgress ? ' · In progress' : ''}</p></div>${seasonData.inProgress ? '<span class="season-live">In progress</span>' : ''}</div><p class="lede season-summary">${seasonData.summary}</p>${seasonStatStrip(playerData, seasonName, seasonData, meta)}<div class="season-record"><span>League record</span><b>${seasonData.table}</b></div></section>${jump}${dataTables}<div class="season-results-head"><div><div class="panel-kicker">Match archive</div><h2>Competitions & results</h2></div><p>Green = win, amber = draw, red = loss. Grey marks tournament results not involving the player's team.</p></div>${blocks || '<p>No scored fixtures have been recorded yet.</p>'}</div>`;
}
function tableCellValue(row, index) {
    const cell = row.cells[index];
    if (!cell)
        return '';
    return (cell.dataset.sortValue || cell.textContent || '').trim();
}
function sortableValue(value) {
    const raw = String(value || '').trim().replace(/,/g, '');
    const pct = raw.endsWith('%') ? raw.slice(0, -1) : raw;
    const signed = pct.replace(/^\+/, '');
    if (/^[-+]?\d+(?:\.\d+)?$/.test(signed))
        return {
            type: 'number', value: Number(signed)
        };
    const pos = raw.match(/^(\d+)(?:st|nd|rd|th)$/i);
    if (pos)
        return {
            type: 'number', value: Number(pos[1])
        };
    return {
        type: 'text', value: raw.toLocaleLowerCase()
    };
}
function enhanceTable(table) {
    if (table.dataset.tableTools === '1' || !table.tHead || !table.tHead.rows.length)
        return;
    const header = table.tHead.rows[0];
    const heads = [
        ...header.cells
    ];
    if (!heads.length || heads.some(th => th.colSpan > 1))
        return;
    table.dataset.tableTools = '1';
    table.classList.add('interactive-table');
    const tbody = table.tBodies[0];
    if (!tbody)
        return;
    heads.forEach((th, index) => {
        th.classList.add('sortable-head');
        th.dataset.column = String(index);
        th.dataset.label = (th.textContent || '').trim();
        const indicator = document.createElement('span');
        indicator.className = 'sort-indicator';
        indicator.setAttribute('aria-hidden', 'true');
        indicator.textContent = '↕';
        th.appendChild(indicator);
        th.title = (th.dataset.label ? `Sort by ${th.dataset.label}` : 'Sort this column');
        th.addEventListener('click', ev => {
            if (ev.target.closest('input,select,button'))
                return;
            const current = th.dataset.sortDir || '';
            const dir = current === 'asc' ? 'desc' : 'asc';
            heads.forEach(heading => {
                heading.dataset.sortDir = '';
                const sortIndicator = heading.querySelector('.sort-indicator');
                if (sortIndicator)
                    sortIndicator.textContent = '↕';
            });
            th.dataset.sortDir = dir;
            indicator.textContent = dir === 'asc' ? '↑' : '↓';
            const rows = [
                ...tbody.rows
            ].filter(row => !row.classList.contains('round-separator'));
            rows.sort((firstRow, secondRow) => {
                const av = sortableValue(tableCellValue(firstRow, index)), bv = sortableValue(tableCellValue(secondRow, index));
                let cmp;
                if (av.type === 'number' && bv.type === 'number')
                    cmp = av.value - bv.value;
                else
                    cmp = String(av.value).localeCompare(String(bv.value), undefined, {
                        numeric: true, sensitivity: 'base'
                    });
                return dir === 'asc' ? cmp : -cmp;
            });
            rows.forEach(row => tbody.appendChild(row));
            // Refresh rank numbers on ranking tables after a user sort.
            if (table.classList.contains('analysis-table'))
                rows.forEach((row, rowIndex) => {
                    const rankCell = row.querySelector('.rank');
                    if (rankCell)
                        rankCell.textContent = String(rowIndex + 1);
                });
        });
    });
}
function enhanceTables(root = document) {
    root.querySelectorAll('table').forEach(enhanceTable);
}
const tableObserver = new MutationObserver(() => enhanceTables(app));
tableObserver.observe(app, {
    childList: true, subtree: true
});
function home() {
    app.className = 'home-page';
    nav.innerHTML = '';
    const homePlayerIds = Object.keys(DATA);
    app.innerHTML = `<h1>FC26 Career Wiki</h1><div class="home-tiles">${homePlayerIds.map(id => {
        const playerData = DATA[id];
        return `<a class="home-player-tile" href="#${id}" style="--club-crest:url('${playerData.homeCrest || ''}')"><span>${playerData.flag} ${playerData.displayName || playerData.name}</span></a>`;
    }).join('')}</div>`;
}
function route() {
    let routePath = decodeURIComponent(location.hash.slice(1) || 'home'), [id, pageName] = routePath.split('/');
    if (characterSelect)
        characterSelect.value = DATA[id] ? id : '';
    if (id === 'home')
        home();
    else if (DATA[id] && pageName === 'analysis')
        careerAnalysis(id);
    else if (DATA[id] && pageName === 'timeline')
        careerTimeline(id);
    else if (DATA[id] && pageName === 'stats')
        careerStats(id);
    else if (DATA[id] && pageName && DATA[id].seasons[pageName])
        season(id, pageName);
    else if (DATA[id])
        player(id);
    else
        home();
    window.scrollTo(0, 0);
}
addEventListener('hashchange', route);
route();


function updateTopPlayerShortcuts() {
    const hash = (location.hash || '#home').toLowerCase();
    const isMain = hash === '' || hash === '#main' || hash === '#home';
    document.querySelectorAll('aside > nav:first-of-type a[data-page]').forEach(link => {
        link.style.display = isMain ? '' : 'none';
    });
}
window.addEventListener('hashchange', () => setTimeout(updateTopPlayerShortcuts, 0));
document.addEventListener('DOMContentLoaded', () => setTimeout(updateTopPlayerShortcuts, 0));
setTimeout(updateTopPlayerShortcuts, 0);
