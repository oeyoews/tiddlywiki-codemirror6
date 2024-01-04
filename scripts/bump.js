// bump version
const fs = require('fs');
const path = require('path');

const infoFile = path.join(__dirname, 'src/tiddlywiki-codemirror-6');
const info = fs.readFileSync();
