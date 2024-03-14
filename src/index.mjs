import fs from 'fs';
import os from 'os';
import path from 'path';
import Bash from './bash.mjs';
import { cmd } from './cmd_process.mjs';
import { dedupeFile } from './dedupe.mjs';
import { getAppDir } from './dirname.mjs';
import { selectPackages } from './package_selector.mjs';
import PowerShell from './powershell.mjs';

const __dirname = getAppDir();

selectPackages()
    .then((selectedPackages) => {
        let shell;
        let command = '';
        let args = [];
        if (os.platform() === 'win32') {
            console.log('Windows detected');
            shell = new PowerShell();

            for (const p of selectedPackages) {
                if (p) {
                    shell.addCommand(p.installCommand);
                }
            }
            shell.addCommand('refreshenv\n');

            if (selectedPackages.some((p) => p && p.packageName.startsWith('Python'))) {
                shell.addEnvironment('$HOME\\AppData\\Roaming\\Python\\Scripts');
                shell.addCommand('(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -');
                shell.addCommand('poetry config virtualenvs.in-project true');
                shell.addCommand(fs.readFileSync(path.join(__dirname, 'scripts/pip.setup'), 'utf8').trim());
            }
            if (selectedPackages.some((p) => p && p.packageName.startsWith('Rust'))) {
                shell.addEnvironment('$HOME\\.cargo\\bin');
            }
            shell.addCommand('refreshenv\n');

            if (selectedPackages.some((p) => p && p.packageName.startsWith('Node.js'))) {
                shell.addCommand(fs.readFileSync(path.join(__dirname, 'scripts/npm.setup'), 'utf8').trim());
            }
            shell.addCommand('refreshenv\n');

            if (selectedPackages.some((p) => p && p.packageName.startsWith('Sublime Text'))) {
                shell.addCommand(fs.readFileSync(path.join(__dirname, 'scripts/windows/SublimeSetup.ps1'), 'utf8').trim().replace('${PATH}', path.join(__dirname, 'scripts/windows/Preferences.sublime-settings')));
            }
            shell.addCommand('refreshenv\n');
            shell.addCommand('npx @leoli0605/git-setup');
            const script = shell.script();

            const encodedScript = Buffer.from(script, 'utf16le').toString('base64');
            command = 'powershell.exe';
            args = ['-NoProfile', '-EncodedCommand', encodedScript];
        } else if (os.platform() === 'darwin') {
            console.log('MacOS detected');
            shell = new Bash('zsh');

            shell.addCommand(fs.readFileSync(path.join(__dirname, 'scripts/macos/homebrew.sh'), 'utf8').trim());
            shell.addCommand('brew install asdf');
            shell.addEnvironment('". /opt/homebrew/opt/asdf/libexec/asdf.sh"');

            for (const p of selectedPackages) {
                if (p) {
                    shell.addCommand(p.installCommand);
                }
            }

            if (selectedPackages.some((p) => p && p.packageName.startsWith('Python'))) {
                shell.addCommand('curl -sSL https://install.python-poetry.org | python3');
                shell.addEnvironment('\'export PATH="$HOME/.local/bin:$PATH"\'');
                shell.addCommand('poetry --version');
                shell.addCommand('poetry config virtualenvs.in-project true');
                shell.addCommand(fs.readFileSync(path.join(__dirname, 'scripts/pip.setup'), 'utf8').trim());
            }
            if (selectedPackages.some((p) => p && p.packageName.startsWith('Node.js'))) {
                shell.addCommand(fs.readFileSync(path.join(__dirname, 'scripts/npm.setup'), 'utf8').trim());
            }
            shell.addCommand(fs.readFileSync(path.join(__dirname, 'scripts/macos/zshsetup.sh'), 'utf8').trim());
            shell.addCommand(fs.readFileSync(path.join(__dirname, 'scripts/macos/macsetup.sh'), 'utf8').trim());
            shell.addCommand('npx @leoli0605/git-setup');
            const script = shell.script();

            command = '/bin/zsh';
            args = ['-c', script];
        } else if (os.platform() === 'linux') {
            shell = new Bash('bash');

            shell.addCommand(fs.readFileSync(path.join(__dirname, 'scripts/linux/basesetup.sh'), 'utf8').trim());
            if (fs.existsSync(path.join(os.homedir(), '.asdf'))) {
                fs.rmSync(path.join(os.homedir(), '.asdf'), { recursive: true });
            }
            shell.addCommand('git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.14.0');
            shell.addEnvironment('\'. "$HOME/.asdf/asdf.sh"\'');
            shell.addEnvironment('\'. "$HOME/.asdf/completions/asdf.bash"\'');
            shell.addCommand('export PATH="$HOME/.asdf/bin:$HOME/.asdf/shims:$PATH"');

            for (const p of selectedPackages) {
                if (p) {
                    shell.addCommand(p.installCommand);
                }
            }

            if (selectedPackages.some((p) => p && p.packageName.startsWith('Python'))) {
                shell.addCommand('curl -sSL https://install.python-poetry.org | python3');
                shell.addEnvironment('\'export PATH="$HOME/.local/bin:$PATH"\'');
                shell.addCommand('poetry --version');
                shell.addCommand('poetry config virtualenvs.in-project true');
                shell.addCommand(fs.readFileSync(path.join(__dirname, 'scripts/pip.setup'), 'utf8').trim());
            }

            if (fs.existsSync('/etc/os-release')) {
                const data = fs.readFileSync('/etc/os-release', 'utf8');
                console.log(data);

                if (/VERSION_ID="20\.\d+"|VERSION_ID="2[1-9]\.\d+"/.test(data) || /PRETTY_NAME="Ubuntu 20\.\d+.*"|PRETTY_NAME="Ubuntu 2[1-9]\.\d+.*"/.test(data)) {
                    console.log('Ubuntu 20.04 detected');
                    shell.addCommand('asdf install nodejs 18.18.0');
                    shell.addCommand('asdf global nodejs 18.18.0');
                } else {
                    console.log('Ubuntu 20.04 not detected');
                }
            } else {
                console.log('/etc/os-release file does not exist');
            }

            if (selectedPackages.some((p) => p && p.packageName.startsWith('Node.js'))) {
                shell.addCommand('node -v');
                shell.addCommand('npm -v');
                shell.addCommand(fs.readFileSync(path.join(__dirname, 'scripts/npm.setup'), 'utf8').trim());
            }
            shell.addCommand('npx @leoli0605/git-setup');
            const script = shell.script();

            command = '/bin/bash';
            args = ['-c', script];
        }

        console.log(`command: ${command}`);
        console.log(`args: ${args}`);
        cmd(command, args)
            .then(() => {
                console.log('Success executing scripts');
                if (os.platform() === 'linux') {
                    dedupeFile(path.join(os.homedir(), '.bashrc'));
                }
                if (os.platform() === 'darwin') {
                    dedupeFile(path.join(os.homedir(), '.zshrc'));
                }
            })
            .catch((error) => {
                console.error('Error executing scripts:', error);
            });
    })
    .catch((error) => {
        console.error('Error selecting packages:', error);
    });
