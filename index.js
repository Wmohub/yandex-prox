const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
  const target = 'https://yandex.ru';
  req.headers['host'] = 'api-maps.yandex.ru';

  proxy.on('error', (err, req, res) => {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy Error');
  });

  proxy.web(req, res, { target, changeOrigin: true });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
