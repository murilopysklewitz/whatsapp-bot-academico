import { Aviso } from "../entities/Aviso.js";

export interface IAvisoRepository {
    list(): Promise<Aviso[]>;
    save(aviso: Aviso): Promise<void>;
}