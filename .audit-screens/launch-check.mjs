import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const BASE = "http://localhost:3000";
const OUT = path.resolve(process.cwd(), ".audit-screens");
fs.mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: "phone", width: 390, height: 844, isMobile: true },
  { name: "phablet", width: 700, height: 900, isMobile: true },
  { name: "tablet", width: 834, height: 1112, isMobile: true },
  { name: "desktop", width: 1440, height: 900, isMobile: false },
];

const pages = [
  { name: "dashboard", path: "/" },
  { name: "projects", path: "/projects" },
  { name: "board", path: "/projects/slack-integration" },
  { name: "issues", path: "/issues" },
  { name: "messages", path: "/messages" },
  { name: "team", path: "/team" },
  { name: "settings", path: "/settings" },
];

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.fill("#login-email", "annika@orbit.dev");
  await page.fill("#login-password", "demo");
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE}/`, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(300);
}

const browser = await chromium.launch();
const report = [];

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.isMobile,
    hasTouch: vp.isMobile,
    deviceScaleFactor: vp.name === "desktop" ? 1 : 2,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (err) => errors.push(`${vp.name}: ${err.message}`));
  await login(page);

  for (const p of pages) {
    await page.goto(`${BASE}${p.path}`, { waitUntil: "networkidle", timeout: 20000 });
    await page.waitForTimeout(400);
    if (p.name === "board") {
      await page.getByRole("tab", { name: /Board/i }).click().catch(() => {});
      await page.waitForTimeout(300);
    }
    const tabBar = await page.getByRole("navigation", { name: "Primary" }).isVisible().catch(() => false);
    const filtersBtn = await page.getByRole("button", { name: /^Filters/ }).isVisible().catch(() => false);
    const statusFilter = await page.getByRole("button", { name: /Status:/ }).isVisible().catch(() => false);
    const dueChip = await page.getByRole("button", { name: /Due Date/ }).isVisible().catch(() => false);
    const moveBtn = await page.getByRole("button", { name: /^Move$/ }).first().isVisible().catch(() => false);
    const settingsList = await page.getByRole("navigation", { name: "Settings sections" }).isVisible().catch(() => false);
    await page.screenshot({
      path: path.join(OUT, `launch-${vp.name}-${p.name}.png`),
    });
    report.push({
      vp: vp.name,
      page: p.name,
      tabBar,
      filtersBtn,
      statusFilter,
      dueChip,
      moveBtn,
      settingsList,
    });
  }

  report.push({ vp: vp.name, errors });
  await context.close();
}

await browser.close();
console.log(JSON.stringify(report, null, 2));
