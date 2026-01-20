import { addRepo } from "../index.js";
import { commitRepo } from "../index.js";

const repoPath = process.cwd();

console.log("🚀 Pushing to remote repository...");

addRepo(repoPath, "c.txt");
commitRepo(repoPath, "third commit", "maharsh");

console.log("✅ Push operation simulated (no actual remote operations implemented).");