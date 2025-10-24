import { Aviso } from "../entities/Aviso.js";

export interface AvisosGateway {
    save(aviso: Aviso): Promise<void>
    list(chatId: string): Promise<Aviso[]>
}