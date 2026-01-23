import fs from 'fs';
import path from 'path';
import { initRepo } from './initRepo.js';
import { setRemote } from './setRemote.js';
import { pullRepo } from './pullRepo.js';

export async function cloneRepo(remoteUrl, targetDir) {
    const repoPath = path.resolve(targetDir);
    
    // Check if directory already exists
    if (fs.existsSync(repoPath)) {
        const files = fs.readdirSync(repoPath);
        if (files.length > 0) {
            throw new Error(`Directory ${targetDir} already exists and is not empty.`);
        }
    } else {
        // Create the directory
        fs.mkdirSync(repoPath, { recursive: true });
    }
    
    // Save current working directory
    const originalCwd = process.cwd();
    
    try {
        // Change to target directory
        process.chdir(repoPath);
        
        // Initialize repository
        console.log(`Initializing repository in ${repoPath}...`);
        initRepo(repoPath);
        
        // Set remote
        console.log(`Setting remote to ${remoteUrl}...`);
        setRemote(remoteUrl);
        
        // Pull from remote
        console.log(`Pulling from remote...`);
        await pullRepo();
        
        console.log(`Repository cloned successfully to ${repoPath}`);
    } finally {
        // Restore original working directory
        process.chdir(originalCwd);
    }
}
