const fs = require('fs');
let html = fs.readFileSync('D:/webb/src/app/bodyHtml.ts', 'utf8');

// Replace standard image srcs
html = html.replace(/src=\\"https?:\/\/[^\"]+\\"/gi, 'src=\\"https://via.placeholder.com/500x500\\"');
// Replace srcset
html = html.replace(/srcset=\\"https?:\/\/[^\"]+\\"/gi, 'srcset=\\"\\"');

fs.writeFileSync('D:/webb/src/app/bodyHtml.ts', html);

// Also handle background images in globals.css
let css = fs.readFileSync('D:/webb/src/app/globals.css', 'utf8');
css = css.replace(/url\(['"]?https?:\/\/[^'")]+\.(jpg|jpeg|png|webp|gif)['"]?\)/gi, 'url("https://via.placeholder.com/1920x1080")');
fs.writeFileSync('D:/webb/src/app/globals.css', css);

console.log('Images replaced');
