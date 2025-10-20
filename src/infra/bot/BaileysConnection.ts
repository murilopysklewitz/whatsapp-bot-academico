import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys';
import NodeCache from 'node-cache';
import { groupCache } from '../database/cache.js';

export async function createBaileysConnection(onMessage: (sender: string, message: string, group: string) => void) {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info');

    const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    browser: ['Bot', 'Desktop', '1.0'],
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('group-participants.update', (update) => {
    groupCache.set('lastGroup', update.id);
    console.log(`🔹 Grupo atualizado: ${update.id}`);

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        if (!msg?.message || msg.key.fromMe) return
    
        const sender = msg.key.remoteJid!
        const group = msg.key.participant!
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
        if (text.trim()) {
          await onMessage(sender, text, group)
        }
      })
  });

  return { sock, groupCache };
}
