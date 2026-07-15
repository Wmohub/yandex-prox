const http = require('http');
const httpProxy = require('http-proxy');

// Initialize the proxy agent
const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
  // Core target URL
  const target = 'https://api-maps.yandex.ru';
  
  // Set essential headers for Yandex's router infrastructure
  req.headers['host'] = 'api-maps.yandex.ru';
  delete req.headers['origin'];

  // Apply open CORS policies to avoid browser sandbox locks
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Handle immediate browser CORS handshakes
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle stream disruptions gracefully 
  proxy.on('error', (err, req, res) => {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Proxy Link Disrupted');
    }
  });

  // Execute web forwarding with absolute path verification
  proxy.web(req, res, { 
    target, 
    changeOrigin: true,
    followRedirects: true,
    ignorePath: false // Forces the proxy to preserve the exact URL query paths
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Proxy actively serving requests on port ${PORT}`);
});
