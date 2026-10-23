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

function replaceFlagEmoji(root = document) {
    if (typeof FLAG_ASSETS === 'undefined' || !root)
        return;

    const flagEntries = Object.entries(FLAG_ASSETS);

    if (!flagEntries.length)
        return;

    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                const parent = node.parentElement;

                if (!parent)
                    return NodeFilter.FILTER_REJECT;

                if (
                    parent.closest('script, style, textarea, option')
                    || !flagEntries.some(([emoji]) => node.nodeValue.includes(emoji))
                )
                    return NodeFilter.FILTER_REJECT;

                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    const textNodes = [];

    while (walker.nextNode())
        textNodes.push(walker.currentNode);

    textNodes.forEach(textNode => {
        let remainingText = textNode.nodeValue;
        const fragment = document.createDocumentFragment();

        while (remainingText) {
            let nextMatch = null;

            flagEntries.forEach(([emoji, assetPath]) => {
                const matchIndex = remainingText.indexOf(emoji);

                if (
                    matchIndex !== -1
                    && (!nextMatch || matchIndex < nextMatch.index)
                ) {
                    nextMatch = {
                        emoji,
                        assetPath,
                        index: matchIndex
                    };
                }
            });

            if (!nextMatch) {
                fragment.append(document.createTextNode(remainingText));
                break;
            }

            if (nextMatch.index > 0) {
                fragment.append(
                    document.createTextNode(
                        remainingText.slice(0, nextMatch.index)
                    )
                );
            }

            const image = document.createElement('img');
            image.className = 'country-flag';
            image.src = nextMatch.assetPath;
            image.alt = '';
            image.setAttribute('aria-hidden', 'true');
            fragment.append(image);

            remainingText = remainingText.slice(
                nextMatch.index + nextMatch.emoji.length
            );
        }

        textNode.replaceWith(fragment);
    });
}

