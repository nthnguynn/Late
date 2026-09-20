const fs = require('fs');
let html = fs.readFileSync('D:/webb/src/app/bodyHtml.ts', 'utf8');

// Remove fetchpriority since html-react-parser might not map it correctly to camelCase
html = html.replace(/fetchpriority=["']?[^"'\s>]*["']?/gi, '');
// Remove fetchPriority as well
html = html.replace(/fetchPriority=["']?[^"'\s>]*["']?/gi, '');

fs.writeFileSync('D:/webb/src/app/bodyHtml.ts', html);
console.log('Removed fetchpriority');
