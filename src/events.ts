import { WASocket } from "@whiskeysockets/baileys";
import { handleCommand } from "./commands/handleCommands.js";

export async function registerEvent(sock: WASocket) {
    sock.ev.on("messages.upsert", async (message) => {
        const msg = message.messages[0];
        if(!msg) return;
        console.log(msg);

        const sender = msg.key.remoteJid!;
        console.log(sender);
        const text = msg.message!.conversation || msg.message!.extendedTextMessage?.text
        if(!text) return;

        if(text.startsWith("/")) {
            await handleCommand(sock, sender, text);
        }
    });
}