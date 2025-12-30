import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
} from '@whiskeysockets/baileys'
import fs from 'fs'
import path from 'path'
import qrcode from 'qrcode'

export async function connectBaileys(
  onMessage: (chatId: string, text: string, sock: any) => Promise<void>
) {
  const authDir = path.resolve('auth_info')

  const { state, saveCreds } = await useMultiFileAuthState(authDir)
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    browser: ['ZapBot', 'Chrome', '1.0'],
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      await qrcode.toFile('qrcode.png', qr)
      console.log('📸 QR Code salvo em qrcode.png')
    }

    if (connection === 'open') {
      console.log('✅ WhatsApp conectado com sucesso')
    }

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode
      console.log('❌ Conexão fechada:', reason)

      if (reason !== DisconnectReason.loggedOut) {
        console.log('🔄 Reconectando...')
        connectBaileys(onMessage)
      }
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const chatId = msg.key.remoteJid!
    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text

    if (text) {
      await onMessage(chatId, text, sock)
    }
  })

  return { sock }
}
