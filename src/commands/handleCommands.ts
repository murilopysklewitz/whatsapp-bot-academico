import { WASocket } from "@whiskeysockets/baileys";

export async function handleCommand(sock: WASocket, sender: string, text:string) {
    const [command, ...args] = text.trim().split(' ');

    switch (command) {
        case '/hello':
            await sock.sendMessage(sender, { text: 'Hello, world!' });
            break;
        case '/help':
            await sock.sendMessage(sender, { text: 'Available commands:\n /hello\n /help\n' });
            break;
        case '/addAviso':
            // /addAviso 28/10 prova de calculo 
            const [data, ...aviso] = args.join(' ').split(' ');
            await sock.sendMessage(sender, { text: 'Aviso adicionado com sucesso!' });
        default:
            await sock.sendMessage(sender, { text: 'Unknown command' });
    }
}