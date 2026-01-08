// Read HEAD -> go to refs -> get latest commit hash -> create new commit pointing to previous commit -> write commit object -> update ref to point to new commit

import { writeObject } from "../objects/writeObject.js";
import { buildTree } from "./buildTree.js";
import path from "path";
import fs from "fs";

export function writeCommit(repoPath, parsedIndexContent, commitMessage, author = 'Anonymous'){
    const treeHash = buildTree(repoPath, parsedIndexContent);

    let commitContent = `tree ${treeHash}\n`;

    let headPath = path.join(repoPath, ".forge", "HEAD");
    let currentRef = fs.readFileSync(headPath, 'utf-8').trim();

    let parentHash = null;
 
    if(currentRef.startsWith('ref:')){
        const refPath = currentRef.slice(5).trim();
        const fullRefPath = path.join(repoPath, ".forge", refPath);
        if(fs.existsSync(fullRefPath)){
            parentHash = fs.readFileSync(fullRefPath, 'utf-8').trim();
            commitContent += `parent ${parentHash}\n`;
        }
    }else{
        fs.writeFileSync(headPath, `ref: refs/heads/main\n`);
        currentRef = fs.readFileSync(headPath, 'utf-8').trim();
    }

    const timestamp = Math.floor(Date.now() / 1000);
    commitContent += `author ${author} ${timestamp} +0000\n`;
    commitContent += `committer ${author} ${timestamp} +0000\n\n`;
    commitContent += `${commitMessage}\n`;

    const commitBuffer = Buffer.from(commitContent, 'utf-8');
    const commitHash = writeObject(repoPath, 'commit', commitBuffer);

    // Update the ref to point to the new commit
    let refToUpdate = currentRef.split(' ')[1];
    const refFullPath = path.join(repoPath, ".forge", refToUpdate);
    fs.writeFileSync(refFullPath, commitHash);
    

    return commitHash;
}