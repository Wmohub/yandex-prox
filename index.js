const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Apply global CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

// Clean landing response for the root domain
app.get('/', (req, res) => {
  res.send('Yandex Maps Proxy Gateway is Active and Online!');
});

// Robust catch-all route to map ALL sub-assets to Yandex securely
app.use('/', createProxyMiddleware({
  target: 'https://yandex.ru',
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader('host', 'api-maps.yandex.ru');
    }
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express proxy server running smoothly on port ${PORT}`);
});
