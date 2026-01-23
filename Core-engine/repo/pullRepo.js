import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Helper function to parse commit object (plain text format)
function parseCommit(commitContent) {
    const lines = commitContent.toString('utf-8').split('\n');
    const commit = { tree: null, parent: null, author: null, committer: null, message: '' };
    
    let messageStart = false;
    for (const line of lines) {
        if (line.startsWith('tree ')) {
            commit.tree = line.slice(5).trim();
        } else if (line.startsWith('parent ')) {
            commit.parent = line.slice(7).trim();
        } else if (line.startsWith('author ')) {
            commit.author = line.slice(7).trim();
        } else if (line.startsWith('committer ')) {
            commit.committer = line.slice(10).trim();
        } else if (line === '') {
            messageStart = true;
        } else if (messageStart) {
            commit.message += (commit.message ? '\n' : '') + line;
        }
    }
    
    return commit;
}

// Helper function to write object to correct path
function writeObjectToRepo(repoPath, hash, data) {
    const dir = path.join(repoPath, ".forge", "objects", hash.slice(0, 2));
    const file = path.join(dir, hash.slice(2));
    
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    // Only write if it doesn't exist (immutability)
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, data);
    }
}

export async function pullRepo() {
    const repoPath = process.cwd();
    const forgePath = path.join(repoPath, ".forge");

    if (!fs.existsSync(forgePath)) {
        throw new Error("No repository found. Please initialize a repository first.");
    }

    const configPath = path.join(repoPath, ".forge", 'config.json');

    if (!fs.existsSync(configPath)) {
        throw new Error("No remote repository set. Please set a remote repository before pulling.");
    }

    const remote = JSON.parse(fs.readFileSync(configPath, 'utf-8')).remote;

    const currentMainPath = path.join(repoPath, ".forge", "refs", "heads", "main");
    let currentCommit = null;
    if (fs.existsSync(currentMainPath)) {
        currentCommit = fs.readFileSync(currentMainPath, 'utf-8').trim();
    }

    // Request objects from remote
    const response = await axios.get(`${remote}/pull/${currentCommit || ''}`).catch(error => {
        throw new Error("Failed to fetch pull data: " + error.message);
    });

    const { newMain, rawObjects } = response.data;
    
    if (!newMain) {
        console.log("Remote repository is empty or up to date.");
        return;
    }

    // Create a map of hash -> object data for easy lookup
    const objectMap = new Map();
    for (const obj of rawObjects) {
        objectMap.set(obj.hash, Buffer.from(obj.data, 'base64'));
    }

    // Write all objects to repository
    for (const obj of rawObjects) {
        writeObjectToRepo(repoPath, obj.hash, Buffer.from(obj.data, 'base64'));
    }

    // Update the main branch reference
    fs.writeFileSync(currentMainPath, newMain);
    
    console.log(`Repository successfully pulled from remote. New main: ${newMain}`);
}