import fs from 'fs';
import path from 'path';

export function readIndex(repoPath){

    let indexPath = path.join(repoPath, ".forge", "index");

    if(!fs.existsSync(indexPath)){
        throw new Error("Index file does not exist.");
    }

    let indexContent = fs.readFileSync(indexPath, 'utf-8').trim();

    if(indexContent === ""){
        return {};
    }
    

    return JSON.parse(indexContent);

}