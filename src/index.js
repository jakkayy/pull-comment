const { pageUrl, headless } = require("./config");
const launchBrowser = require("./browser/launchBrowser");
const autoScroll = require("./scraper/scroll");
const extractPosts = require("./scraper/extractPosts");
const saveJson = require("./utils/saveJson");

(async () => {
  console.log("Starting scraper...");

  const { browser, page } = await launchBrowser(headless);

  await page.goto(pageUrl, { waitUntil: "domcontentloaded" });

  await page.waitForSelector('[role="article"]', { timeout: 15000 });

  await autoScroll(page, 5);

  const data = await extractPosts(page, browser, 3);

  saveJson(data);

  console.log("Done. Saved to output/result.json");

  await browser.close();
})();