import { WASocket } from "@whiskeysockets/baileys";

export async function handleCommand(sock: WASocket, sender: string, text:string) {
    const [command, ...args] = text.trim().split(' ');

    let avisos: any[] = []

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

            if (!data || aviso.length === 0) {
                await sock.sendMessage(sender, {
                  text: ' Uso incorreto. Exemplo: /addAviso 28/10 Prova de cálculo',
                });
                return;
              }

            const [dia, mes] = data.split('/');

            const diaNumerico = parseInt(dia!) 
            const mesNumerico = parseInt(mes!);

            if (isNaN(diaNumerico) || isNaN(mesNumerico) || diaNumerico > 31 || diaNumerico < 1 || mesNumerico < 1|| mesNumerico > 12) {
                await sock.sendMessage(sender, { text: '❌ Data inválida! Use formato DD/MM.' });
                return;
              }

            aviso.join(' ')
            const avisoObj = {
                id: Date.now(),
                texto: aviso.join(' '),
                data: `${diaNumerico}/${mesNumerico}`,
                grupo: sender,
            }
            avisos.push(avisoObj)

            await sock.sendMessage(sender, { text: 'Aviso adicionado com sucesso!\n' + avisoObj.texto + 'no data' + avisoObj.data + '\n' });

        default:

            await sock.sendMessage(sender, { text: 'Unknown command' });
    }
}