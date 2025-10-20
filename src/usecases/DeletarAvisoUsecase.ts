// src/usecases/DeletarAvisoUsecase.ts
import { IAvisoRepository } from "../domain/repo/IAvisoRepository.js";

export class DeletarAvisoUseCase {
  constructor(private avisoRepo: IAvisoRepository) {}

  async execute(id: number): Promise<boolean> {
    const aviso = await this.avisoRepo.findById(id);
    
    if (!aviso) {
      throw new Error(`Aviso com ID ${id} não encontrado`);
    }

    return this.avisoRepo.delete(id);
  }
}