import fs from 'fs';
import path from 'path';
import axios from 'axios';

export async function pushRepo(username, password) {

    let configPath = path.join(process.cwd(), ".forge", 'config.json');

    if (!fs.existsSync(configPath)) {
        throw new Error("No remote repository set. Please set a remote repository before pushing.");
    }

    let configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    let remotePath = configData.remote;

    let remoteMain = await axios.get(`${remotePath}/main`).then(response => response.data)
    .catch(error => {
        throw new Error("Failed to fetch remote main branch: " + error.message);
    });

    let currentMain = fs.readFileSync(path.join(process.cwd(), ".forge", "refs", "heads", "main"), 'utf-8').trim();
    let response = {
        newMain: currentMain,
        rawObjects: []
    };

    while(currentMain !== remoteMain) {
        let objectData = fs.readFileSync(path.join(process.cwd(), ".forge", "objects", currentMain));
        response.rawObjects.push({ hash: currentMain, data: objectData.toString('base64') });

        let commitData = JSON.parse(Buffer.from(objectData, 'base64').toString('utf-8'));

        let treeHash = commitData.tree;
        let treeData = fs.readFileSync(path.join(process.cwd(), ".forge", "objects", treeHash));
        let entries = treeData.toString('utf-8').split('\n').filter(line => line.length > 0);
        let treeEntries = [];

        for(let entry of entries) {
            let [type, hash, name] = entry.split(' ');
            treeEntries.push({ "type": type, "hash": hash, "name": name });
        }

        response.rawObjects.push({ hash: treeHash, data: Buffer.from(JSON.stringify(treeEntries)).toString('base64') });

        for(let entry of treeEntries) {
            if (entry.type === 'blob') {
                let blobData = fs.readFileSync(path.join(process.cwd(), ".forge", "objects", entry.hash));
                response.rawObjects.push({ hash: entry.hash, data: blobData.toString('base64') });
            }
        }

        currentMain = commitData.parent;
    }

}