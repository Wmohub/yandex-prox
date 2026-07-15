const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
  // Always forward requests to Yandex Maps servers
  const target = 'https://api-maps.yandex.ru';
  
  // Clean up headers so Yandex servers accept the incoming data
  req.headers['host'] = 'api-maps.yandex.ru';
  delete req.headers['origin']; // Prevents local office CORS interference

  // Set broad CORS headers so your office browser allows the data to render
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Handle preflight browser requests immediately
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  proxy.on('error', (err, req, res) => {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Proxy Error');
    }
  });

  proxy.web(req, res, { 
    target, 
    changeOrigin: true,
    followRedirects: true // Essential for map images/tiles
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Upgraded proxy running on port ${PORT}`);
});
