async function autoScroll(page, times = 5) {
  for (let i = 0; i < times; i++) {
    await page.mouse.wheel(0, 4000);
    await page.waitForTimeout(2000);
  }
}

module.exports = autoScroll;