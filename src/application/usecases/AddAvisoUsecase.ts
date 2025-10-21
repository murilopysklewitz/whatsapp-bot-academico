import { Aviso } from "../../domain/entities/Aviso.js";
import { AvisosGateway } from "../../domain/gateway/AvisosGateway.js";

export class AddAvisoUsecase {
    constructor(private readonly gateway: AvisosGateway){}
    async execute(chatId: string, data: string, message: string): Promise<void> {
        const aviso = Aviso.create(chatId, data, message)
        await this.gateway.save(aviso)
    }
}