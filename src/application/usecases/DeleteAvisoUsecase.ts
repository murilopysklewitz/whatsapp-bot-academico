import { AvisosGateway } from "../../domain/gateway/AvisosGateway.js";

export class DeleteAvisoUsecase {
    constructor(private readonly gateway: AvisosGateway){}
    async execute(codigo: string): Promise<string> {
        const servicoDeletado = await this.gateway.delete(codigo)
        return servicoDeletado
    }
}