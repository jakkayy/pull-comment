const { chromium } = require("playwright");
const fs = require("fs");

async function launchBrowser(headless) {
  const browser = await chromium.launch({ headless });

  const contextOptions = {};

  if (fs.existsSync("auth.json")) {
    contextOptions.storageState = "auth.json";
  }

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  return { browser, context, page };
}

module.exports = launchBrowser;