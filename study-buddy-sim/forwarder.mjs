import http from 'http';

function createForwarder(fromPort, toPort) {
  const server = http.createServer((req, res) => {
    const options = {
      hostname: '127.0.0.1',
      port: toPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`الخادم الرئيسي قيد التحميل... يرجى إعادة المحاولة: ${err.message}`);
    });

    req.pipe(proxyReq, { end: true });
  });

  server.listen(fromPort, '0.0.0.0', () => {
    console.log(`Forwarder listening on http://localhost:${fromPort} -> 8080`);
  });

  server.on('error', (err) => {
    console.log(`Port ${fromPort} could not be bound (maybe in use): ${err.message}`);
  });
}

createForwarder(5173, 8080);
createForwarder(3000, 8080);
createForwarder(5500, 8080);