function table(headers, rows) {
    return `<table class="wikitable"><thead><tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((cellValue, columnIndex) => `<td class="${columnIndex > 1 ? 'num' : ''}">${cellValue}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
// Small Wikipedia-style career summaries live inside the profile infobox.
// This uses the same career and intl data as the former full-width tables.
function infoboxCareerTable(rows, label) {
    return `<table class="infobox-career-table" aria-label="${esc(label)}">
        <thead><tr>
            <th scope="col">Years</th>
            <th scope="col">Team</th>
            <th scope="col" class="infobox-career-num">Apps</th>
            <th scope="col" class="infobox-career-num">Goals</th>
        </tr></thead>
        <tbody>${rows.map(([years, team, appearances, goals]) => `
            <tr>
                <td class="infobox-career-years">${esc(years)}</td>
                <td class="infobox-career-team">${esc(team)}</td>
                <td class="infobox-career-num">${esc(appearances ?? '—')}</td>
                <td class="infobox-career-num">${esc(goals ?? '—')}</td>
            </tr>
        `).join('')}</tbody>
    </table>`;
}

function infobox(playerData) {
    return `
        <table class="infobox">
            <tr>
                <th colspan="2">${playerData.flag} ${playerData.name}</th>
            </tr>

            <tr class="infobox-portrait-row">
                <td colspan="2">
                    ${playerData.portrait
                        ? `
                            <img
                                class="profile-portrait"
                                src="${esc(playerData.portrait)}"
                                alt="${esc(playerData.displayName || playerData.name)} portrait"
                            >
                        `
                        : `
                            <div
                                class="profile-portrait-placeholder"
                                role="img"
                                aria-label="Portrait placeholder for ${esc(playerData.displayName || playerData.name)}"
                            >
                                <span>Portrait</span>
                            </div>
                        `}
                </td>
            </tr>

            ${playerData.nickname
                ? `<tr><td>Nickname</td><td>${playerData.nickname}</td></tr>`
                : ''}

            <tr>
                <td>Born</td>
                <td>${playerData.dob}<br>${playerData.birth}</td>
            </tr>

            <tr>
                <td>Height</td>
                <td>${playerData.height}</td>
            </tr>

            <tr>
                <td>Boot brand</td>
                <td>${playerData.bootBrand || 'Unknown'}</td>
            </tr>

            <tr>
                <td>Position</td>
                <td>${playerData.position}</td>
            </tr>

            <tr>
                <td>Current team</td>
                <td>${playerData.current}</td>
            </tr>

            <tr>
                <td>Number</td>
                <td>${playerData.number}</td>
            </tr>

            <tr>
                <td>National team</td>
                <td>${playerData.international}</td>
            </tr>

            <tr class="infobox-career-heading">
                <th colspan="2" id="career">Club career</th>
            </tr>
            <tr>
                <td colspan="2" class="infobox-career-cell">
                    ${infoboxCareerTable(playerData.career, 'Club career')}
                </td>
            </tr>

            <tr class="infobox-career-heading">
                <th colspan="2" id="international-career">International career</th>
            </tr>
            <tr>
                <td colspan="2" class="infobox-career-cell">
                    ${infoboxCareerTable([playerData.intl], 'International career')}
                </td>
            </tr>
        </table>
    `;
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
function biographyLead(playerData) {
    const paragraphs = Array.isArray(playerData.intro)
        ? playerData.intro
        : [playerData.intro];

    return paragraphs
        .filter(Boolean)
        .map(paragraph => `<p class="lede">${esc(paragraph)}</p>`)
        .join('');
}

// Career overview is shared by all characters. Every row shows its club,
// including one-club careers. Incomplete/future seasons never count towards
// the completed-career totals; optional future rows are display-only.
function careerStatsTable(playerData) {
    const recordedRows = playerData.stats || [];
    const futureRows = (playerData.careerOverviewFutureRows || []).map(
        ([season, club, role = '', league = '']) => [
            season, club, role, league, '', '', '', '', '', ''
        ]
    );
    const groups = [];

    [...recordedRows, ...futureRows].forEach(row => {
        const clubKey = cleanClubLabel(row[1]);
        let group = groups.find(candidate => candidate.key === clubKey);

        if (!group) {
            group = { key: clubKey, rows: [] };
            groups.push(group);
        }

        group.rows.push(row);
    });

    const headers = [
        'Club', 'Season', 'Role', 'League', 'League Position',
        'Average Rating', 'Player of the Month', 'Man of the Match',
        'App', 'Goals', 'Assists', 'CLS'
    ];
    const displayValue = value =>
        value === '' || value == null ? '—' : String(value);
    // Season keys in imported sheets may use different kinds of dashes.
    // Normalize for lookup so verified awards never disappear because a
    // stats row uses "2025-26" while careerAwards uses "2025–26".
    const seasonKey = value => String(value || '')
        .replace(/[‐‑‒–—−]/g, '-')
        .replace(/\s+/g, '');
    const awardsBySeason = new Map(
        Object.entries(playerData.careerAwards || {})
            .map(([season, counts]) => [seasonKey(season), counts])
    );
    const awardsFor = season => awardsBySeason.get(seasonKey(season)) || {};
    const completedRows = rows => rows.filter(row =>
        recordedRows.includes(row)
        && playerData.seasons?.[row[0]]
        && !playerData.seasons[row[0]].inProgress
    );

    function totalsFor(rows) {
        if (!rows.length)
            return null;

        const validRatings = rows.filter(row =>
            row[5] !== '' && row[5] != null && Number.isFinite(Number(row[5]))
        );
        const average = validRatings.length
            ? validRatings.reduce((sum, row) => sum + Number(row[5]), 0) / validRatings.length
            : null;
        // Club totals for two seasons retain 2 decimals (e.g. 6.75).
        // Larger groups and career totals use one decimal.
        const ratingPrecision = validRatings.length === 2 ? 2 : 1;
        const rating = average == null
            ? '—'
            : Number(average.toFixed(ratingPrecision)).toString();

        const awardSum = key => {
            const values = rows.map(row => awardsFor(row[0])[key]);
            return values.every(value => typeof value === 'number')
                ? values.reduce((sum, value) => sum + value, 0)
                : '—';
        };
        const statSum = index => {
            const values = rows.map(row => row[index]);
            return values.every(value =>
                value !== '' && value != null && Number.isFinite(Number(value))
            ) ? values.reduce((sum, value) => sum + Number(value), 0) : '—';
        };

        return [
            '', '', '', '', '', rating,
            awardSum('playerOfTheMonth'),
            awardSum('playerOfTheMatch'),
            statSum(6), statSum(7), statSum(8), statSum(9)
        ];
    }

    const tableRows = [];
    const allCompletedRows = [];

    groups.forEach(group => {
        group.rows.forEach(row => {
            const awards = awardsFor(row[0]);
            tableRows.push({
                type: 'season',
                values: [
                    row[1], row[0], row[2], row[3], row[4], row[5],
                    awards.playerOfTheMonth, awards.playerOfTheMatch,
                    row[6], row[7], row[8], row[9]
                ]
            });
        });

        const completed = completedRows(group.rows);
        allCompletedRows.push(...completed);
        tableRows.push({ type: 'subtotal', values: totalsFor(completed) });
    });

    if (groups.length > 1) {
        tableRows.push({
            type: 'grand-total',
            values: totalsFor(allCompletedRows)
        });
    }

    const body = tableRows.map(({ type, values }) => {
        if (!values) {
            // For a future-only club there is no completed subtotal yet.
            values = ['', '', '', '', '', '', '', '', '', '', '', ''];
        }

        if (type !== 'season') {
            values = [...values];
            values[0] = type === 'grand-total' ? 'Grand Total' : 'Total';
        }

        const cells = values.map((value, index) => {
            const text = type === 'season' || value !== ''
                ? displayValue(value)
                : '';
            return `<td class="${index >= 4 ? 'num' : ''}">${esc(text)}</td>`;
        }).join('');

        return `<tr class="career-stats-${type}">${cells}</tr>`;
    }).join('');

    return `<div class="table-scroll career-stats-scroll">
        <table class="wikitable career-stats-table">
            <thead><tr>${headers.map(header => `<th>${esc(header)}</th>`).join('')}</tr></thead>
            <tbody>${body}</tbody>
        </table>
    </div>`;
}

function player(id) {
    let playerData = DATA[id];
    app.className = 'profile-page';
    nav.innerHTML = careerNavigator(id);
    app.innerHTML = `${infobox(playerData)}
    <h1>${playerData.displayName || playerData.name}</h1>
    ${biographyLead(playerData)}
    <div class="toc">
      <b>Contents</b>
      <ol>
        <li><a href="#career" onclick="event.preventDefault(); document.getElementById('career').scrollIntoView({behavior:'smooth', block:'start'})">Club career</a></li>
        <li><a href="#international-career" onclick="event.preventDefault(); document.getElementById('international-career').scrollIntoView({behavior:'smooth', block:'start'})">International career</a></li>
        <li><a href="#honours" onclick="event.preventDefault(); document.getElementById('honours').scrollIntoView({behavior:'smooth', block:'start'})">Honours</a></li>
        <li><a href="#stats" onclick="event.preventDefault(); document.getElementById('stats').scrollIntoView({behavior:'smooth', block:'start'})">Career statistics</a></li>
      </ol>
    </div>
    <section class="profile-honours" aria-labelledby="honours">
      <h2 id="honours">Honours</h2>
      ${honours(playerData)}
    </section>
    <div class="clear"></div>
    <h2 id="stats">Career statistics</h2>
    ${careerStatsTable(playerData)}`;
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
function combinedContribution(goalsValue, assistsValue) {
    const hasGoals = Number.isFinite(goalsValue);
    const hasAssists = Number.isFinite(assistsValue);
    if (!hasGoals && !hasAssists)
        return null;
    return (hasGoals ? goalsValue : 0) + (hasAssists ? assistsValue : 0);
}
function statHistory(playerData) {
    return (playerData.stats || []).map(statRow => {
        const goals = numericStat(statRow[7]);
        const assists = numericStat(statRow[8]);
        return {
            season: statRow[0],
            club: cleanClubLabel(statRow[1]),
            league: statRow[3],
            goals,
            assists,
            contributions: combinedContribution(goals, assists),
            cleanSheets: numericStat(statRow[9]),
            position: numericPosition(statRow[4]),
            positionLabel: statRow[4]
        };
    });
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
    if (!points.length)
        return '<div class="chart-empty">No recorded data yet.</div>';
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
    const goalsPoints = history.filter(seasonRow => Number.isFinite(seasonRow.goals)).map(seasonRow => ({ label: seasonRow.season, value: seasonRow.goals }));
    const assistsPoints = history.filter(seasonRow => Number.isFinite(seasonRow.assists)).map(seasonRow => ({ label: seasonRow.season, value: seasonRow.assists }));
    const contributionPoints = history.filter(seasonRow => Number.isFinite(seasonRow.contributions)).map(seasonRow => ({ label: seasonRow.season, value: seasonRow.contributions }));
    const cleanSheetPoints = history.filter(seasonRow => Number.isFinite(seasonRow.cleanSheets)).map(seasonRow => ({ label: seasonRow.season, value: seasonRow.cleanSheets }));
    const positionPoints = history.filter(seasonRow => Number.isFinite(seasonRow.position)).map(seasonRow => ({ label: seasonRow.season, value: seasonRow.position }));
    const clubContributionMap = new Map();
    history.forEach(seasonRow => {
        if (!Number.isFinite(seasonRow.contributions))
            return;
        const currentTotal = clubContributionMap.get(seasonRow.club) || 0;
        clubContributionMap.set(seasonRow.club, currentTotal + seasonRow.contributions);
    });
    const clubContributionPoints = Array.from(clubContributionMap.entries()).map(([club, total]) => ({
        label: club,
        value: total
    }));
    const summaryRows = history.map(seasonRow => [
        seasonRow.season,
        seasonRow.club,
        niceMetric(seasonRow.goals),
        niceMetric(seasonRow.assists),
        niceMetric(seasonRow.contributions),
        niceMetric(seasonRow.cleanSheets),
        seasonRow.positionLabel || '—'
    ]);
    app.innerHTML = `<div class="stats-wrap"><p><a href="#${id}">← ${esc(playerData.displayName || playerData.name)}</a></p><h1>${playerData.flag} ${esc(playerData.displayName || playerData.name)} — Stats</h1><p class="lede">Visual summary of recorded career output by season. These charts use the same season-by-season stats shown on the overview page, now also including total goal contributions (goals + assists) across every recorded year and club.</p><div class="stats-grid">${chartCard('Goals per season', 'Recorded goals in each supplied season.', barChartSvg(goalsPoints, { className: 'chart-goals', title: 'Goals per season' }))}${chartCard('Assists per season', 'Recorded assists in each supplied season.', barChartSvg(assistsPoints, { className: 'chart-assists', title: 'Assists per season' }))}${chartCard('Goal contributions per season', 'Combined goals + assists for each recorded season.', barChartSvg(contributionPoints, { className: 'chart-contributions', title: 'Goal contributions per season' }))}${chartCard('Goal contributions by club', 'Total goal contributions across all recorded seasons for each club played.', barChartSvg(clubContributionPoints, { className: 'chart-contributions', title: 'Goal contributions by club' }))}${chartCard('Clean sheets per season', 'Recorded clean sheets or clean-sheet tally (CLS) for each season.', barChartSvg(cleanSheetPoints, { className: 'chart-clean-sheets', title: 'Clean sheets per season' }))}${chartCard('League finishing position', 'Lower is better: 1st place is shown at the top of the chart.', positionChartSvg(positionPoints, { className: 'chart-position', title: 'League finishing position by season' }))}</div><section class="stats-summary season-card"><div class="panel-kicker">Source data</div><h2>Season totals</h2>${table(['Season', 'Club', 'Goals', 'Assists', 'Goal contributions', 'CLS', 'League finish'], summaryRows)}</section></div>`;
}
function season(id, seasonName) {
    app.className = 'season-view';
    let playerData = DATA[id], seasonData = playerData.seasons[seasonName], full = (FULL_FIXTURES[id] && FULL_FIXTURES[id][seasonName]) || {}, meta = (typeof SEASON_TABLES !== 'undefined' && SEASON_TABLES[id] && SEASON_TABLES[id][seasonName]) || null;
    nav.innerHTML = careerNavigator(id, seasonName);
    let entries = Object.entries(full);
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
        const pending = seasonData.pendingFixtures && seasonData.pendingFixtures[competitionName] || [];
        const pendingHtml = pending.length
            ? `<div class="table-note"><b>Scheduled / score pending (not counted in results or Head to Head)</b><ul>${pending.map(item => `<li>${esc(item)}</li>`).join('')}</ul></div>`
            : '';
        const fixturesHtml = (fixtures.length
            ? fixtureTable(fixtures, focalFor(id, seasonName, competitionName), competitionName, id, seasonName)
            : '<p class="muted">No fixtures recorded yet.</p>') + pendingHtml;

        if (side) {
            return `<div class="competition-pair" id="${sectionId(competitionName)}"><section class="competition season-competition competition-fixture-panel"><div class="competition-heading"><h2>${competitionName}</h2><a href="#season-overview" onclick="event.preventDefault();document.getElementById('season-overview').scrollIntoView({behavior:'smooth'})">Back to top ↑</a></div><div class="competition-fixtures">${fixturesHtml}</div></section><aside class="competition-standings-panel"${leagueId}>${side}</aside></div>`;
        }
        return `<section class="competition season-competition" id="${sectionId(competitionName)}"><div class="competition-heading"><h2>${competitionName}</h2><a href="#season-overview" onclick="event.preventDefault();document.getElementById('season-overview').scrollIntoView({behavior:'smooth'})">Back to top ↑</a></div><div class="competition-fixtures">${fixturesHtml}</div></section>`;
    }).join('');
    let leaguePanel = sideLeagueSeason ? '' : `<section class="season-data-panel season-card" id="league-table"><div class="panel-kicker">Standings</div><h2>${meta ? esc(meta.league) : 'League'} table</h2>${standingsTable(meta, seasonData.inProgress)}</section>`;
    let dataTables = `<div class="season-data-grid${sideLeagueSeason ? ' squad-only' : ''}">${leaguePanel}<section class="season-data-panel season-card" id="player-list"><div class="panel-kicker">Squad</div><h2>Player list${meta && meta.club ? ` — ${esc(meta.club)}` : ''}</h2>${squadTable(meta, id, seasonData.inProgress)}</section></div>`;
    const stat = statForSeason(playerData, seasonName), club = meta && meta.club ? meta.club : (stat ? cleanClubLabel(stat[1]) : ''), league = meta && meta.league ? meta.league : (stat ? stat[3] : '');
    app.innerHTML = `<div class="season-page"><section class="season-hero" id="season-overview"><div class="season-breadcrumb"><a href="#${id}">${esc(playerData.name)}</a><span>›</span><span>${seasonName}</span></div><div class="season-title-row"><div><div class="season-eyebrow">${club ? `${teamFlag(club)} ${esc(club)}` : 'Career season'}</div><h1>${seasonName}</h1><p class="season-subtitle">${league ? esc(league) + ' · ' : ''}${esc(playerData.name)}${seasonData.inProgress ? ' · In progress' : ''}</p></div>${seasonData.inProgress ? '<span class="season-live">In progress</span>' : ''}</div><p class="lede season-summary">${seasonData.summary}</p>${seasonStatStrip(playerData, seasonName, seasonData, meta)}<div class="season-record"><span>League record</span><b>${seasonData.table}</b></div></section>${jump}${dataTables}<div class="season-results-head"><div><div class="panel-kicker">Match archive</div><h2>Competitions & results</h2></div><p>Green = win, amber = draw, red = loss. Grey marks tournament results not involving the player's team.</p></div>${blocks || '<p>No scored fixtures have been recorded yet.</p>'}</div>`;
}
function flagSortName(assetPath) {
    // Local flag filenames give the country name even when the cell
    // contains only an image (and therefore has no visible text).
    const fileName = String(assetPath || '').split('/').pop().split('?')[0];
    return fileName.replace(/\.[^.]+$/, '').replace(/-/g, ' ');
}
function tableCellValue(row, index) {
    const cell = row.cells[index];
    if (!cell)
        return '';
    if (cell.dataset.sortValue)
        return cell.dataset.sortValue.trim();

    // Flag images deliberately have empty alt text, so textContent is blank.
    // Sort nationality/flag columns by country name instead of image markup.
    if (cell.classList.contains('flag') || cell.classList.contains('player-nation')) {
        const image = cell.querySelector('img.country-flag');
        if (image)
            return flagSortName(image.getAttribute('src'));

        // The same order applies if the visitor sorts before emoji -> image
        // replacement has finished (or if the images fail to load).
        const emoji = (cell.textContent || '').trim();
        if (typeof FLAG_ASSETS !== 'undefined' && FLAG_ASSETS[emoji])
            return flagSortName(FLAG_ASSETS[emoji]);
    }

    return (cell.textContent || '').trim();
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
    // Keep career history in chronological order in the profile infobox.
    // Sorting the large Career Statistics table would also separate subtotals
    // from the season rows they belong to.
    if (
        table.classList.contains('infobox-career-table')
        || table.classList.contains('career-stats-table')
    )
        return;
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
const renderObserver = new MutationObserver(() => {
    enhanceTables(app);
    replaceFlagEmoji(app);
    replaceFlagEmoji(nav);
});

renderObserver.observe(app, {
    childList: true,
    subtree: true
});

renderObserver.observe(nav, {
    childList: true,
    subtree: true
});
function home() {
    app.className = 'home-page';
    nav.innerHTML = '';
    const homePlayerIds = Object.keys(DATA);
    app.innerHTML = `<h1>FC26 Career Wiki</h1><div class="home-tiles">${homePlayerIds.map(id => {
        const playerData = DATA[id];
        const homeBackground = playerData.homeBackground || '';
        const tileClass = homeBackground
            ? 'home-player-tile has-character-background'
            : 'home-player-tile';

        return `
            <a
                class="${tileClass}"
                href="#${id}"
                style="
                    --club-crest: url('${playerData.homeCrest || ''}');
                    --character-background: url('${homeBackground}');
                "
            >
                <span>${playerData.flag} ${playerData.displayName || playerData.name}</span>
            </a>
        `;
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

    replaceFlagEmoji(app);
    replaceFlagEmoji(nav);
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
