import fs from "fs";
import path from "path";

import {
  initRepo,
  addRepo,
  commitRepo,
  readObject
} from "../index.js";

const repoPath = process.cwd();

function cleanRepo() {
  const p = path.join(repoPath, ".mygit");
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
  }
}

function readHeadCommit() {
  const head = fs.readFileSync(path.join(repoPath, ".forge", "HEAD"), "utf-8").trim();
  const refPath = head.split(" ")[1];
  const fullRefPath = path.join(repoPath, ".forge", refPath);
  return fs.readFileSync(fullRefPath, "utf-8").trim();
}

console.log("🧹 Cleaning old repo...");
cleanRepo();

console.log("🚀 Initializing repo...");
initRepo(repoPath);

console.log("📝 Creating files...");
fs.writeFileSync("a.txt", "hello");
fs.writeFileSync("b.txt", "world");

console.log("➕ Adding files...");
addRepo(repoPath, "a.txt");
addRepo(repoPath, "b.txt");

console.log("📦 First commit...");
commitRepo(repoPath, "first commit", "maharsh");
let commit1 = readHeadCommit();
console.log("First commit hash:", commit1);

// Inspect commit object
let commit1Obj = readObject(repoPath, commit1);
console.log("First commit content:\n", commit1Obj.toString());

console.log("✏️ Modifying a.txt...");
fs.writeFileSync("a.txt", "HELLO");

console.log("➕ Adding a.txt again...");
addRepo(repoPath, "a.txt");

console.log("📦 Second commit...");
commitRepo(repoPath, "second commit", "maharsh");

let commit2 = readHeadCommit();
console.log("Second commit hash:", commit2);

// Inspect second commit
let commit2Obj = readObject(repoPath, commit2);
console.log("Second commit content:\n", commit2Obj.toString());

console.log("🔍 Verifying parent linkage...");

if (!commit2Obj.toString().includes(commit1)) {
  console.error("❌ ERROR: Parent commit not linked properly!");
} else {
  console.log("✅ Parent commit linked correctly.");
}

console.log("📂 Checking index is empty after commit...");
const indexContent = fs.readFileSync(path.join(repoPath, ".forge", "index"), "utf-8").trim();

if (indexContent === "" || indexContent === "{}") {
  console.log("✅ Index is cleared after commit.");
} else {
  console.error("❌ ERROR: Index not cleared:", indexContent);
}

console.log("🎉 All tests finished.");
