import { spawn } from 'child_process';

let stdioConfig = ['pipe', 'pipe', 'pipe'];
if (process.env.NODE_ENV === 'test') {
    stdioConfig = 'inherit';
}

export function cmd(command, args) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: stdioConfig,
        });

        if (stdioConfig !== 'inherit') {
            child.stdout.on('data', (data) => {
                console.log(data.toString());
            });

            child.stderr.on('data', (data) => {
                console.error(data.toString());
            });
        }

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Process exited with code ${code}`));
            }
        });
    });
}
