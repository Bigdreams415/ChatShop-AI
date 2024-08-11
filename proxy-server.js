// const express = require('express');
// const { createProxyMiddleware } = require('http-proxy-middleware');
// const cors = require('cors');

// const app = express();
// const port = 3001;

// app.use(cors());

// app.use('/api', createProxyMiddleware({
//     target: 'http://104.209.179.162',  
//     changeOrigin: true,
//     pathRewrite: {
//         '^/api': '', 
//     },
//     onProxyReq: (proxyReq, req, res) => {
//         console.log('Proxying request to:', proxyReq.path);
//     },
//     onProxyRes: (proxyRes, req, res) => {
//         console.log('Received response from target:', proxyRes.statusCode);
//     }
// }));

// app.listen(port, () => {
//     console.log(`Proxy server is running on http://localhost:${port}`);
// });
