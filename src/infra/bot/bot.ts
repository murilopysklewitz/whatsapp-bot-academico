// infra/bot/bot.ts
import dayjs from 'dayjs'
import { AddAvisoUseCase } from '../../usecases/AddAvisoUsecase.js'
import { ListarAvisosUseCase } from '../../usecases/ListarAvisoUsecase.js'

export class WhatsAppBot {
  constructor(
    private addAvisoUseCase: AddAvisoUseCase,
    private listarAvisosUseCase: ListarAvisosUseCase,
  ) {}

  async handleMessage(sender: string, message: string, group: string, sock: any) {
    const [command, ...args] = message.split(' ')

    switch (command) {
      case '/addAviso':
        const [data, ...textoArray] = args
        const texto = textoArray.join(' ')
        
        if (!data || !texto) {
          await sock.sendMessage(group, { text: ' Use o formato: /addAviso DD/MM texto' })
          return
        }
  
        await this.addAvisoUseCase.execute(texto, data, group)
        await sock.sendMessage(sender, { text: '✅ Aviso salvo!' })
        break

      case '/listarAvisos':
        const avisos = await this.listarAvisosUseCase.execute()
        if (!avisos.length) {
          await sock.sendMessage(sender, { text: 'Nenhum aviso salvo.' })
          return
        }
        await sock.sendMessage(sender, {
          text: avisos
            .map(a => `${a.texto} — ${a.data} (faltam ${dayjs(a.data, 'DD/MM').diff(dayjs(), 'days')} dias)`)
            .join('\n'),
        })
        break
    }
  }
}
