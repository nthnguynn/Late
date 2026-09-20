const fs = require('fs');
let css = fs.readFileSync('D:/webb/src/app/globals.css', 'utf8');

// The error is content:'\'; which should probably be empty string.
css = css.replace(/content:'\\';/g, "content:'';");
// Also check for double quotes: content:"\";
css = css.replace(/content:"\\";/g, 'content:"";');


fs.writeFileSync('D:/webb/src/app/globals.css', css);
console.log('Fixed CSS');
