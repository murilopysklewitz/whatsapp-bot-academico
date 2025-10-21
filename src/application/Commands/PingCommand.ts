import { WASocket } from "@whiskeysockets/baileys";
import { ICommands } from "./ICommands.js";

export class PingCommand implements ICommands {

    async execute( chatId: string, args: string[], ): Promise<string> {
        return 'Pong!';
    }
    
}