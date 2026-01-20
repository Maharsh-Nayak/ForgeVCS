// Just an Orchestration File

import { writeCommit } from  "../commit/writeCommit.js"
import { buildTree } from "../commit/buildTree.js";
import { readIndex } from "../index/readIndex.js";
import { writeIndex } from "../index/writeIndex.js";
import fs from 'fs';
import path from 'path';


export function commitRepo(repoPath, commitMessage, author){

    let indexContent = readIndex(repoPath);

    if(Object.keys(indexContent).length === 0){
        throw new Error("Nothing to commit, the index is empty.");
    }

    let treeHash = buildTree(repoPath, indexContent);

    let commitHash = writeCommit(repoPath, indexContent, commitMessage, author);

    let indexPath = path.join(repoPath, ".forge", "index");
    fs.writeFileSync(indexPath, JSON.stringify({}, null, 2), 'utf-8');

    console.log(`Committed as ${commitHash}`);

}