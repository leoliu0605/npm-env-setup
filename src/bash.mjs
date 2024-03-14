import fs from 'fs';
import FuzzySet from 'fuzzyset';
import os from 'os';
import path from 'path';
import BaseShell from './base_shell.mjs';
import { getAppDir } from './dirname.mjs';

const __dirname = getAppDir();

class Bash extends BaseShell {
    constructor() {
        super();
        if (os.platform() === 'darwin') {
            this.scripts.push(fs.readFileSync(path.join(__dirname, 'scripts/macos/homebrew.sh'), 'utf8') + '\n');
        } else {
            this.scripts.push(fs.readFileSync(path.join(__dirname, 'scripts/linux/basesetup.sh'), 'utf8') + '\n');
        }
    }

    addCommand(command) {
        super.addCommand(command);
        this.scripts.push(command + '\n');
    }

    addEnvironment(value) {
        super.addEnvironment(value);
        const file = os.platform() === 'darwin' ? '.zshrc' : '.bashrc';
        const data = fs.readFileSync(path.join(os.homedir(), file), 'utf8');
        const lines = data.split('\n');
        const fuzzy = FuzzySet(lines);
        const results = fuzzy.get(value);
        const similarityThreshold = 0.8;
        const isSimilar = results && results.some(([score]) => score > similarityThreshold);
        if (!isSimilar) {
            this.scripts.push(`echo ${value} >> ~/${file}\n`);
            this.scripts.push(`source ~/${file}\n`);
        }
    }

    script() {
        return '#!/bin/bash\n' + this.scripts.join('').replace(/#!\/bin\/bash/g, '') + '\n';
    }
}

export default Bash;
