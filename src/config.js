require("dotenv").config();

module.exports = {
  pageUrl: process.env.PAGE_URL,
  headless: process.env.HEADLESS === "true",
};