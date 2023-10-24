const http = require('http');
const fs = require('fs');
const path = require('path');

// MIMEタイプのマッピング
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.jpg': 'image/jpeg',
  '.png': 'image/png'
};

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const mimeType = mimeTypes[ext] || 'application/octet-stream';

  fs.exists(filePath, exists => {
    if (exists) {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Server Error');
          return;
        }
        res.writeHead(200, {'Content-Type': mimeType});
        res.end(data);
      });
    } else {
      res.writeHead(404);
      res.end(`Not Found: ${filePath}`);
    }
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
