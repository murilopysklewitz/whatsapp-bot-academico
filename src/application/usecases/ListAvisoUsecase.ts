import { Aviso } from "../../domain/entities/Aviso.js";
import { AvisosGateway } from "../../domain/gateway/AvisosGateway.js";

export class ListAvisoUsecase {
    constructor(private readonly gateway: AvisosGateway){}

    async execute(chatId: string): Promise<Aviso[]> {
        const avisos = await this.gateway.list()
        return avisos.filter(aviso => aviso.chatId === chatId);
    }

    
}