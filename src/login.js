const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://facebook.com");

  console.log("Login manually, then press Enter in terminal...");
  process.stdin.once("data", async () => {
    await context.storageState({ path: "auth.json" });
    console.log("Saved login session!");
    await browser.close();
    process.exit();
  });
})();