import path from 'path';
import fs from 'fs';
import { hashFile } from './hash.js';

export function writeObject(repoPath, type, contentBuf){

    let hash = hashFile(type, contentBuf);
    
    let dir = path.join(repoPath, ".forge", "objects", hash.slice(0, 2));
    let file = path.join(dir, hash.slice(2));
    
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    if(!fs.existsSync(file)){
        fs.writeFileSync(file, contentBuf);
    }

    return hash;
}