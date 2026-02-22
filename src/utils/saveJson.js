const fs = require("fs");

function saveJson(data) {
  if (!fs.existsSync("output")) {
    fs.mkdirSync("output");
  }

  fs.writeFileSync(
    "output/result.json",
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

module.exports = saveJson;