// Read the same ordered source files that index.html loads in the browser.
// Tests can exercise renderers in Node without duplicating the file list.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');

function read(file) {
    return fs.readFileSync(path.join(root, file), 'utf8');
}

function sources(pattern) {
    return [...read('index.html').matchAll(pattern)]
        .map(match => match[1].split('?')[0]);
}

function clientSource() {
    return sources(/<script src="((?:js\/[^"?]+|app)\.js(?:\?[^"\s]*)?)"/g)
        .map(read)
        .join('\n');
}

function styleSource() {
    return sources(/<link rel="stylesheet" href="([^"]+)"/g)
        .map(read)
        .join('\n');
}

module.exports = { clientSource, styleSource };
