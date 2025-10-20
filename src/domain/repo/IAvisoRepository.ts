
import { Aviso } from "../entities/Aviso.js";

export interface IAvisoRepository {
  save(aviso: Aviso): Promise<void>;
  list(): Promise<Aviso[]>;
  listByGrupo(grupoId: string): Promise<Aviso[]>;
  findById(id: number): Promise<Aviso | null>;
  delete(id: number): Promise<boolean>;
  deleteOldAvisos(diasAtras: number): Promise<number>;
}