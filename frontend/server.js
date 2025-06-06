import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Serve the Vite build output from the 'dist' folder
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

// Check if dist/index.html exists
if (!indexPath) {
  console.error('dist/index.html not found. Did you run `npm run build`?');
  process.exit(1);
}
console.log('dist/index.html found');

app.use(express.static(distPath, {
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
    else if (filepath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
    else if (filepath.endsWith('.svg')) res.setHeader('Content-Type', 'image/svg+xml');
  }
}));

app.get('*', (req, res) => {
  console.log('Request received:', req.url);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Server error');
    }
  });
});

app.get('/health', (req, res) => {
  console.log('Health check received');
  res.status(200).send('OK');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
}).on('error', (err) => {
  console.error('Server error:', err.message);
  process.exit(1);
});

// http://localhost:3000