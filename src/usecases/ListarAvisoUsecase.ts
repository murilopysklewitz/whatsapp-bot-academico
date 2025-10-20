import { IAvisoRepository } from "../domain/repo/IAvisoRepository.js";


export class ListarAvisosUseCase {
  constructor(private avisoRepo: IAvisoRepository) {}

  async execute() {
    return this.avisoRepo.list();
  }
}
