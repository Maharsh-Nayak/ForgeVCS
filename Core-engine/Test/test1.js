import { initRepo, writeObject, readObject } from "../index.js";
import fs from "fs";

const repoPath = process.cwd();

// 1. Init repo
initRepo(repoPath);

// 2. Create a blob
const content = Buffer.from("hello forgevcs");
const hash = writeObject(repoPath, "blob", content);

console.log("Object hash:", hash);

// 3. Read it back
const read = readObject(repoPath, hash);

console.log("Read content:", read.toString());
