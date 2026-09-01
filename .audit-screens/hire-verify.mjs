import { chromium } from "playwright";
import path from "node:path";

const BASE = "http://localhost:3000";
const OUT = path.resolve(process.cwd(), ".audit-screens");

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.fill("#login-email", "annika@orbit.dev");
  await page.fill("#login-password", "demo");
  await page.click('button[type="submit"]');
  await page.waitUntil?.();
  await page.waitForURL(`${BASE}/`, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(400);
}

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (err) => errors.push(err.message));

  await login(page);

  await page.goto(`${BASE}/settings`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const settingsLinks = await page.getByRole("button", { name: "Profile" }).count();
  const settingsTabs = await page.getByRole("tab").count();
  await page.screenshot({ path: path.join(OUT, "hire-settings-index.png") });

  await page.getByRole("button", { name: "Integrations" }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, "hire-settings-integrations.png") });
  const back = await page.getByRole("button", { name: "Settings" }).count();

  await page.goto(`${BASE}/issues`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const inlineStatus = await page.getByRole("button", { name: /Status:/ }).count();
  const filtersBtn = page.getByRole("button", { name: /^Filters/ });
  await page.screenshot({ path: path.join(OUT, "hire-issues-header.png") });
  await filtersBtn.click();
  await page.waitForTimeout(400);
  const sheetTitle = await page.getByRole("heading", { name: "Filters" }).count();
  await page.screenshot({ path: path.join(OUT, "hire-issues-filters-sheet.png") });
  await page.getByRole("button", { name: "High", exact: true }).click();
  await page.getByRole("button", { name: "Done" }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, "hire-issues-filtered.png") });
  const badge = await page.getByRole("button", { name: /^Filters/ }).innerText();

  await page.goto(`${BASE}/projects/slack-integration`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const dueChip = await page.getByText("Due Date").count();
  await page.screenshot({ path: path.join(OUT, "hire-board.png") });

  console.log(
    JSON.stringify(
      {
        errors,
        settingsLinks,
        settingsTabs,
        back,
        inlineStatus,
        sheetTitle,
        badge,
        dueChip,
      },
      null,
      2
    )
  );

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
