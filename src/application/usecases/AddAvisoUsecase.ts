import { randomBytes } from "crypto";
import { ObjectId } from "mongodb";
import { Aviso } from "../../domain/entities/Aviso.js";
import { AvisosGateway } from "../../domain/gateway/AvisosGateway.js";

export class AddAvisoUsecase {
    constructor(private readonly gateway: AvisosGateway){}
    async execute(chatId: string, data: string, message: string): Promise<void> {
        const id = new ObjectId().toHexString();
        const codigo = randomBytes(3).toString('hex').toUpperCase();
        const aviso = Aviso.create(id, codigo, chatId, data, message)
        await this.gateway.save(aviso)
    }
}