// Player overview, career navigation and career summaries.
// Loaded before app.js; shared functions remain available to the other scripts.

// Small chronological career summaries, nested inside the profile infobox.
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
    return `<div class="career-nav"><div class="career-nav-player"><span>${playerData.flag}</span><div><b>${esc(playerData.displayName || playerData.name)}</b><small>Career navigator</small></div></div><a class="career-nav-main ${!activeSeason && !activePage ? 'active' : ''}" href="#${id}">Overview</a><a class="career-nav-main ${activePage === 'timeline' ? 'active' : ''}" href="#${id}/timeline">Timeline</a><a class="career-nav-main ${activePage === 'stats' ? 'active' : ''}" href="#${id}/stats">Stats</a><a class="career-nav-main ${activePage === 'analysis' ? 'active' : ''}" href="#${id}/analysis">Head to Head</a><a class="career-nav-main ${activePage === 'comparisons' ? 'active' : ''}" href="#${id}/comparisons">Season comparisons</a>${groups.map(group => `<div class="career-nav-club"><div class="career-nav-clubname">${group.label}</div>${group.seasons.map(season => `<a class="${activeSeason === season ? 'active' : ''}" href="#${id}/${season}"><span>${season}</span>${playerData.seasons[season].inProgress ? '<em>Live</em>' : ''}</a>`).join('')}</div>`).join('')}</div>`;
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
