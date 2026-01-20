import fs from 'fs';
import path from 'path';
import log from '../log.js';
import axios from 'axios';

export async function pullRepo() {
    let logPath = path.join(process.cwd(), ".forge");

    if (!fs.existsSync(logPath)) {
        throw new Error("No repository found. Please initialize a repository first.");
    }

    let remotePath = path.join(process.cwd(), ".forge", 'config.json');

    if (!fs.existsSync(remotePath)) {
        throw new Error("No remote repository set. Please set a remote repository before pulling.");
    }

    let remote = JSON.parse(fs.readFileSync(remotePath, 'utf-8')).remote;

    let currentCommit = fs.readFileSync(path.join(process.cwd(), ".forge", "refs", "heads", "main"), 'utf-8').trim();

    let {newMain, rawObjects} = await axios.get(`${remote}/pull/${currentCommit}`).then(response => response.data)
    .catch(error => {
        throw new Error("Failed to fetch pull data: " + error.message);
    });

    let newHead = newMain;
    let objects = JSON.parse(rawObjects);



    while(newMain !== currentCommit) {
        let obj = objects[newMain];
        let commitData = JSON.parse(Buffer.from(objects[newMain], 'base64').toString('utf-8'));
        fs.mkdirSync(path.join(process.cwd(), ".forge", "objects", newMain.slice(0, 2)), { recursive: true });
        fs.writeFileSync(path.join(process.cwd(), ".forge", "objects", newMain.slice(2)), Buffer.from(commitData, 'base64'));

        //explore the tree and write all files
        let treeHash = commitData.tree;

        let tree = objects[treeHash];

        // write tree

        fs.mkdirSync(path.join(process.cwd(), ".forge", "objects", treeHash.slice(0, 2)), { recursive: true });
        
        let treeData = JSON.parse(Buffer.from(tree, 'base64').toString('utf-8'));
        
        for(let entry of treeData) {

            let fileName = entry.name;
            let fileHash = entry.hash;
            let fileType = entry.type;

            fs.writeFileSync(path.join(process.cwd(), ".forge", "objects", treeHash.slice(2)), Buffer.from(fileType, 'base64'));
            fs.appendFileSync(path.join(process.cwd(), ".forge", "objects", treeHash.slice(2)), Buffer.from(fileHash, 'base64'));
            fs.appendFileSync(path.join(process.cwd(), ".forge", "objects", treeHash.slice(2)), Buffer.from(fileName, 'base64'));

    
            if (fileType === 'blob') {
                let blobData = objects[fileHash];
                fs.writeFileSync(path.join(process.cwd(), fileName), Buffer.from(blobData, 'base64'));
                fs.mkdirSync(path.join(process.cwd(), ".forge", "objects", fileHash.slice(0, 2)), { recursive: true });
                fs.writeFileSync(path.join(process.cwd(), ".forge", "objects", fileHash.slice(2)), Buffer.from(blobData, 'base64'));
            }

        }

        newMain = commitData.parent;

    }

    fs.writeFileSync(path.join(process.cwd(), ".forge", "refs", "heads", "main"), newHead);
    log("Repository successfully pulled from remote.");

}