
import { Aviso } from "../domain/entities/Aviso.js";
import { IAvisoRepository } from "../domain/repo/IAvisoRepository.js";

export class AddAvisoUseCase {
  constructor(private avisoRepo: IAvisoRepository) {}

  async execute(input: {
    texto: string;
    data: string;
    grupo: string;
  }): Promise<Aviso> {
    if (!input.texto.trim()) {
      throw new Error('Texto do aviso não pode estar vazio');
    }

    if (!input.data.match(/^\d{1,2}\/\d{1,2}$/)) {
      throw new Error('Data deve estar no formato DD/MM');
    }

    const aviso = Aviso.create({
      texto: input.texto,
      data: input.data,
      grupo: input.grupo,
    });

    await this.avisoRepo.save(aviso);

    return aviso; 
  }
}