import { WASocket } from "@whiskeysockets/baileys";
import { ICommands } from "./ICommands.js";
import { OpenAiAgent } from "../../infra/IA/OpenAiAgent.js";
import { AddAvisoUsecase } from "../usecases/AddAvisoUsecase.js";

export class SmartPingCommand implements ICommands {
    constructor (private readonly openAiAgent: OpenAiAgent, private readonly addAvisoUseCase: AddAvisoUsecase){
    }
    async execute( chatId: string, args: string[], ): Promise<string> {
        const message = args.join(' ');

        if(!message){
            return "Fala alguma coisa ai rapaz não tenha vergonha";
        }

        const result = await this.openAiAgent.processAviso(message);
        if(!result.isAviso) return await this.openAiAgent.returnMessage(message);

        const saveAviso = this.addAvisoUseCase.execute(chatId, result.date, result.message);

        return("Aviso salvo com sucesso\n");

    }
    
}