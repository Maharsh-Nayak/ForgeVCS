import fs from 'fs';
import path from 'path';
import { readIndex } from '../index/readIndex.js';

export function writeIndex(repoPath, file, blobHash){

    let indexPath = path.join(repoPath, ".forge", "index");

    let parsedIndexContent = readIndex(repoPath);

    parsedIndexContent[file] = blobHash;
    
    fs.writeFileSync(indexPath, JSON.stringify(parsedIndexContent, null, 2), 'utf-8');

}