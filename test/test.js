import { spawn } from 'child_process';
import os from 'os';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const child = spawn('node', [path.join(__dirname, '../src/index.js')], {
    env: { ...process.env, NODE_ENV: 'test' },
});

child.stdin.write('aa\n'); // Press 'a' twice to deselect all.

child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    if (data.toString('utf8').includes('請問您的顯示名稱')) {
        child.stdin.write(`Mocked User - ${os.platform}\n`);
    }
    if (data.includes('請問您的 E-mail 地址')) {
        child.stdin.write('mockeduser@example.com\n');
    }
});

child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
