import { chromium } from 'playwright'

const url = process.env.APP_URL || 'http://localhost:3000'
const widths = [320, 375, 390, 768]

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()

let failed = false

for (const width of widths) {
  await page.setViewportSize({ width, height: 800 })
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
  await page.waitForTimeout(500)

  const metrics = await page.evaluate(() => {
    const doc = document.documentElement
    const body = document.body
    const overflow =
      Math.max(doc.scrollWidth, body.scrollWidth) - doc.clientWidth > 1
    return {
      scrollWidth: Math.max(doc.scrollWidth, body.scrollWidth),
      clientWidth: doc.clientWidth,
      overflow,
    }
  })

  const status = metrics.overflow ? 'FAIL' : 'OK'
  console.log(
    `[${status}] ${width}px — scroll ${metrics.scrollWidth}px vs viewport ${metrics.clientWidth}px`
  )
  if (metrics.overflow) failed = true
}

await browser.close()
process.exit(failed ? 1 : 0)
