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

function isRealComment(text, caption) {
  if (!text) return false;

  const clean = text.trim();

  if (clean.length < 2) return false;
  if (clean.length > 400) return false;

  // ❌ กัน caption ทั้งหมด
  if (caption && caption.includes(clean)) return false;

  // ❌ กัน hashtag block
  if (clean.startsWith("#")) return false;

  // ❌ กัน bullet เงื่อนไข
  if (clean.startsWith("•")) return false;

  // ❌ กันคำ UI
  if (
    clean.includes("ถูกใจ") ||
    clean.includes("ตอบกลับ") ||
    clean.includes("แชร์")
  ) return false;

  return true;
}

async function extractComments(page, caption = "") {
  try {
    await autoScroll(page);
    await expandComments(page);

    // 🔥 ดึงเฉพาะ comment container จริง
    const commentContainers = await page
      .locator('[aria-label="Comment"]')
      .all();

    const comments = [];

    for (const container of commentContainers) {
      const textNode = container.locator('div[dir="auto"]').first();

      if (!(await textNode.count())) continue;

      const text = (await textNode.innerText()).trim();

      if (isRealComment(text, caption)) {
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