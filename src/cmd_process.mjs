import { spawn } from 'child_process';

let stdioConfig = ['inherit', 'pipe', 'pipe'];
if (process.env.NODE_ENV === 'test') {
    stdioConfig = 'inherit';
}

const colors = {
    reset: '\x1b[0m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
};

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
                console.error(`${colors.red}${data.toString()}${colors.reset}`);
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
