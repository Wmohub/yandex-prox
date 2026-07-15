const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
  const target = 'https://yandex.ru';
  
  // Set essential headers for Yandex's internal routing infrastructure
  req.headers['host'] = 'api-maps.yandex.ru';
  delete req.headers['origin'];
  delete req.headers['referer'];

  // Apply open CORS policies to avoid browser sandbox locks
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Handle immediate browser CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  proxy.on('error', (err, req, res) => {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Proxy Link Disrupted');
    }
  });

  proxy.web(req, res, { 
    target, 
    changeOrigin: true,
    followRedirects: true
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Proxy actively routing all traffic on port ${PORT}`);
});
