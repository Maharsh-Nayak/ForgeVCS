import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { readObject } from '../objects/readObject.js';

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

// Helper function to collect objects for a single commit (commit, tree, and blobs)
// Does NOT collect parent commits - that's handled by the caller
function collectCommitObjects(repoPath, commitHash, collected = new Set()) {
    if (collected.has(commitHash)) {
        return []; // Already collected
    }
    
    const objects = [];
    
    // Read commit object
    const commitData = readObject(repoPath, commitHash);
    objects.push({ hash: commitHash, data: commitData.toString('base64') });
    collected.add(commitHash);
    
    // Parse commit to get tree hash
    const commit = parseCommit(commitData);
    
    if (!commit.tree) {
        throw new Error(`Commit ${commitHash} has no tree reference`);
    }
    
    // Collect tree and its blobs (but not parent commits)
    collectTreeObjects(repoPath, commit.tree, objects, collected);
    
    return objects;
}

// Helper function to collect tree objects and their blobs
function collectTreeObjects(repoPath, treeHash, objects, collected) {
    if (collected.has(treeHash)) {
        return; // Already collected
    }
    
    const treeData = readObject(repoPath, treeHash);
    objects.push({ hash: treeHash, data: treeData.toString('base64') });
    collected.add(treeHash);
    
    // Parse tree entries (tab-separated: blob\t<hash>\t<file>\n)
    const treeContent = treeData.toString('utf-8');
    const entries = treeContent.split('\n').filter(line => line.length > 0);
    
    for (const entry of entries) {
        const [type, hash, name] = entry.split('\t');
        if (type === 'blob' && hash) {
            if (!collected.has(hash)) {
                const blobData = readObject(repoPath, hash);
                objects.push({ hash: hash, data: blobData.toString('base64') });
                collected.add(hash);
            }
        } else if (type === 'tree' && hash) {
            // Recursively collect nested trees (for future directory support)
            collectTreeObjects(repoPath, hash, objects, collected);
        }
    }
}

export async function pushRepo() {
    const repoPath = process.cwd();
    const configPath = path.join(repoPath, ".forge", 'config.json');

    if (!fs.existsSync(configPath)) {
        throw new Error("No remote repository set. Please set a remote repository before pushing.");
    }

    const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const remotePath = configData.remote;

    // Get remote main branch hash (may be empty/null for first push)
    let remoteMain = null;
    try {
        const response = await axios.get(`${remotePath}/main`);
        remoteMain = response.data?.trim() || null;
    } catch (error) {
        // If 404 or empty, remote might not exist yet - that's okay for first push
        if (error.response?.status !== 404) {
            throw new Error("Failed to fetch remote main branch: " + error.message);
        }
    }

    const currentMainPath = path.join(repoPath, ".forge", "refs", "heads", "main");
    if (!fs.existsSync(currentMainPath)) {
        throw new Error("No commits to push. Please make at least one commit first.");
    }
    
    const currentMain = fs.readFileSync(currentMainPath, 'utf-8').trim();
    
    // If we're already up to date, nothing to push
    if (currentMain === remoteMain) {
        console.log("Already up to date with remote.");
        return;
    }
    
    // Collect all objects that need to be pushed
    // We need to walk from currentMain back to remoteMain (or to the beginning)
    const objectsToPush = [];
    const collected = new Set();
    let commitHash = currentMain;
    
    // Walk backwards through commit history
    while (commitHash && commitHash !== remoteMain) {
        const commitObjects = collectCommitObjects(repoPath, commitHash, collected);
        objectsToPush.push(...commitObjects);
        
        // Get parent to continue walking
        const commitData = readObject(repoPath, commitHash);
        const commit = parseCommit(commitData);
        commitHash = commit.parent;
    }
    
    // Prepare push payload
    const pushData = {
        newMain: currentMain,
        rawObjects: objectsToPush
    };
    
    // Send to remote
    try {
        await axios.post(`${remotePath}/push`, pushData);
        console.log(`Successfully pushed to remote. New main: ${currentMain}`);
    } catch (error) {
        throw new Error("Failed to push to remote: " + error.message);
    }
}