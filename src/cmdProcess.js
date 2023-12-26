import { spawn } from "child_process";

function cmd(command, args) {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, { shell: true });

        process.stdout.on("data", (data) => {
            console.log(data.toString());
        });

        process.stderr.on("data", (data) => {
            console.error(data.toString());
        });

        process.on("close", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Process exited with code ${code}`));
            }
        });
    });
}

export default { cmd };
