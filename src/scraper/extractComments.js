async function autoScroll(page) {
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(1000);
  }
}

async function expandComments(page) {
  try {
    for (let i = 0; i < 8; i++) {
      const moreBtn = page
        .locator('text=ดูความคิดเห็นเพิ่มเติม, text=View more comments')
        .first();

      if (!(await moreBtn.count())) break;

      await moreBtn.click().catch(() => {});
      await page.waitForTimeout(1200);
    }
  } catch (err) {
    console.log("Expand error:", err.message);
  }
}

async function extractComments(page, caption = "") {
  try {
    // รอ section โหลด
    await page.waitForSelector('[role="article"]', {
      timeout: 10000,
    }).catch(() => {});

    await autoScroll(page);
    await expandComments(page);

    const articles = page.locator('[role="article"]');
    const count = await articles.count();

    const comments = [];

    // 🔥 ข้าม article แรก (โพสต์หลัก)
    for (let i = 1; i < count; i++) {
      const article = articles.nth(i);

      const textNode = article.locator('div[dir="auto"]').first();
      if (!(await textNode.count())) continue;

      let text = await textNode.innerText();
      text = text.replace(/\s+/g, " ").trim();

      if (!text) continue;

      // 🔥 filter กัน caption + hashtag + link + เงื่อนไข
      if (
        text.length > 2 &&
        text.length < 500 &&
        !caption.includes(text) &&
        !text.startsWith("#") &&
        !text.startsWith("•") &&
        !text.startsWith("http") &&
        text !== "หมายเหตุ" &&
        text !== "เงื่อนไข" &&
        text !== "ดูเพิ่มเติม"
      ) {
        comments.push(text);
      }
    }

    // กันซ้ำ
    return [...new Set(comments)];
  } catch (err) {
    console.log("Comment error:", err.message);
    return [];
  }
}

module.exports = extractComments;