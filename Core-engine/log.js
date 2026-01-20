import fs from 'fs';
import path from 'path';

export function log() {
    let logPath = path.join(process.cwd(), ".forge", 'objects');

    if (!fs.existsSync(logPath)) {
        throw new Error("No repository found. Please initialize a repository first.");
    }

    let hashesh = [];

    for(let file of fs.readdirSync(logPath)) {
        hashesh.push(file);
    }

    return hashesh;
}