import { PrismaClient } from "@prisma/client";
import { AvisosGateway } from "../../domain/gateway/AvisosGateway.js";
import { Aviso } from "../../domain/entities/Aviso.js";

export class MongodbRepository implements AvisosGateway {
    constructor(private readonly prismaClient: PrismaClient){}

    async save(aviso: Aviso): Promise<void> {
        try {
            console.log("salvando aviso com Id:", aviso.id);
            const data = {
                id: aviso.id,
                chatId: aviso.chatId,
                data: aviso.data,
                message: aviso.message,
            }
            console.log("salvando dados do aviso:", data);
            const saved = await this.prismaClient.aviso.upsert({
                where: {id: aviso.id},
                update: data,
                create: data
            })
            console.log("aviso salvo com id:", saved.id);

        }catch(error: any) {
            console.error("Error salvando aviso:", error);
            throw new Error("Não foi possivel salvar aviso no banco de dados");
        }
    }
}