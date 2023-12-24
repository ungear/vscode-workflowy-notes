// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { WorkFlowy } from "workflowy";
import { WORKFLOWY_EMAIL, WORKFLOWY_PASSWORD, WORKFLOWY_ROOT_NOTE } from "./devConsts";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "workflowy-notes" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('workflowy-notes.addNote', async () => {
		const editor = vscode.window.activeTextEditor;
		//TODO do something if editor is not defined
		if(!editor) {return};
		const fileName = editor.document.fileName;
		const line = editor.selection.start.line;
		const noteName = await vscode.window.showInputBox({
			title: 'Title text',
			prompt: 'Enter the note text',
		});
		// Input was cancelled
		if(noteName === undefined) return;

		const workflowy = new WorkFlowy(WORKFLOWY_EMAIL, WORKFLOWY_PASSWORD);
		const document = await workflowy.getDocument();
		const topLevelLists = document.items;
		const sandbox = topLevelLists.find(x => x.name === WORKFLOWY_ROOT_NOTE);
		const newItem = sandbox?.createItem();

		// vscode starts counting lines from 0
		const lineNumberOutput = line + 1;
		const noteText = fileName + ":" + lineNumberOutput;
		newItem?.setName(noteName).setNote(noteText);
		if (document.isDirty()) {
			// Saves the changes if there are any
			await document.save();
		}

		vscode.window.showInformationMessage('The note added to Workflowy');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
