// Fixture rendering, standings, squads and Head to Head calculations.
// Loaded before app.js; shared functions remain available to the other scripts.

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
    if (/^Euros(?:\s+\d{4})?$/.test(comp) && items.length >= 18)
        return {
            0: 'Group stage', 3: 'Round of 16', 11: 'Quarter-finals', 15: 'Semi-finals', 17: 'Final'
        };
    if (/^World Cup(?:\s+\d{4})?$/.test(comp) && items.length >= 35)
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
// League phases and group tables use the same column order and highlighted row.
function competitionStandingsRows(rows, focal) {
    const focus = canonicalTeam(focal || '');
    return rows.map(standingRow => {
        const team = canonicalTeam(cleanTeamName(standingRow[1]));
        return `<tr class="${team === focus ? 'focus-team' : ''}"><td>${esc(standingRow[0])}</td><td class="flag">${teamFlag(standingRow[1])}</td><td class="stand-team">${esc(standingRow[1])}</td>${standingRow.slice(2).map(value => `<td class="num">${value === '' ? '' : esc(value)}</td>`).join('')}</tr>`;
    }).join('');
}

function competitionStandingsHead() {
    const headings = ['Pos', '', 'Team', 'P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts'];
    return `<thead><tr>${headings.map(label => `<th>${label}</th>`).join('')}</tr></thead>`;
}

