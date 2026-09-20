const fs = require('fs');
let html = fs.readFileSync('D:/webb/src/app/bodyHtml.ts', 'utf8');

html = html.replace(/ auto\\"/gi, '');
html = html.replace(/ auto"/gi, '');

fs.writeFileSync('D:/webb/src/app/bodyHtml.ts', html);
console.log('Fixed auto attribute');
