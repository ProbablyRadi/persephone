// Career statistics, SVG charts and chart scaling.
// Loaded before app.js; shared functions remain available to the other scripts.

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
    return `<section class="chart-card season-card"><div class="panel-kicker">Visualisation</div><h2>${title}</h2><p class="chart-note">${subtitle}</p><div class="chart-scroll" tabindex="0" role="region" aria-label="${esc(title)}; scroll horizontally to explore">${chartMarkup}</div></section>`;
}
// Omit unreported values while retaining genuine zeroes.
function seasonMetricPoints(history, field) {
    return history
        .filter(row => Number.isFinite(row[field]))
        .map(row => ({ label: row.season, value: row[field] }));
}

function careerStats(id) {
    app.className = 'stats-page';
    const playerData = DATA[id];
    const history = statHistory(playerData);
    nav.innerHTML = careerNavigator(id, '', 'stats');
    const goalsPoints = seasonMetricPoints(history, 'goals');
    const assistsPoints = seasonMetricPoints(history, 'assists');
    const contributionPoints = seasonMetricPoints(history, 'contributions');
    const cleanSheetPoints = seasonMetricPoints(history, 'cleanSheets');
    const positionPoints = seasonMetricPoints(history, 'position');
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
    const charts = [
        chartCard('Goals per season', 'Recorded goals in each supplied season.', barChartSvg(goalsPoints, { className: 'chart-goals', title: 'Goals per season' })),
        chartCard('Assists per season', 'Recorded assists in each supplied season.', barChartSvg(assistsPoints, { className: 'chart-assists', title: 'Assists per season' })),
        chartCard('Goal contributions per season', 'Combined goals + assists for each recorded season.', barChartSvg(contributionPoints, { className: 'chart-contributions', title: 'Goal contributions per season' })),
        chartCard('Goal contributions by club', 'Total goal contributions across all recorded seasons for each club played.', barChartSvg(clubContributionPoints, { className: 'chart-contributions', title: 'Goal contributions by club' })),
        chartCard('Clean sheets per season', 'Recorded clean sheets or clean-sheet tally (CLS) for each season.', barChartSvg(cleanSheetPoints, { className: 'chart-clean-sheets', title: 'Clean sheets per season' })),
        chartCard('League finishing position', 'Lower is better: 1st place is shown at the top of the chart.', positionChartSvg(positionPoints, { className: 'chart-position', title: 'League finishing position by season' })),
    ].join('');
    app.innerHTML = `
        <div class="stats-wrap">
            <p><a href="#${id}">← ${esc(playerData.displayName || playerData.name)}</a></p>
            <h1>${playerData.flag} ${esc(playerData.displayName || playerData.name)} — Stats</h1>
            <p class="lede">Visual summary of recorded career output by season. These charts use the same season-by-season stats shown on the overview page, now also including total goal contributions (goals + assists) across every recorded year and club.</p>
            <div class="stats-grid">${charts}</div>
            <section class="stats-summary season-card">
                <div class="panel-kicker">Source data</div>
                <h2>Season totals</h2>
                ${table(['Season', 'Club', 'Goals', 'Assists', 'Goal contributions', 'CLS', 'League finish'], summaryRows)}
            </section>
        </div>
    `;
}
