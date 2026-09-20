const fs = require('fs');
const https = require('https');

https.get('https://anhphamleader.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    fs.writeFileSync('D:/webb/original.html', data);
    console.log('Downloaded original.html');
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
