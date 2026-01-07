import fs from 'fs';
import path from 'path';

// Initialize a new repository at the given path

export function initRepo(repoPath){

    let forgePath = path.join(repoPath, ".forge");
    if(!fs.existsSync(forgePath)){
        fs.mkdirSync(forgePath);
    }

    let objectsPath = path.join(forgePath, "objects");
    if(!fs.existsSync(objectsPath)){
        fs.mkdirSync(objectsPath);
    }

    let refsPath = path.join(forgePath, "refs", "heads");
    if(!fs.existsSync(refsPath)){
        fs.mkdirSync(refsPath, { recursive: true });
    }

    let headPath = path.join(forgePath, "HEAD");
    if(!fs.existsSync(headPath)){
        fs.writeFileSync(headPath, "ref: refs/heads/main\n", 'utf8');
    }

    let indexPath = path.join(forgePath, "index");
    if(!fs.existsSync(indexPath)){
        fs.writeFileSync(indexPath, "");
    }

}