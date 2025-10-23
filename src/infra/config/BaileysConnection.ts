import makeWASocket, { 
  useMultiFileAuthState, 
  DisconnectReason,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode';

export async function createBaileysConnection(
  onMessage: (sender: string, message: string) => void
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
      // Salva como PNG (funciona em Docker e local)
      await qrcode.toFile('./qrcode.png', qr, { width: 300 });
      console.log('\n📱 QR Code salvo em: ./qrcode.png');
      console.log('⏰ Escaneie em 60s\n');
    }
  
    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
      console.log(`❌ Desconectado. Status: ${statusCode}`);
      
      if (statusCode === 440) {
        console.log('⏱️  QR expirou. Gerando novo...');
        setTimeout(() => createBaileysConnection(onMessage), 5000);
      } else if (statusCode !== DisconnectReason.loggedOut && statusCode !== 401) {
        console.log('🔄 Reconectando em 10s...');
        setTimeout(() => createBaileysConnection(onMessage), 10000);
      }
    }

    if (connection === 'open') {
      console.log('✅ Conectado!\n');
    }
  });
  
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;

      const sender = msg.key.remoteJid!;
      const text = 
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        '';

      if (text) {
        await onMessage(sender, text);
      }
    }
  });

  return { sock };
}