import { PrismaClient } from "@prisma/client";
import { AvisosGateway } from "../../domain/gateway/AvisosGateway.js";
import { Aviso } from "../../domain/entities/Aviso.js";

export class MongodbRepository implements AvisosGateway {
    constructor(private readonly prismaClient: PrismaClient){}

    async save(aviso: Aviso): Promise<void> {
        try {
            const data = {
                codigo: aviso.codigo,
                chatId: aviso.chatId,
                data: aviso.data,
                message: aviso.message,
              };
          
              const saved = await this.prismaClient.aviso.create({
                data
              });
          
              console.log("✅ Aviso salvo com id:", saved.id);
              console.log("Aviso com mensagem: ", saved.message);
              console.log("Aviso com data: ", saved.data)

        }catch(error: any) {
            console.error("Error salvando aviso:", error);
            throw new Error("Não foi possivel salvar aviso no banco de dados");
        }
    }

    async list(chatId:string): Promise<Aviso[]> {
        try {
            const avisos = await this.prismaClient.aviso.findMany({where: {chatId: chatId}})

            return avisos.map((aviso) => 
                Aviso.fromDatabase(
                    aviso.id,
                    aviso.codigo,
                    aviso.chatId,
                    aviso.data,
                    aviso.message
                )
            )
        } catch (error: any) {
            console.error("Erro ao listar avisos:", error);
            throw new Error("Não foi possível listar os avisos");
        }
    }
    async delete(codigo: string): Promise<string> {
        try {
            const avisoADeletar = await this.prismaClient.aviso.delete({where: {codigo: codigo}})
            if(!avisoADeletar) {
                throw new Error("Não foi possivel achar o aviso no banco de dados para deletar")
            }
            return `Aviso ${avisoADeletar.message} deletado`
        } catch (error: any) {
            throw new Error("Erro em deletar aviso no banco de dados", error)
        } 
    }
}