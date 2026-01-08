import { writeObject } from "../objects/writeObject.js";

export function buildTree(repoPath, parsedIndexContent){
    
    let treeEntry = '';

    for(const [file, hash] of Object.entries(parsedIndexContent)){
        treeEntry += `blob\t${hash}\t${file}\n`;
    }

    const treeContent = Buffer.from(treeEntry, 'utf-8');
    const treeHash = writeObject(repoPath, 'tree', treeContent);

    return treeHash;
}