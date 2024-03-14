import BaseShell from './base_shell.mjs';

class Bash extends BaseShell {
    constructor(type = 'bash') {
        super();
        this.type = type;
    }

    addCommand(command) {
        super.addCommand(command);
        this.scripts.push(command + '\n');
    }

    addEnvironment(value) {
        super.addEnvironment(value);
        let file = this.type === 'bash' ? '~/.bashrc' : '~/.zshrc';
        this.scripts.push(`echo ${value} >> ${file}\n`);
        this.scripts.push(`source ${file}\n`);
    }

    script() {
        return '#!/bin/bash\n' + this.scripts.join('').replace(/#!\/bin\/bash/g, '') + '\n';
    }
}

export default Bash;
