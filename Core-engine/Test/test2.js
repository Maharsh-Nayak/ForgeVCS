import { initRepo, addRepo } from "../index.js";
import fs from "fs";

// Create test file
fs.writeFileSync("a.txt", "hello world");

initRepo(process.cwd());
addRepo(process.cwd(), "a.txt");
