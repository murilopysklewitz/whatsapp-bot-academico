import { randomBytes } from "crypto";
import { ObjectId } from "bson";
import { Aviso } from "../../domain/entities/Aviso.js";
import { AvisosGateway } from "../../domain/gateway/AvisosGateway.js";
import dayjs from "dayjs";

export class AddAvisoUsecase {
    constructor(private readonly gateway: AvisosGateway){}
    async execute(chatId: string, data: string, message: string): Promise<void> {
        const codigo = randomBytes(3).toString('hex').toUpperCase();

        const aviso = Aviso.create(codigo, chatId, message, data)
        await this.gateway.save(aviso)
    }
}