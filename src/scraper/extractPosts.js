const extractComments = require("./extractComments");

function cleanCaption(text) {
  if (!text) return "";
  return text.replace("ดูเพิ่มเติม", "").trim();
}

function normalizeUrl(url) {
  return url.split("?")[0];
}

async function getPageName(feedPage) {
  try {
    const nameLocator = feedPage.locator('h1').first();

    if (await nameLocator.count()) {
      return (await nameLocator.innerText()).trim();
    }

    return "";
  } catch {
    return "";
  }
}

async function getPostLinks(feedPage, limit = 3) {
  const links = new Set();

  const articles = feedPage.locator('[role="article"]');
  const count = await articles.count();

  for (let i = 0; i < count; i++) {
    const article = articles.nth(i);
    const anchor = article.locator('a[href*="/posts/"]').first();

    if (!(await anchor.count())) continue;

    let href = await anchor.getAttribute("href");
    if (!href) continue;

    if (href.startsWith("/")) {
      href = "https://www.facebook.com" + href;
    }

    const cleanUrl = normalizeUrl(href);
    links.add(cleanUrl);

    if (links.size >= limit) break;
  }

  return Array.from(links);
}

async function extractPosts(feedPage, browser, limit = 3) {
  const results = [];

  // 🔥 ดึงชื่อเพจครั้งเดียว
  const pageName = await getPageName(feedPage);

  const postLinks = await getPostLinks(feedPage, limit);

  for (const link of postLinks) {
    console.log("Opening:", link);

    const postPage = await browser.newPage();
    await postPage.goto(link, { waitUntil: "domcontentloaded" });
    await postPage.waitForTimeout(1500);

    let caption = "";
    try {
      const captionLocator = postPage
        .locator('[data-ad-preview="message"]')
        .first();

      if (await captionLocator.count()) {
        caption = cleanCaption(await captionLocator.innerText());
      }
    } catch {}

    let images = [];
    try {
      const imgLocator = postPage
        .locator('img[src*="scontent"]')
        .first();

      if (await imgLocator.count()) {
        const src = await imgLocator.getAttribute("src");
        if (src) images.push(src);
      }
    } catch {}

    const comments = await extractComments(postPage, caption);

    results.push({
      pageName,   // 🔥 เพิ่มตรงนี้
      link,
      caption,
      images,
      comments,
    });

    await postPage.close();
  }

  return results;
}

module.exports = extractPosts;