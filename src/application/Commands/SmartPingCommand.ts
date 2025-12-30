import { WASocket } from "@whiskeysockets/baileys";
import { ICommands } from "./ICommands.js";
import { OpenAiAgent } from "../../infra/IA/OpenAiAgent.js";

export class SmartPingCommand implements ICommands {
    constructor (private readonly openAiAgent: OpenAiAgent){
    }
    async execute( chatId: string, args: string[], ): Promise<string> {
        const message = args.join(' ');

        if(!message){
            return "Fala alguma coisa ai rapaz não tenha vergonha";
        }

        return await this.openAiAgent.returnMessage(message);
    }
    
}