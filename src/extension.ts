import * as vscode from 'vscode'
import { LisaCode } from './lisa-code'

export async function activate(ctx: vscode.ExtensionContext) {
    // vscode.window.showInformationMessage('Lisa-VSCode activated.')
    const lisaCode = new LisaCode()
    vscode.window.onDidCloseTerminal((terminal) => {
        lisaCode.disposeTerminal(terminal)
    })

    const startREPL = vscode.commands.registerCommand('lisa-vscode.startREPL', () => {
        lisaCode.startREPL()
    })

    const runFile = vscode.commands.registerCommand('lisa-vscode.execInTerminal', () => {
        lisaCode.executeCurrentFile(false)
    })

    const runFileWithRepl = vscode.commands.registerCommand('lisa-vscode.execInTerminalWithRepl', () => {
        lisaCode.executeCurrentFile(true)
    })

    ctx.subscriptions.push(startREPL)
    ctx.subscriptions.push(runFile)
    ctx.subscriptions.push(runFileWithRepl)
}

export async function deactivate() {

}
