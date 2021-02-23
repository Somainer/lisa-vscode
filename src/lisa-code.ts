import * as vscode from 'vscode'
import * as os from 'os'


export class LisaCode implements vscode.Disposable {
    private _terminal: vscode.Terminal | null = null
    private config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('lisa-vscode')

    private get lisaCommand() {
        const command = this.config.get<string>('interpreterCommand') || 'lisa'
        const platform = os.platform()
        if (platform === 'darwin') {
            return `"${command}"`
        }
        if (platform === 'win32') {
            if (parseFloat(os.release()) >= 10) {
                return `&'${command}'`
            }
        }
        return command;
    }

    private get terminal() {
        this._terminal = this._terminal || vscode.window.createTerminal('Lisa')
        return this._terminal
    }

    private async runCommand(command: string) {
        this.terminal.show()
        this.terminal.sendText(command)
    }

    public async startREPL() {
        this.runCommand(this.lisaCommand);
    }

    public async executeCurrentFile(withRepl: boolean = false) {
        const editor = vscode.window.activeTextEditor;
        const document = editor?.document;
        if (!document) {
            vscode.window.showErrorMessage('No active file to execute.')
            return;
        }
        const saved = await document.save();
        if (!saved) {
            vscode.window.showErrorMessage(`File ${document.fileName} is not saved successfully.`)
            return
        }
        const command = `${this.lisaCommand} ${withRepl ? 'repl' : ''} "${document.fileName}"`;
        return this.runCommand(command)
    }

    public disposeTerminal(terminal: vscode.Terminal) {
        if (terminal === this._terminal) {
            terminal.dispose()
            this._terminal = null
        }
    }

    public dispose() {
        this._terminal?.dispose();
    }
}