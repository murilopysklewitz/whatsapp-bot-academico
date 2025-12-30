  import dotenv from 'dotenv';
  import { AddCommand } from "./application/Commands/AddCommand.js";
  import { HelpCommand } from "./application/Commands/HelpCommand.js";
  import { SmartPingCommand } from "./application/Commands/SmartPingCommand.js";
  import { AddAvisoUsecase } from "./application/usecases/AddAvisoUsecase.js";
  import { WhatsappBot } from "./infra/bot/WhatsappBot.js";
  import { bootstrap, createBaileysConnection } from "./infra/config/BaileysConnection.js";
  import { Prisma } from "./infra/config/prismaConnection.js";
  import { MongodbRepository } from "./infra/repository/MongodbRepository.js";
  import { ListCommands } from './application/Commands/ListCommand.js';
  import { ListAvisoUsecase } from './application/usecases/ListAvisoUsecase.js';
  import { DeleteCommand } from './application/Commands/DeleteCommand.js';
  import { DeleteAvisoUsecase } from './application/usecases/DeleteAvisoUsecase.js';
  import { OpenAiAgent } from './infra/IA/OpenAiAgent.js';



  dotenv.config();
  const apiKey = process.env.OPENAI_API_KEY



  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  async function main() {
    if(!apiKey){
      throw new Error("Chave api não pode ser nulo");
    }
    const openAiAgent = new OpenAiAgent(apiKey)
    const repositoryAvisos = new MongodbRepository(Prisma)
    const addAvisoUsecase = new AddAvisoUsecase(repositoryAvisos)
    const listAvisoUsecase = new ListAvisoUsecase(repositoryAvisos) 
    const deleteAvisoUsecase = new DeleteAvisoUsecase(repositoryAvisos)

    const commands = {
      '/smartping': new SmartPingCommand(openAiAgent),
      '/help': new HelpCommand(),
      '/add': new AddCommand(addAvisoUsecase),
      '/avisos': new ListCommands(listAvisoUsecase),
      '/delete': new DeleteCommand(deleteAvisoUsecase)
    }


      const bot = new WhatsappBot(commands);  
      bootstrap(bot);

      console.log(' Bot pronto! Envie /ping no WhatsApp\n');
  }
  main().catch(error => {
      console.error(' Erro fatal:', error);
      process.exit(1);
    });