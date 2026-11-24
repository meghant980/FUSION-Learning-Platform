
const fs = require("fs");
const path = require("path");

const LOCAL_API_URL = "https://fusion-e-learning-platform.onrender.com";

const API_URL = (process.env.REACT_APP_API_URL || "")
  .trim()
  .replace(/\/+$/, "");

const BUILD_DIRECTORY = path.resolve(process.cwd(), "build");

const TEXT_EXTENSIONS = new Set([
  ".js",
  ".css",
  ".html",
  ".json",
  ".map",
  ".txt",
  ".xml",
  ".webmanifest",
]);

if (!API_URL) {
  console.error(
    "\nERROR: REACT_APP_API_URL is missing.\n" +
    "Set it to your public HTTPS backend URL before building Fusion.\n"
  );
  process.exit(1);
}

try {
  const parsedURL = new URL(API_URL);

  if (parsedURL.protocol !== "https:") {
    throw new Error("The production backend URL must use HTTPS.");
  }

  if (parsedURL.pathname !== "/" || parsedURL.search || parsedURL.hash) {
    throw new Error(
      "Use only the backend base URL. Do not add /api or an endpoint."
    );
  }
} catch (error) {
  console.error("ERROR: Invalid REACT_APP_API_URL:", error.message);
  process.exit(1);
}

if (!fs.existsSync(BUILD_DIRECTORY)) {
  console.error("ERROR: React build directory was not found.");
  console.error("Run the React build before running this script.");
  process.exit(1);
}

let changedFiles = 0;
let totalReplacements = 0;

function replaceInDirectory(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      replaceInDirectory(fullPath);
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();

    if (!TEXT_EXTENSIONS.has(extension)) {
      continue;
    }

    const content = fs.readFileSync(fullPath, "utf8");

    if (!content.includes(LOCAL_API_URL)) {
      continue;
    }

    const occurrences =
      content.split(LOCAL_API_URL).length - 1;

    const updatedContent = content.split(LOCAL_API_URL).join(API_URL);

    fs.writeFileSync(fullPath, updatedContent, "utf8");

    changedFiles++;
    totalReplacements += occurrences;
  }
}

replaceInDirectory(BUILD_DIRECTORY);

if (totalReplacements === 0) {
  console.error(
    "ERROR: No localhost:5001 references were found in the production build."
  );
  process.exit(1);
}

console.log("\nFusion production API configuration completed.");
console.log("Backend URL:", API_URL);
console.log("Files updated:", changedFiles);
console.log("References replaced:", totalReplacements);
console.log("Local source files were not modified.\n");
