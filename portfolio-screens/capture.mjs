import { chromium } from "playwright"
import fs from "node:fs"
import path from "node:path"

const BASE = "http://localhost:3000"
const OUT = path.resolve(process.cwd(), "portfolio-screens")
fs.mkdirSync(OUT, { recursive: true })

const INTEGRATIONS = {
  slack: true,
  github: true,
  google_calendar: true,
  figma: true,
}

async function seed(page) {
  await page.addInitScript((integrations) => {
    localStorage.setItem(
      "orbit:auth",
      JSON.stringify({ email: "annika@orbit.app", signedInAt: new Date().toISOString() })
    )
    localStorage.setItem("orbit:integrations", JSON.stringify(integrations))
  }, INTEGRATIONS)
}

async function waitSettled(page) {
  await page.waitForLoadState("networkidle").catch(() => {})
  await page.locator(".orbit-boot-loader").waitFor({ state: "hidden", timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(600)
}

async function shot(page, name) {
  const file = path.join(OUT, `${name}.png`)
  await page.screenshot({ path: file, type: "png" })
  console.log(`saved ${name}.png`)
}

const browser = await chromium.launch()

{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "light",
  })
  const page = await context.newPage()
  await seed(page)

  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" })
  await waitSettled(page)
  await shot(page, "01-desktop-dashboard")

  await page.goto(`${BASE}/projects/slack-integration`, { waitUntil: "domcontentloaded" })
  await waitSettled(page)
  await shot(page, "02-desktop-board")

  await page.goto(`${BASE}/issues`, { waitUntil: "domcontentloaded" })
  await waitSettled(page)
  await shot(page, "03-desktop-issues")

  await page.goto(`${BASE}/messages`, { waitUntil: "domcontentloaded" })
  await waitSettled(page)
  await shot(page, "04-desktop-messages")

  await context.close()
}

{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  })
  const page = await context.newPage()
  await seed(page)
  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark")
  })
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" })
  await waitSettled(page)
  await page.evaluate(() => {
    document.documentElement.classList.add("dark")
    document.documentElement.style.colorScheme = "dark"
  })
  await page.waitForTimeout(400)
  await shot(page, "08-desktop-dashboard-dark")
  await context.close()
}

{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    colorScheme: "light",
  })
  const page = await context.newPage()
  await seed(page)

  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" })
  await waitSettled(page)
  await shot(page, "05-phone-dashboard")

  await page.goto(`${BASE}/projects/slack-integration`, { waitUntil: "domcontentloaded" })
  await waitSettled(page)
  await shot(page, "06-phone-board")

  await page.goto(`${BASE}/messages`, { waitUntil: "domcontentloaded" })
  await waitSettled(page)
  await page.getByText("Chris Morgan", { exact: true }).first().click()
  await page.waitForTimeout(500)
  await shot(page, "07-phone-messages-thread")

  await context.close()
}

await browser.close()
console.log(`done → ${OUT}`)
