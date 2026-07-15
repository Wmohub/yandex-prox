const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Apply global CORS headers to allow cross-origin traffic from your office
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

// A clean landing response for the root URL to prevent "Misdirected Request"
app.get('/', (req, res) => {
  res.send('Yandex Maps Proxy Gateway is Active and Online!');
});

// Only proxy requests that explicitly look for Yandex API versions (like /2.1/)
app.use('/2.1', createProxyMiddleware({
  target: 'https://api-maps.yandex.ru',
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req, res) => {
      // Set essential headers for Yandex's security layer
      proxyReq.setHeader('host', 'api-maps.yandex.ru');
    }
  }
}));

// Fallback listener for dynamic subpath files requested by the loader
app.use('/services', createProxyMiddleware({
  target: 'https://api-maps.yandex.ru',
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
