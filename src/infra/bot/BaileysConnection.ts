import makeWASocket, { 
    useMultiFileAuthState, 
    DisconnectReason,
    fetchLatestBaileysVersion
  } from '@whiskeysockets/baileys';
  import { Boom } from '@hapi/boom';
  import qrcode from 'qrcode-terminal';
  
  export async function createBaileysConnection(
    onMessage: (sender: string, message: string, participant: string) => void
  ) {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    
    const { version } = await fetchLatestBaileysVersion();
  
    const sock = makeWASocket({
      version,
      auth: state,
      browser: ['Ubuntu', 'Chrome', '20.0.04'],
      printQRInTerminal: false,
    });
  
    sock.ev.on('creds.update', saveCreds);
  
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;
  
      if (qr) {
        console.log('\n📱 QR Code (escaneie RÁPIDO - expira em 60s):\n');
        qrcode.generate(qr, { small: true });
      }
  
      if (connection === 'close') {
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
        
        console.log(` Desconectado. Status: ${statusCode}`);
        
        switch (statusCode) {
          case 401:
            console.log(' Não autorizado. Delete auth_info e tente novamente.');
            break;
          case 405:
            console.log(' Método não permitido (erro 405)');
            console.log(' Soluções:');
            console.log('   1. Aguarde 30 minutos antes de tentar novamente');
            console.log('   2. Delete auth_info/');
            console.log('   3. Use pairing code ao invés de QR');
            break;
          case 408:
            console.log('⏱ Timeout. Sua internet está lenta?');
            break;
          case 440:
            console.log(' QR Code expirou. Gerando novo...');
            setTimeout(() => createBaileysConnection(onMessage), 5000);
            break;
          default:
            if (statusCode !== DisconnectReason.loggedOut) {
              console.log(' Reconectando em 10s...');
              setTimeout(() => createBaileysConnection(onMessage), 10000);
            }
        }
      }
  
      if (connection === 'open') {
        console.log(' Conectado com sucesso!\n');
      }
    });
  
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return;
  
      for (const msg of messages) {
        if (!msg.message || msg.key.fromMe) continue;
  
        const sender = msg.key.remoteJid!;
        const participant = msg.key.participant || sender;
        const text = 
          msg.message.conversation ||
          msg.message.extendedTextMessage?.text ||
          '';
  
        if (text) {
          await onMessage(sender, text, participant);
        }
      }
    });
  
    return {sock};
  }