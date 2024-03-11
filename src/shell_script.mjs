class ShellScript {
    constructor() {
        this.commands = [];
        this.environment = [];
        this.scripts = [];
    }

    addCommand(command) {
        this.commands.push(command);
        console.log(`Command added: ${command}`);
    }

    addEnvironment(value) {
        this.environment.push(value);
        console.log(`Environment added: ${value}`);
    }

    getScripts() {
        throw new Error('You have to implement the method getScripts!');
    }
}

export default ShellScript;
