import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';

const START_PORT = 3030;
const SCREENSHOT_DIR = path.resolve('.codex-screenshots');
const DESKTOP_PATH = path.join(SCREENSHOT_DIR, 'dashboard-pass1-desktop.png');
const MOBILE_PATH = path.join(SCREENSHOT_DIR, 'dashboard-pass1-mobile.png');

async function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '127.0.0.1');
  });
}

async function findFreePort(startPort) {
  for (let port = startPort; port < startPort + 20; port += 1) {
    if (await isPortFree(port)) return port;
  }
  throw new Error(`No free port found from ${startPort} to ${startPort + 19}`);
}

async function waitForReady(url, timeoutMs = 60000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const ready = await new Promise((resolve) => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve(res.statusCode && res.statusCode < 500);
      });
      req.on('error', () => resolve(false));
      req.setTimeout(2000, () => {
        req.destroy();
        resolve(false);
      });
    });

    if (ready) return;
    await new Promise((resolve) => setTimeout(resolve, 750));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function captureDashboard(page, url, viewport, outputPath) {
  await page.setViewportSize(viewport);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.addStyleTag({
    content: '.fixed { visibility: hidden !important; }',
  });
  const dashboard = page.locator('#proof');
  const metrics = await dashboard.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      height: rect.height,
      top: rect.top + window.scrollY,
    };
  });

  const captureHeight = Math.max(viewport.height, Math.ceil(metrics.height + 8));
  await page.setViewportSize({ width: viewport.width, height: captureHeight });
  await page.evaluate((top) => {
    window.scrollTo({ top, behavior: 'instant' });
  }, metrics.top);
  await page.waitForTimeout(2000);
  await dashboard.screenshot({ path: outputPath });
}

const port = await findFreePort(START_PORT);
const baseUrl = `http://127.0.0.1:${port}`;
let devServer;
let browser;

try {
  await fs.mkdir(SCREENSHOT_DIR, { recursive: true });

  devServer = spawn('npm', ['run', 'dev', '--', '--port', String(port)], {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, PORT: String(port) },
  });

  devServer.stdout.on('data', (chunk) => process.stdout.write(`[next] ${chunk}`));
  devServer.stderr.on('data', (chunk) => process.stderr.write(`[next] ${chunk}`));

  await waitForReady(baseUrl);

  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await captureDashboard(page, baseUrl, { width: 1440, height: 900 }, DESKTOP_PATH);
  await captureDashboard(page, baseUrl, { width: 390, height: 844 }, MOBILE_PATH);

  console.log('Visual check complete:');
  console.log(`- ${DESKTOP_PATH}`);
  console.log(`- ${MOBILE_PATH}`);
} finally {
  if (browser) {
    await browser.close();
  }
  if (devServer?.pid) {
    try {
      process.kill(-devServer.pid);
    } catch {
      devServer.kill('SIGTERM');
    }
  }
}
