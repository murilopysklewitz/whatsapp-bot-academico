
import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys';
import { WhatsAppBot } from './infra/bot/bot.js';
import { AddAvisoUseCase } from './usecases/AddAvisoUsecase.js';
import { ListarAvisosUseCase } from './usecases/ListarAvisoUsecase.js';
import { createBaileysConnection } from './infra/bot/BaileysConnection.js';
import { AvisoRepository } from './infra/database/AvisoRepository.js';

async function main() {

  const avisoRepo = new AvisoRepository();
  const addAviso = new AddAvisoUseCase(avisoRepo);
  const listarAvisos = new ListarAvisosUseCase(avisoRepo);
  const bot = new WhatsAppBot(addAviso, listarAvisos);

  const { sock } = await createBaileysConnection((sender, message, group) =>
    bot.handleMessage(sender, message, group, sock)
  )

}

main();
