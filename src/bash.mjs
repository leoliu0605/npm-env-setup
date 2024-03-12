import BaseShell from './base_shell.mjs';

class Bash extends BaseShell {
    constructor(type = 'bash') {
        super();
        this.type = type;
    }

    addCommand(command) {
        this.scripts.push(command + '\n');
    }

    addEnvironment(path) {
        if (this.type === 'bash') {
            this.scripts.push(`echo ${path} >> ~/.bashrc\n`);
            this.scripts.push('source ~/.bashrc\n');
        } else if (this.type === 'zsh') {
            this.scripts.push(`echo ${path} >> ~/.zshrc\n`);
            this.scripts.push('source ~/.zshrc\n');
        }
    }

    script() {
        return (
            '#!/bin/bash\n' +
            this.scripts
                .toString()
                .replace(/(^,)/gm, '')
                .replace(/#!\/bin\/bash/g, '') +
            '\n'
        );
    }
}

export default Bash;
