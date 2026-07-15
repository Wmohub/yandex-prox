const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
  const target = 'https://api-maps.yandex.ru';
  
  // Set headers so Yandex validates the request
  req.headers['host'] = 'api-maps.yandex.ru';
  delete req.headers['origin'];
  delete req.headers['referer'];

  // Global CORS policy config
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Intercept the response to rewrite .ru references to your proxy domain
  proxy.on('proxyRes', (proxyRes, req, res) => {
    if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('javascript')) {
      const originalWrite = res.write;
      const originalEnd = res.end;
      let body = '';

      // Intercept data streams
      proxyRes.on('data', (chunk) => { body += chunk; });
      proxyRes.on('end', () => {
        // Dynamically point Yandex sub-requests back to your unblocked proxy
        const modifiedBody = body.replace(/api-maps\.yandex\.ru/g, '://onrender.com');
        res.setHeader('Content-Length', Buffer.byteLength(modifiedBody));
        originalEnd.call(res, modifiedBody);
      });

      // Prevent default pass-through execution
      res.write = () => {};
      res.end = () => {};
    }
  });

  proxy.on('error', (err, req, res) => {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Proxy Link Disrupted');
    }
  });

  proxy.web(req, res, { target, changeOrigin: true, followRedirects: true });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Dynamic text-replacement proxy active on port ${PORT}`);
});