function competitionLeagueTable(data, focal, title = 'Standings') {
    if (!data || !data.rows || !data.rows.length)
        return '';
    const rows = competitionStandingsRows(data.rows, focal);
    return `<div class="competition-side-table"><div class="panel-kicker">${esc(title)}</div><div class="table-scroll"><table class="wikitable standings-table comp-standings">${competitionStandingsHead()}<tbody>${rows}</tbody></table></div></div>`;
}
function competitionGroupTables(data, focal) {
    if (!data || !data.groups || !data.groups.length)
        return '';
    return `<div class="competition-side-table group-tables"><div class="panel-kicker">Group tables</div>${data.groups.map(group => {
        const rows = competitionStandingsRows(group.rows, focal);
        return `<div class="group-table-block"><h3>${esc(group.name)}</h3><div class="table-scroll"><table class="wikitable standings-table group-table">${competitionStandingsHead()}<tbody>${rows}</tbody></table></div></div>`;
    }).join('')}</div>`;
}
function competitionSideTable(id, seasonName, comp, meta) {
    const focal = focalFor(id, seasonName, comp);
    if (comp === 'Pre-season friendlies' || comp === 'Champions Trophy') {
        const pre = (typeof PRESEASON_TABLES !== 'undefined' && PRESEASON_TABLES[id] && PRESEASON_TABLES[id][seasonName]) || null;
        if (pre)
            return competitionLeagueTable(pre, meta && meta.club ? meta.club : focal, comp === 'Champions Trophy' ? 'Champions Trophy table' : 'Pre-season table');
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
    return `${inProgress ? '<p class="table-note">In-progress player list: unreported statistics are blank; supplied zero values are retained.</p>' : ''}<div class="table-scroll"><table class="wikitable squad-table"><thead><tr><th>Pos</th><th title="Nationality">Nat.</th><th>No.</th><th>Name</th><th>App</th><th>Goals</th><th>Asst</th><th>CLS</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function canonicalTeam(teamName) {
    let normalizedTeamName = cleanTeamName(teamName);
    return TEAM_ALIASES[normalizedTeamName] || normalizedTeamName;
}
function isInternationalCompetition(comp) {
    // Only national-team tournaments are international fixtures.
    // Club competitions can also contain "Qualifiers" in their names.
    return /^(?:World Cup|Euros)(?:\s+\d{4})?(?:\s+Qualifiers)?$|^International Friendlies$/i.test(comp);
}
// All UEFA club knockout rounds (apart from the one-match final) are two-legged.
// A row with an aggregate score can represent both games; occasionally, as with
// Rens's Juventus and Inter Milan ties, the sheet also includes BOTH leg scores
// and a third, duplicate aggregate-summary row.
function uefaAggregateRound(comp, stage) {
    const isUefaClub = /(?:Champions League|Europa League|Conference League)/i.test(comp);
    return isUefaClub && (/\(agg(?:regate)?\)/i.test(stage) || /\(agg(?:regate)?\)/i.test(comp));
}

// A single aggregate-score row represents two played matches but one
// recorded W/D/L result. When individual legs are supplied, use their real
// outcomes instead; a duplicate aggregate summary must not be counted again.
function h2hFixtureWeights(id, season, comp, items, focal) {
    const breaks = tournamentRounds(comp, items, id, season);
    const weights = items.map(() => 1);
    const groups = new Map();
    let stage = '';

    items.forEach((raw, index) => {
        if (breaks[index])
            stage = breaks[index];
        if (!uefaAggregateRound(comp, stage))
            return;

        const fixture = parseFixture(raw);
        if (!fixture.home)
            return;
        const focalHome = sameTeam(fixture.home, focal);
        if (!focalHome && !sameTeam(fixture.away, focal))
            return;

        const opponent = canonicalTeam(focalHome ? fixture.away : fixture.home);
        const key = `${stage}|${opponent.toLowerCase()}`;
        if (!groups.has(key))
            groups.set(key, []);
        groups.get(key).push({
            index,
            gf: focalHome ? fixture.hg : fixture.ag,
            ga: focalHome ? fixture.ag : fixture.hg
        });
    });

    for (const group of groups.values()) {
        if (group.length === 1) {
            // The supplied score covers both legs of the knockout tie.
            weights[group[0].index] = 2;
        } else if (group.length === 3) {
            // Two leg scores may also have a duplicate aggregate summary.
            const summary = group.find(candidate => {
                const legs = group.filter(row => row !== candidate);
                return legs[0].gf + legs[1].gf === candidate.gf
                    && legs[0].ga + legs[1].ga === candidate.ga;
            });
            if (summary)
                weights[summary.index] = 0;
        }
    }
    return weights;
}

function careerOpponentRows(id) {
    const seasons = FULL_FIXTURES[id] || {}, rec = new Map(), seenTournament = new Set();
    Object.entries(seasons).forEach(([season, competitions]) => Object.entries(competitions || {}).forEach(([comp, items]) => {
        const focal = focalFor(id, season, comp);
        if (!focal)
            return;
        const weights = h2hFixtureWeights(id, season, comp, items || [], focal);
        (items || []).forEach((raw, index) => {
            const matchCount = weights[index];
            if (!matchCount)
                return;
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
                    opponent, played: 0, wins: 0, draws: 0, losses: 0,
                    gf: 0, ga: 0, seasons: new Set(), represented: new Map(), international: 0, club: 0
                });
            const opponentRecord = rec.get(key), matchOutcome = outcome(fixture, focal);
            opponentRecord.played += matchCount;
            opponentRecord.seasons.add(season);
            // Count how many matches were played against this opponent while
            // representing each club (or national team). Aggregate-only UEFA
            // ties add two played matches, just as they do in the P column.
            const representedTeam = canonicalTeam(focal);
            opponentRecord.represented.set(
                representedTeam,
                (opponentRecord.represented.get(representedTeam) || 0) + matchCount
            );
            if (isInternationalCompetition(comp))
                opponentRecord.international += matchCount;
            else
                opponentRecord.club += matchCount;
            const gf = focalHome ? fixture.hg : fixture.ag, ga = focalHome ? fixture.ag : fixture.hg;
            opponentRecord.gf += gf;
            opponentRecord.ga += ga;
            // An aggregate-only entry counts as P=2, but just one recorded
            // win, draw or loss based on the overall tie result.
            if (matchOutcome === 'win')
                opponentRecord.wins++;
            else if (matchOutcome === 'loss')
                opponentRecord.losses++;
            else if (matchOutcome === 'draw')
                opponentRecord.draws++;
        });
    }));
    return [
        ...rec.values()
    ].map(opponentRecord => ({
        ...opponentRecord,
        gd: opponentRecord.gf - opponentRecord.ga,
        winPct: opponentRecord.played
            ? 100 * opponentRecord.wins / opponentRecord.played : 0,
        type: opponentRecord.international && !opponentRecord.club ? 'International' : opponentRecord.club && !opponentRecord.international ? 'Club' : 'Mixed',
        representedLabel: [...opponentRecord.represented]
            .map(([team, played]) => `${team} (${played})`)
            .join(', ')
    }))
        .sort((firstRecord, secondRecord) => secondRecord.wins - firstRecord.wins || secondRecord.winPct - firstRecord.winPct || secondRecord.played - firstRecord.played || (firstRecord.opponent.localeCompare(secondRecord.opponent)));
}
function careerAnalysis(id) {
    app.className = 'analysis-page';
    const playerData = DATA[id];
    const rows = careerOpponentRows(id);
    const totals = rows.reduce((sum, row) => {
        for (const field of ['played', 'wins', 'draws', 'losses'])
            sum[field] += row[field];
        return sum;
    }, {
        played: 0, wins: 0, draws: 0, losses: 0
    });

    const winRate = totals.played ? `${(100 * totals.wins / totals.played).toFixed(1)}%` : '—';

    nav.innerHTML = careerNavigator(id, '', 'analysis');
    const body = rows.map((row, index) => `<tr>
        <td class="rank">${index + 1}</td>
        <td class="flag">${teamFlag(row.opponent)}</td>
        <td class="opponent">${esc(row.opponent)}</td>
        <td class="represented">${esc(row.representedLabel)}</td>
        <td>${row.type}</td>
        <td class="num">${row.played}</td>
        <td class="num">${row.wins}</td>
        <td class="num">${row.draws}</td>
        <td class="num">${row.losses}</td>
        <td class="num">${row.gf}</td>
        <td class="num">${row.ga}</td>
        <td class="num">${row.gd > 0 ? '+' : ''}${row.gd}</td>
        <td class="num">${row.played ? `${row.winPct.toFixed(1)}%` : '—'}</td>
    </tr>`).join('');

    app.innerHTML = `
        <p><a href="#${id}">← ${playerData.name}</a></p>
        <h1>${playerData.flag} ${playerData.name.split(' ')[0]} vs Teams</h1>
        <p class="lede">Combined head-to-head record against every opponent across ${playerData.name}'s recorded career, regardless of which club or national team ${playerData.name.split(' ')[0]} was representing. The Represented column breaks down matches played by team. Ranked by most recorded wins by default.</p>
        <div class="analysis-summary">
            <div><b>${rows.length}</b><span>Opponents</span></div>
            <div><b>${totals.played}</b><span>Matches</span></div>
            <div><b>${totals.wins}</b><span>Wins</span></div>
            <div><b>${totals.draws}</b><span>Draws</span></div>
            <div><b>${totals.losses}</b><span>Losses</span></div>
            <div><b>${winRate}</b><span>Win rate</span></div>
        </div>
        <div class="note analysis-note"><b>How aggregate ties are counted:</b> A two-legged UEFA knockout tie recorded with only its aggregate score counts as <b>2 played (P)</b>, but just <b>1 win, draw or loss</b> based on the overall result (including penalties where recorded). If both individual legs are listed, their actual results are counted instead. Therefore, <b>P may be higher than W + D + L</b>. Aggregate goals are included only once in GF/GA; Win % is recorded wins divided by matches played. Finals count as one match. Duplicate aggregate summaries and repeated World Cup/Euros results are excluded.</div>
        <div class="table-scroll"><table class="wikitable analysis-table">
            <thead><tr><th>#</th><th></th><th>Opponent</th><th>Represented</th><th>Type</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Win %</th></tr></thead>
            <tbody>${body}</tbody>
        </table></div>`;
}
