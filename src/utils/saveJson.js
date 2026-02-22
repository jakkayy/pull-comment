// const fs = require("fs");

// function saveJson(data) {
//   if (!fs.existsSync("output")) {
//     fs.mkdirSync("output");
//   }

//   fs.writeFileSync(
//     "output/result.json",
//     JSON.stringify(data, null, 2),
//     "utf-8"
//   );
// }

// module.exports = saveJson;

const fs = require("fs");
const path = require("path");

function saveJson(data) {
  const outputDir = path.join(__dirname, "../../output");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const filePath = path.join(outputDir, "result.json");

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = saveJson;