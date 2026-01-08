import { writeIndex } from "../index/writeIndex.js";
import { writeObject } from "../objects/writeObject.js";
import { readObject } from "../objects/readObject.js";
import fs, { read } from 'fs';

export function addRepo(repoPath, filePath){
    
    if(!fs.existsSync(filePath)){
        throw new Error("File to add does not exist.");
    }

    let contentBuf = fs.readFileSync(filePath);

    let blobHash = writeObject(repoPath, 'blob', contentBuf);

    writeIndex(repoPath, filePath, blobHash);

    console.log(`Added file ${filePath} to repository with blob hash ${blobHash}.`);

}