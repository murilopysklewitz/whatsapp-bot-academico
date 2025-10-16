import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import { groupCache } from "./storage/cache.js";

export async function start() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    auth: state,
    version: version as [number, number, number],
    printQRInTerminal: true,
    cachedGroupMetadata: async (jid) => groupCache.get(jid)
  });

  sock.ev.on("connection.update", (update) => {
    if (update.qr) qrcode.generate(update.qr, { small: true });
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on('groups.update', async ([event]) => {
    const metadata = await sock.groupMetadata(event!.id!)
    groupCache.set(event!.id!, metadata)
})

sock.ev.on('group-participants.update', async (event) => {
    const metadata = await sock.groupMetadata(event.id)
    groupCache.set(event.id, metadata)
})
}

start();
