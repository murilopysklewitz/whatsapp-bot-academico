import { Aviso } from "../entities/Aviso.js";

export interface IRepository {
    save(aviso: Aviso): Promise<void>
}