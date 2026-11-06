const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const DIST_DIR = path.resolve(__dirname, '..', 'dist', 'assets');

// Performance Budgets (Gzip)
const BUDGETS = {
  maxJsGzipKb: 250,    // Hard limit: 250 kB gzipped JS
  maxCssGzipKb: 50,    // Hard limit: 50 kB gzipped CSS
  maxTotalGzipKb: 350, // Hard limit: 350 kB total initial payload
};

console.log('\n--- CALISTEFLOW PERFORMANCE BUDGET AUDITOR ---');

if (!fs.existsSync(DIST_DIR)) {
  console.error('Error: dist/assets directory not found. Please run "npm run build" first.');
  process.exit(1);
}

const files = fs.readdirSync(DIST_DIR);
let totalJsGzip = 0;
let totalCssGzip = 0;
let totalRaw = 0;

files.forEach(file => {
  const filePath = path.join(DIST_DIR, file);
  const content = fs.readFileSync(filePath);
  const rawSizeKb = (content.length / 1024).toFixed(2);
  const gzipSize = zlib.gzipSync(content).length;
  const gzipSizeKb = (gzipSize / 1024).toFixed(2);

  totalRaw += content.length;

  if (file.endsWith('.js')) {
    totalJsGzip += gzipSize;
    console.log(`[JS]  ${file.padEnd(35)} Raw: ${rawSizeKb.padStart(7)} KB | Gzip: ${gzipSizeKb.padStart(7)} KB`);
  } else if (file.endsWith('.css')) {
    totalCssGzip += gzipSize;
    console.log(`[CSS] ${file.padEnd(35)} Raw: ${rawSizeKb.padStart(7)} KB | Gzip: ${gzipSizeKb.padStart(7)} KB`);
  }
});

const totalJsGzipKb = totalJsGzip / 1024;
const totalCssGzipKb = totalCssGzip / 1024;
const totalGzipKb = (totalJsGzip + totalCssGzip) / 1024;

console.log('\n--- BUDGET COMPLIANCE VERIFICATION ---');
console.log(`Total JS Gzip:    ${totalJsGzipKb.toFixed(2)} KB / Budget: ${BUDGETS.maxJsGzipKb} KB -> ${totalJsGzipKb <= BUDGETS.maxJsGzipKb ? 'PASS' : 'FAIL'}`);
console.log(`Total CSS Gzip:   ${totalCssGzipKb.toFixed(2)} KB / Budget: ${BUDGETS.maxCssGzipKb} KB -> ${totalCssGzipKb <= BUDGETS.maxCssGzipKb ? 'PASS' : 'FAIL'}`);
console.log(`Total Payload:    ${totalGzipKb.toFixed(2)} KB / Budget: ${BUDGETS.maxTotalGzipKb} KB -> ${totalGzipKb <= BUDGETS.maxTotalGzipKb ? 'PASS' : 'FAIL'}`);

if (totalJsGzipKb > BUDGETS.maxJsGzipKb || totalCssGzipKb > BUDGETS.maxCssGzipKb || totalGzipKb > BUDGETS.maxTotalGzipKb) {
  console.error('\nPerformance budget exceeded! Optimize bundle chunks before deployment.');
  process.exit(1);
} else {
  console.log('\nAll performance budgets passed! Application ready for low-end devices and 3G networks.\n');
  process.exit(0);
}
