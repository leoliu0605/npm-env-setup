class BaseShell {
    constructor() {
        this.commands = [];
        this.environment = [];
        this.scripts = [];
    }

    addCommand(command) {
        this.commands.push(command);
        console.log(`Command added: ${command}`);
    }

    addEnvironment(path) {
        this.environment.push(path);
        console.log(`Environment added: ${path}`);
    }

    script() {
        throw new Error('You have to implement the method script!');
    }
}

export default BaseShell;
