// Just an Orchestration File

import { writeCommit } from  "../commit/writeCommit.js"
import { buildTree } from "../commit/buildTree.js";
import { readIndex } from "../index/readIndex.js";
import { writeIndex } from "../index/writeIndex.js";


export function commitRepo(repoPath, commitMessage, author){

    let indexContent = readIndex(repoPath);

    if(Object.keys(indexContent).length === 0){
        throw new Error("Nothing to commit, the index is empty.");
    }

    let treeHash = buildTree(repoPath, indexContent);

    let commitHash = writeCommit(repoPath, indexContent, commitMessage, author);

    writeIndex(repoPath, {});

    console.log(`Committed as ${commitHash}`);

}