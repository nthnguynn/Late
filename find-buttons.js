const fs = require('fs');
let html = fs.readFileSync('D:/webb/src/app/bodyHtml.ts', 'utf8');
let matches = html.match(/id=\\"button-[^\\"]+\\"/g);
console.log([...new Set(matches)]);
