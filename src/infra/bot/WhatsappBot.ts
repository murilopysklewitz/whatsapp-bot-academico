import { WASocket } from "@whiskeysockets/baileys";
import { PingCommand } from "../../application/Commands/PingCommand.js";
import { ICommands } from "../../application/Commands/ICommands.js";
import { HelpCommand } from "../../application/Commands/HelpCommand.js";

export const commands = {
    '/ping': new PingCommand(),
    '/help': new HelpCommand()
}
export class WhatsappBot {
    constructor(
        private readonly commands: Record<string, ICommands>)
    {

    }

    async handleMessage(
        chatId: string,
        message: string,
        sock: WASocket
    ): Promise<void> 
    {
        const trimmedMessage = message.trim();
        if(!trimmedMessage.startsWith('/')) {
            return;
        }

        const [command, ...args] = trimmedMessage.split(' ');
        
    try {
      const response = await this.processCommand(command!.toLowerCase(), args, chatId);
      await sock.sendMessage(chatId, { text: response });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      await sock.sendMessage(chatId, { text: `❌ Erro: ${errorMsg}` });
    }

    }
    async processCommand(command: string, args: string[], chatId: string): Promise<string> {
        const ACommand = this.commands[command]
        if(!ACommand) {
            return 'Comando não encontrado!'
        }
        switch (command) {
            case '/ping':
                return await ACommand.execute(chatId, args)   
            case '/help':
                return await ACommand.execute(chatId, args)
            default:
                return `❌ Comando "${command}" não reconhecido.\n\nUse /ajuda`;
        }
    }
}