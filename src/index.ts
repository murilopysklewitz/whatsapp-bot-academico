import { PingCommand } from "./application/Commands/PingCommand.js";
import { WhatsappBot } from "./infra/bot/WhatsappBot.js";
import { createBaileysConnection } from "./infra/config/BaileysConnection.js";

async function main() {
    const pingCommand = new PingCommand();
    const bot = new WhatsappBot(pingCommand);    

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