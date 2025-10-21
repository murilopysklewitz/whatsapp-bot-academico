import { WASocket } from "@whiskeysockets/baileys";
import { PingCommand } from "../../application/Commands/PingCommand.js";

export class WhatsappBot {
    constructor(
        private readonly pingCommand: PingCommand)
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
        switch (command) {
            case '/ping':
                return await this.pingCommand.execute(chatId, args);   
                
            default:
                return `❌ Comando "${command}" não reconhecido.\n\nUse /ajuda`;
        }
    }
}