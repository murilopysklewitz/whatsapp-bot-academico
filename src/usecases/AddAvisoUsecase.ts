import { Aviso } from "../domain/entities/Aviso.js";
import { IAvisoRepository } from "../domain/repo/IAvisoRepository.js";


export class AddAvisoUseCase {
  constructor(private avisoRepo: IAvisoRepository) {}

  async execute(texto: string, data: string, grupo: string) {
    const aviso = Aviso.create({texto, data, grupo});
    await this.avisoRepo.save(aviso);

  }
}
