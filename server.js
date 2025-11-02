// server.js - servidor estático con headers seguros (para testing local)
const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');

const app = express();
const port = process.env.PORT || 8000;

app.use((req, res, next) => {
  // Control de seguridad básico
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Charset en content-type: muchas herramientas esperan utf-8
  res.setHeader('Content-Type', res.getHeader('Content-Type') || 'text/html; charset=utf-8');
  // Cache control: durante dev dejamos corto
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});

// servir carpeta actual (ajusta si tu proyecto está en 'public')
app.use(serveStatic(path.join(__dirname), {
  index: ['index.html']
}));

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
