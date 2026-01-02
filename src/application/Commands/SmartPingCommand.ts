import { WASocket } from "@whiskeysockets/baileys";
import { ICommands } from "./ICommands.js";
import { OpenAiAgent } from "../../infra/IA/OpenAiAgent.js";
import { AddAvisoUsecase } from "../usecases/AddAvisoUsecase.js";
import { smartPingUsecase } from "../usecases/smartPingUsecase.js";

export class SmartPingCommand implements ICommands {
    constructor (private readonly smartPingUsecase: smartPingUsecase, private readonly addAvisoUseCase: AddAvisoUsecase){
    }
    async execute( chatId: string, args: string[], ): Promise<string> {
        const message = args.join(' ');

        if(!message){
            return "Fala alguma coisa ai rapaz não tenha vergonha";
        }
        return await this.smartPingUsecase.execute(message)

    }
    
}