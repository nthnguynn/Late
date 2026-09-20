const fs = require('fs');
const html = fs.readFileSync('D:/webb/original.html', 'utf8');

// Extract all <style> tags
const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let styles = '';
let match;
while ((match = styleRegex.exec(html)) !== null) {
  styles += match[1] + '\n';
}
fs.writeFileSync('D:/webb/src/app/globals.css', styles);
console.log('CSS saved to globals.css');

// Extract body content
const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/i;
const bodyMatch = bodyRegex.exec(html);
if (bodyMatch) {
  let bodyContent = bodyMatch[1];
  
  // Remove script tags
  bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  fs.writeFileSync('D:/webb/public/body.html', bodyContent);
  console.log('Body HTML saved to public/body.html');
}
