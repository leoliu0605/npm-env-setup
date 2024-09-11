import fs from 'fs';
import os from 'os';
import path from 'path';
import Bash from './bash.mjs';
import { cmd } from './cmd_process.mjs';
import { getAppDir } from './dirname.mjs';
import { selectPackages } from './package_selector.mjs';
import PowerShell from './powershell.mjs';

const version = process.env.APP_VERSION;
console.log(`env-setup version: ${version}\n`);

const __dirname = getAppDir();

class SetupManager {
    constructor() {
        this.shell = null;
        this.command = '';
        this.args = [];
        this.initializeShell();
    }

    initializeShell() {
        const platform = os.platform();
        if (platform === 'win32') {
            console.log('Windows detected');
            this.shell = new PowerShell();
            this.command = 'powershell.exe';
        } else if (platform === 'darwin') {
            console.log('MacOS detected');
            this.shell = new Bash();
            this.command = '/bin/zsh';
        } else if (platform === 'linux') {
            console.log('Linux detected');
            this.shell = new Bash();
            this.command = '/bin/bash';
        }
    }

    setupEnvironment(selectedPackages) {
        this.setupVersionManager();

        selectedPackages.forEach((p) => {
            if (p) {
                if (p.packageName.startsWith('Node.js')) {
                    if (os.platform() === 'linux' && fs.existsSync('/etc/os-release')) {
                        const data = fs.readFileSync('/etc/os-release', 'utf8');
                        const isUbuntuVersion2X = /VERSION_ID="20\.\d+"|VERSION_ID="2[1-9]\.\d+"/.test(data) || /PRETTY_NAME="Ubuntu 20\.\d+.*"|PRETTY_NAME="Ubuntu 2[1-9]\.\d+.*"/.test(data);
                        if (isUbuntuVersion2X) {
                            console.log('Ubuntu 2x.xx is detected');
                            p.installCommand = 'vfox add nodejs && vfox install nodejs@20.17.0 && vfox use -g nodejs@20.17.0 && npm install -g pnpm@latest';
                        } else {
                            console.log('Ubuntu 1x.xx is detected');
                            p.installCommand = 'vfox add nodejs && vfox install nodejs@16.20.2 && vfox use -g nodejs@16.20.2';
                        }
                    }
                }
                this.shell.addCommand(p.installCommand);
                this.refreshEnvironment();
            }
        });

        if (selectedPackages.some((p) => p && p.packageName.startsWith('Python'))) {
            if (os.platform() === 'win32') {
                this.shell.addEnvironment('$HOME\\AppData\\Roaming\\Python\\Scripts');
            } else {
                this.shell.addEnvironment('\'export PATH="$HOME/.local/bin:$PATH"\'');
            }
            this.shell.addCommand('python --version');
            this.shell.addCommand('pip --version');
            this.shell.addCommand(fs.readFileSync(path.join(__dirname, 'scripts/pip.setup'), 'utf8').trim());
        }

        if (selectedPackages.some((p) => p && p.packageName.startsWith('Node.js'))) {
            this.shell.addCommand('node --version');
            this.shell.addCommand('npm --version');
            this.shell.addCommand(fs.readFileSync(path.join(__dirname, 'scripts/npm.setup'), 'utf8').trim());
            this.refreshEnvironment();
        }

        if (os.platform() === 'win32' && selectedPackages.some((p) => p && p.packageName.startsWith('Rust'))) {
            this.shell.addEnvironment('$HOME\\.cargo\\bin');
            this.shell.addCommand('refreshenv\n');
            this.shell.addCommand('rust --version');
        }

        if (os.platform() === 'win32' && selectedPackages.some((p) => p && p.packageName.startsWith('Sublime Text'))) {
            this.shell.addCommand(fs.readFileSync(path.join(__dirname, 'scripts/windows/SublimeSetup.ps1'), 'utf8').trim().replace('${PATH}', path.join(__dirname, 'scripts/windows/Preferences.sublime-settings')));
            this.shell.addCommand('refreshenv\n');
        }

        if (os.platform() === 'darwin') {
            this.shell.addCommand(fs.readFileSync(path.join(__dirname, 'scripts/macos/zshsetup.sh'), 'utf8').trim());
            this.shell.addCommand(fs.readFileSync(path.join(__dirname, 'scripts/macos/macsetup.sh'), 'utf8').trim());
        }

        if (!this.isLinuxRunAsRoot()) this.shell.addCommand('npx @leoli0605/git-setup');
    }

    setupVersionManager() {
        if (os.platform() === 'win32') {
            this.shell.addCommand('winget install --id=version-fox.vfox  -e');
            this.shell.addCommand('if (-not (Test-Path -Path $PROFILE)) { New-Item -Type File -Path $PROFILE -Force }; Add-Content -Path $PROFILE -Value \'Invoke-Expression "$(vfox activate pwsh)"\'');
        } else if (os.platform() === 'darwin') {
            this.shell.addCommand('brew install vfox');
            this.shell.addCommand('echo "" >> ~/.zshrc');
            this.shell.addCommand('echo \'eval "$(vfox activate zsh)"\' >> ~/.zshrc');
        } else if (os.platform() === 'linux') {
            this.shell.addCommand('echo "deb [trusted=yes] https://apt.fury.io/versionfox/ /" | sudo tee /etc/apt/sources.list.d/versionfox.list');
            this.shell.addCommand('sudo apt update');
            this.shell.addCommand('sudo apt install vfox -y');
            this.shell.addCommand('echo "" >> ~/.bashrc');
            this.shell.addCommand('echo \'eval "$(vfox activate bash)"\' >> ~/.bashrc');
        }
        this.refreshEnvironment();
    }

    refreshEnvironment() {
        if (os.platform() === 'win32') {
            this.shell.addCommand('refreshenv\n');
        } else {
            this.shell.addCommand('source ~/.bashrc\n');
            if (fs.existsSync(path.join(os.homedir(), '.zshrc'))) {
                this.shell.addCommand('source ~/.zshrc\n');
            }
        }
    }

    isLinuxRunAsRoot() {
        return os.platform() === 'linux' && process.getuid() === 0;
    }

    finalizeScript() {
        const script = this.shell.script();
        this.args = os.platform() === 'win32' ? ['-NoProfile', '-EncodedCommand', Buffer.from(script, 'utf16le').toString('base64')] : ['-c', script];
    }

    execute() {
        console.log(`command: ${this.command}`);
        console.log(`args: ${this.args}`);
        cmd(this.command, this.args)
            .then(() => {
                console.log('Success executing scripts');
            })
            .catch((error) => console.error('Error executing scripts:', error));
    }
}

selectPackages()
    .then((selectedPackages) => {
        const setupManager = new SetupManager();
        setupManager.setupEnvironment(selectedPackages);
        setupManager.finalizeScript();
        setupManager.execute();
    })
    .catch((error) => {
        console.error('Error selecting packages:', error);
    });
