// src/main.ts

import { createBaileysConnection } from "./infra/bot/BaileysConnection.js";
import { WhatsAppBot } from "./infra/bot/bot.js";
import { JsonAvisoRepository } from "./infra/database/AvisoRepository.js";
import { AddAvisoUseCase } from "./usecases/AddAvisoUsecase.js";
import { DeletarAvisoUseCase } from "./usecases/DeletarAvisoUsecase.js";
import { ListarAvisosUseCase } from "./usecases/ListarAvisoUsecase.js";


async function main() {
  console.log('🚀 Iniciando StudySync Bot...\n');

  const avisoRepo = new JsonAvisoRepository('./storage/avisos.json');
  
  const addAvisoUseCase = new AddAvisoUseCase(avisoRepo);
  const listarAvisosUseCase = new ListarAvisosUseCase(avisoRepo);
  const deletarAvisoUseCase = new DeletarAvisoUseCase(avisoRepo);
  
  const bot = new WhatsAppBot(
    addAvisoUseCase,
    listarAvisosUseCase,
    deletarAvisoUseCase
  );


   await createBaileysConnection;
}

main().catch(console.error);