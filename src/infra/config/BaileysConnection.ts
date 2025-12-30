import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} from '@whiskeysockets/baileys'
import qrcode from 'qrcode'
import P from 'pino'
import { WhatsappBot } from '../bot/WhatsappBot.js'

export async function createBaileysConnection(phoneNumber: string) {
  const { state, saveCreds } = await useMultiFileAuthState('./auth')
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    auth: state,
    version,
    logger: P({ level: 'silent' }),
    browser: ['Chrome', 'Desktop', '1.0']
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      await qrcode.toFile('qrcode.png', qr)
      console.log('📸 QR Code salvo em qrcode.png')
    }

    if (connection === 'open') {
      console.log('✅ WhatsApp conectado com sucesso!')
    }

    if (connection === 'close') {
      const code = (lastDisconnect?.error as any)?.output?.statusCode
      console.log('❌ Conexão fechada. Código:', code)

      if (code !== DisconnectReason.loggedOut) {
        console.log('🔄 Tentando reconectar em 5s...')
        setTimeout(() => createBaileysConnection(phoneNumber), 5000)
      }
    }
  })

  return sock
}

export async function bootstrap(bot: WhatsappBot) {
  const PHONE_NUMBER = process.env.PHONE_NUMBER
  if (!PHONE_NUMBER) throw new Error("Phone number não pode ser nulo")

  const sock = await createBaileysConnection(PHONE_NUMBER)

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return

    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue

      const chatId = msg.key.remoteJid!
      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        ''

      if (text) {
        await bot.handleMessage(chatId, text, sock)
      }
    }
  })
}
