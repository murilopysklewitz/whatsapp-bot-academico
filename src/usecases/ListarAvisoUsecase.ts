// src/usecases/ListarAvisosUsecase.ts
import { Aviso } from "../domain/entities/Aviso.js";
import { IAvisoRepository } from "../domain/repo/IAvisoRepository.js";

export class ListarAvisosUseCase {
  constructor(private avisoRepo: IAvisoRepository) {}

  async execute(grupoId?: string): Promise<Aviso[]> {
    
    const avisos = grupoId 
      ? await this.avisoRepo.listByGrupo(grupoId)
      : await this.avisoRepo.list();


    return avisos.sort((a, b) => {
      const dataA = a.getDataCompleta();
      const dataB = b.getDataCompleta();
      return dataA.diff(dataB);
    });
  }
}