import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import ShellScript from './shell_script.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

class PowerShell extends ShellScript {
    constructor() {
        super();
        this.scripts.push(fs.readFileSync(path.join(__dirname, '../scripts/windows/RunAsAdministrator.ps1'), 'utf8') + '\n');
        this.scripts.push(fs.readFileSync(path.join(__dirname, '../scripts/windows/Chocolatey.ps1'), 'utf8') + '\n');
    }

    getScripts() {
        const paths = this.environment.map((e) => `"${e}"`).join(',\n    ');
        let envSetup = fs.readFileSync(path.join(__dirname, '../scripts/windows/EnvSetup.ps1'), 'utf8');
        envSetup = envSetup.replace('${PATHS}', paths);
        this.scripts.push(envSetup + '\n');
        this.scripts.push(this.commands.join('\n'));
        return this.scripts.toString().replace(/(^,)/gm, '') + '\n';
    }
}

export default PowerShell;
