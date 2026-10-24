// Text escaping, flags and basic table markup.
// Loaded before app.js; shared functions remain available to the other scripts.

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
