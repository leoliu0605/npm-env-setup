import fs from 'fs';
import path from 'path';
import BaseShell from './base_shell.mjs';
import { getAppDir } from './dirname.mjs';

const __dirname = getAppDir();

class PowerShell extends BaseShell {
    constructor() {
        super();
        this.scripts.push(fs.readFileSync(path.join(__dirname, 'scripts/windows/RunAsAdministrator.ps1'), 'utf8') + '\n');
        this.scripts.push(fs.readFileSync(path.join(__dirname, 'scripts/windows/Chocolatey.ps1'), 'utf8') + '\n');
    }

    script() {
        const paths = this.environment.map((e) => `"${e}"`).join(',\n    ');
        let envSetup = fs.readFileSync(path.join(__dirname, 'scripts/windows/EnvSetup.ps1'), 'utf8');
        envSetup = envSetup.replace('${PATHS}', paths);
        this.scripts.push(envSetup + '\n');
        this.scripts.push(this.commands.join('\n'));
        return this.scripts.toString().replace(/(^,)/gm, '') + '\n';
    }
}

export default PowerShell;
