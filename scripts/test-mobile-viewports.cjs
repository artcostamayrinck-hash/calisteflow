const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const DIST_DIR = path.resolve(__dirname, '../dist');

// Simple static server for dist
function startServer(port) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon'
  };

  const server = http.createServer((req, res) => {
    let cleanUrl = req.url.split('?')[0];
    if (cleanUrl.startsWith('/calisteflow/')) {
      cleanUrl = cleanUrl.replace('/calisteflow/', '/');
    }
    let filePath = path.join(DIST_DIR, cleanUrl === '/' ? 'index.html' : cleanUrl);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

function sendCdpCommand(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const messageHandler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) {
        ws.removeEventListener('message', messageHandler);
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.result);
        }
      }
    };
    ws.addEventListener('message', messageHandler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function run() {
  const PORT = 4173;
  console.log(`[TEST] Starting static server on port ${PORT}...`);
  const server = await startServer(PORT);

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    `http://localhost:${PORT}/`
  ]);

  // Wait for remote debugging to be ready
  await new Promise(r => setTimeout(r, 1500));

  let targets = [];
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9222/json');
      targets = await res.json();
      if (targets && targets.length > 0 && targets[0].webSocketDebuggerUrl) break;
    } catch {}
    await new Promise(r => setTimeout(r, 500));
  }

  const pageTarget = targets.find(t => t.type === 'page');
  if (!pageTarget) {
    console.error('Could not find Chrome page target!');
    chromeProc.kill();
    server.close();
    process.exit(1);
  }

  console.log(`[TEST] Connecting to Chrome CDP at ${pageTarget.webSocketDebuggerUrl}...`);
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  await sendCdpCommand(ws, 'Page.enable');
  await sendCdpCommand(ws, 'Runtime.enable');
  await sendCdpCommand(ws, 'DOM.enable');

  // Dismiss disclaimers and start workout directly
  await sendCdpCommand(ws, 'Runtime.evaluate', {
    expression: `
      localStorage.setItem('calistheflow_health_disclaimer_accepted_v1', 'true');
      localStorage.setItem('calistheflow_onboarding_dismissed', 'true');
      location.reload();
    `
  });

  await new Promise(r => setTimeout(r, 1500));

  // Click on "Iniciar Treino" on Home screen
  await sendCdpCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const startBtn = btns.find(b => b.textContent && (b.textContent.includes('Iniciar') || b.textContent.includes('Começar')));
        if (startBtn) {
          startBtn.click();
          return 'Clicked: ' + startBtn.textContent.trim();
        }
        return 'Not found';
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1000));

  const viewports = [
    { width: 360, height: 640, device: 'Galaxy S8 / A12' },
    { width: 390, height: 844, device: 'iPhone 12–15' },
    { width: 430, height: 932, device: 'iPhone Pro Max / Plus' }
  ];

  let allPassed = true;

  for (const vp of viewports) {
    console.log(`\n======================================================`);
    console.log(`[TEST] Testing ${vp.device}: ${vp.width}x${vp.height} (Portrait)`);
    console.log(`======================================================`);

    await sendCdpCommand(ws, 'Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: true
    });

    await new Promise(r => setTimeout(r, 600));

    // Evaluate layout properties
    const res = await sendCdpCommand(ws, 'Runtime.evaluate', {
      expression: `
        (() => {
          const docWidth = document.documentElement.clientWidth;
          const docScrollWidth = document.documentElement.scrollWidth;
          const bodyWidth = document.body.clientWidth;
          const bodyScrollWidth = document.body.scrollWidth;

          // Check all elements for horizontal overflow
          const allEls = Array.from(document.querySelectorAll('*'));
          const overflowing = [];

          for (const el of allEls) {
            const style = window.getComputedStyle(el);
            // Ignore intentional scroll containers that have overflow-x auto/scroll or hidden
            if (style.overflowX === 'hidden' || style.overflowX === 'auto' || style.overflowX === 'scroll') {
              continue;
            }
            if (el.scrollWidth > el.clientWidth + 1) { // 1px threshold for subpixel anti-aliasing
              overflowing.push({
                tag: el.tagName.toLowerCase(),
                className: (el.className || '').toString().slice(0, 50),
                scrollWidth: el.scrollWidth,
                clientWidth: el.clientWidth,
                diff: el.scrollWidth - el.clientWidth
              });
            }
          }

          // Check footer buttons
          const footerBtns = Array.from(document.querySelectorAll('footer button')).map(b => {
            const rect = b.getBoundingClientRect();
            return {
              text: b.textContent.trim(),
              width: rect.width,
              height: rect.height,
              disabled: b.disabled
            };
          });

          // Check stepper buttons (- and +)
          const allButtons = Array.from(document.querySelectorAll('button'));
          const minusBtn = allButtons.find(b => b.getAttribute('aria-label') === 'Diminuir repetição');
          const plusBtn = allButtons.find(b => b.getAttribute('aria-label') === 'Aumentar repetição');

          const stepperSizes = {
            minus: minusBtn ? { width: minusBtn.getBoundingClientRect().width, height: minusBtn.getBoundingClientRect().height } : null,
            plus: plusBtn ? { width: plusBtn.getBoundingClientRect().width, height: plusBtn.getBoundingClientRect().height } : null
          };

          // Check accordion Mistakes
          const mistakesBtn = allButtons.find(b => b.textContent && b.textContent.includes('Erros Críticos'));

          return {
            docWidth,
            docScrollWidth,
            bodyWidth,
            bodyScrollWidth,
            hasDocHorizontalScroll: docScrollWidth > docWidth,
            hasBodyHorizontalScroll: bodyScrollWidth > bodyWidth,
            overflowingCount: overflowing.length,
            overflowingElements: overflowing.slice(0, 5),
            footerBtns,
            stepperSizes,
            hasMistakesAccordion: Boolean(mistakesBtn),
            mistakesExpanded: mistakesBtn ? mistakesBtn.getAttribute('aria-expanded') === 'true' : false
          };
        })()
      `,
      returnByValue: true
    });

    const data = res.result.value;

    console.log(`Document clientWidth: ${data.docWidth}px, scrollWidth: ${data.docScrollWidth}px`);
    console.log(`Body clientWidth: ${data.bodyWidth}px, scrollWidth: ${data.bodyScrollWidth}px`);
    console.log(`Horizontal document overflow: ${data.hasDocHorizontalScroll ? 'FAIL ❌' : 'PASS ✅'}`);
    console.log(`Overflowing elements count: ${data.overflowingCount} ${data.overflowingCount === 0 ? '✅' : '❌'}`);

    if (data.overflowingCount > 0) {
      console.log('Sample overflowing elements:', data.overflowingElements);
      allPassed = false;
    }

    console.log('Footer buttons touch targets:');
    for (const b of data.footerBtns) {
      const meets48 = b.height >= 47.9;
      console.log(`  - "${b.text}": ${b.width.toFixed(1)}x${b.height.toFixed(1)}px (disabled: ${b.disabled}) -> ${meets48 ? 'PASS >= 48px ✅' : 'FAIL < 48px ❌'}`);
      if (!meets48) allPassed = false;
    }

    if (data.stepperSizes.minus && data.stepperSizes.plus) {
      const minusOk = data.stepperSizes.minus.width >= 47.9 && data.stepperSizes.minus.height >= 47.9;
      const plusOk = data.stepperSizes.plus.width >= 47.9 && data.stepperSizes.plus.height >= 47.9;
      console.log(`Reps Stepper [-]: ${data.stepperSizes.minus.width.toFixed(1)}x${data.stepperSizes.minus.height.toFixed(1)}px -> ${minusOk ? 'PASS >= 48px ✅' : 'FAIL ❌'}`);
      console.log(`Reps Stepper [+]: ${data.stepperSizes.plus.width.toFixed(1)}x${data.stepperSizes.plus.height.toFixed(1)}px -> ${plusOk ? 'PASS >= 48px ✅' : 'FAIL ❌'}`);
      if (!minusOk || !plusOk) allPassed = false;
    } else {
      console.log('Stepper buttons found:', data.stepperSizes);
    }

    console.log(`Common Mistakes Accordion: found=${data.hasMistakesAccordion}, expanded=${data.mistakesExpanded} (Expected: false) -> ${!data.mistakesExpanded ? 'PASS (Collapsed) ✅' : 'FAIL ❌'}`);
    if (data.hasMistakesAccordion && data.mistakesExpanded) allPassed = false;
  }

  // Teardown
  ws.close();
  chromeProc.kill();
  server.close();

  console.log('\n======================================================');
  if (allPassed) {
    console.log('🎉 ALL MOBILE VIEWPORT TESTS PASSED WITH 100% SUCCESS!');
    process.exit(0);
  } else {
    console.error('❌ SOME TESTS FAILED');
    process.exit(1);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

