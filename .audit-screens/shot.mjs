import { chromium } from "playwright";
import path from "node:path";

const BASE = "http://localhost:3000";
const OUT = path.resolve(process.cwd(), ".audit-screens");

const viewports = {
  mobile: { width: 390, height: 844 },
  desktop: { width: 1440, height: 900 },
};

const pages = [
  { name: "dashboard", path: "/" },
  { name: "projects", path: "/projects" },
  { name: "project-detail", path: "/projects/slack-integration" },
  { name: "issues", path: "/issues" },
  { name: "team", path: "/team" },
  { name: "messages", path: "/messages" },
  { name: "settings", path: "/settings" },
];

async function run() {
  const browser = await chromium.launch();

  for (const [vpName, viewport] of Object.entries(viewports)) {
    const context = await browser.newContext({
      viewport,
      isMobile: vpName === "mobile",
      hasTouch: vpName === "mobile",
      deviceScaleFactor: vpName === "mobile" ? 2 : 1,
    });

    // Seed auth session + do a real login flow first
    const page = await context.newPage();
    await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
    await page.fill("#login-email", "annika@orbit.dev");
    await page.fill("#login-password", "demo");
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE}/`, { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(500);

    for (const p of pages) {
      try {
        await page.goto(`${BASE}${p.path}`, { waitUntil: "networkidle", timeout: 15000 });
        await page.waitForTimeout(600);
        const filePath = path.join(OUT, `${vpName}-${p.name}.png`);
        await page.screenshot({ path: filePath, fullPage: vpName === "desktop" });
        console.log(`Saved ${filePath}`);
      } catch (err) {
        console.error(`Failed ${vpName} ${p.path}:`, err.message);
      }
    }

    // Mobile-only interaction shots
    if (vpName === "mobile") {
      try {
        await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
        await page.waitForTimeout(400);
        const menuBtn = page.getByRole("button", { name: "Open navigation menu" });
        if (await menuBtn.count() > 0) {
          await menuBtn.click();
          await page.waitForTimeout(400);
          await page.screenshot({ path: path.join(OUT, "mobile-nav-open.png") });
          await page.keyboard.press("Escape");
        }
      } catch (err) {
        console.error("mobile nav shot failed", err.message);
      }

      try {
        await page.goto(`${BASE}/issues`, { waitUntil: "networkidle" });
        await page.waitForTimeout(400);
        await page.getByRole("button", { name: /ORB-/ }).first().click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(OUT, "mobile-issue-detail.png") });
      } catch (err) {
        console.error("mobile issue detail shot failed", err.message);
      }

      try {
        await page.goto(`${BASE}/messages`, { waitUntil: "networkidle" });
        await page.waitForTimeout(400);
        await page.getByRole("button", { name: /Chris Morgan/ }).first().click();
        await page.waitForTimeout(400);
        await page.screenshot({ path: path.join(OUT, "mobile-messages-thread.png") });
      } catch (err) {
        console.error("mobile messages thread shot failed", err.message);
      }
    }

    await context.close();
  }

  await browser.close();
}

run();
