import { ICommands } from "./ICommands.js";

export class HelpCommand implements ICommands {
    async execute(chatId: string, args: string[]): Promise<string> {
        return 'lista de comandos:\n/smartPing\n/help\n/avisos\n/delete'
    }
}