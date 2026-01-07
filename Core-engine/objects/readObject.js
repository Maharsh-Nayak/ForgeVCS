import path from 'path';
import fs from 'fs';

export function readObject(repoPath, hash){

    let dir = hash.slice(0,2);
    let file=hash.slice(2);

    let objectPath = path.join(repoPath, ".forge", "objects", dir, file);

    if(!fs.existsSync(objectPath)){
        throw new Error(`Object with hash ${hash} does not exist.`);
    }

    return fs.readFileSync(objectPath);
}