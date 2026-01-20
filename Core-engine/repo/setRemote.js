import fs from 'fs';
import path from 'path';
import { cwd } from 'process';

export function pushRepo(repoPath, remotePath) {

    let configPath = path.join(process.cwd(), ".forge", 'config.json');

    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({ remote:remotePath } , null, 4));
    } else {
        let configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        configData.remote = remotePath;
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 4));
    }

}