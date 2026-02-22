async function autoScroll(page) {
  for (let i = 0; i < 4; i++) {
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(1000);
  }
}

async function expandComments(page) {
  try {
    for (let i = 0; i < 5; i++) {
      const moreBtn = page
        .locator('text=ดูความคิดเห็นเพิ่มเติม, text=View more comments')
        .first();

      if (!(await moreBtn.count())) break;

      await moreBtn.click().catch(() => {});
      await page.waitForTimeout(1000);
    }
  } catch {}
}

async function extractComments(page) {
  try {
    // รอ comment section
    await page.waitForSelector('div[role="article"]', { timeout: 5000 }).catch(() => {});

    await autoScroll(page);
    await expandComments(page);

    const commentNodes = await page
      .locator('div[dir="auto"]')
      .all();

    const comments = [];

    for (const node of commentNodes) {
      const text = (await node.innerText()).trim();

      if (
        text.length > 2 &&
        text.length < 300 &&
        !text.includes("ถูกใจ") &&
        !text.includes("ตอบกลับ") &&
        !text.includes("แชร์")
      ) {
        comments.push(text);
      }
    }

    return [...new Set(comments)];
  } catch (err) {
    console.log("Comment error:", err.message);
    return [];
  }
}

module.exports = extractComments;