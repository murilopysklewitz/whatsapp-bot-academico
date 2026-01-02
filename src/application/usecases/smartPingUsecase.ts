import { AvisosGateway } from "../../domain/gateway/AvisosGateway.js";
import { OpenAiAgent } from "../../infra/IA/OpenAiAgent.js";

export class smartPingUsecase {

    constructor(
        private readonly openAiAgent: OpenAiAgent,
        private readonly avisoGateway: AvisosGateway
     ){}


    async execute(messageReceived:string){
    
    try{
        const message = await this.openAiAgent.processAviso(messageReceived)

        let parsed = JSON.parse(message);

        console.log("[SMART PING USECASE] RESPOSTA DA IA TRATADA", parsed);


        if(!this.isValidAviso(parsed)){throw new Error("Aviso inválido")}

        return parsed;

    }catch(e: any){
        throw new Error("Não foi possível processar mensagem", e);
    }
    }

    private isValidAviso(obj: any): boolean{
        return (
            typeof obj?.isAviso === 'boolean' &&
            ('message' in obj) &&
            ('date' in obj)
          )
    }

}