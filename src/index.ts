import dotenv from 'dotenv';
import { AddCommand } from "./application/Commands/AddCommand.js";
import { HelpCommand } from "./application/Commands/HelpCommand.js";
import { PingCommand } from "./application/Commands/PingCommand.js";
import { AddAvisoUsecase } from "./application/usecases/AddAvisoUsecase.js";
import { WhatsappBot } from "./infra/bot/WhatsappBot.js";
import { createBaileysConnection } from "./infra/config/BaileysConnection.js";
import { Prisma } from "./infra/config/prismaConnection.js";
import { MongodbRepository } from "./infra/repository/MongodbRepository.js";
import { ListCommands } from './application/Commands/ListCommand.js';
import { ListAvisoUsecase } from './application/usecases/ListAvisoUsecase.js';



dotenv.config();
console.log('DATABASE_URL:', process.env.DATABASE_URL);

async function main() {
  
  const repositoryAvisos = new MongodbRepository(Prisma)
  const addAvisoUsecase = new AddAvisoUsecase(repositoryAvisos)
  const listAvisoUsecase = new ListAvisoUsecase(repositoryAvisos) 

  const commands = {
    '/ping': new PingCommand(),
    '/help': new HelpCommand(),
    '/add': new AddCommand(addAvisoUsecase),
    '/avisos': new ListCommands(listAvisoUsecase)
  }

    const bot = new WhatsappBot(commands);    


    const { sock } = await createBaileysConnection(
        async (chatId, message, ) => {
          await bot.handleMessage(chatId, message, sock);
        }
      );
    console.log(' Bot pronto! Envie /ping no WhatsApp\n');
}
main().catch(error => {
    console.error(' Erro fatal:', error);
    process.exit(1);
  });