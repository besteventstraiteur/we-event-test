const http = require('http');
const https = require('https');

const url = 'https://5173-i9xmitmdzxd6y5rjumtyh-c07dda5e.sandbox.novita.ai/';

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Content-Type:', res.headers['content-type']);
    console.log('Body length:', data.length);
    console.log('Title:', data.match(/<title>(.*?)<\/title>/)?.[1] || 'No title');
    console.log('Has #root:', data.includes('id="root"'));
    console.log('Has main.tsx:', data.includes('main.tsx'));
  });
}).on('error', (e) => console.error('Error:', e));
