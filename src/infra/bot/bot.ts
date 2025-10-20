
import dayjs from 'dayjs';
import { AddAvisoUseCase } from '../../usecases/AddAvisoUsecase.js';
import { ListarAvisosUseCase } from '../../usecases/ListarAvisoUsecase.js';

export class WhatsAppBot {
  constructor(
    private addAvisoUseCase: AddAvisoUseCase,
    private listarAvisosUseCase: ListarAvisosUseCase,
    private sock: any
  ) {}

  async handleMessage(sender: string, message: string) {
    const [command, ...args] = message.split(' ');

    switch (command) {
      case '/addAviso':
        const texto = args.join(' ');
        const data = '25/10';
        await this.addAvisoUseCase.execute(texto, data, sender);
        await this.sock.sendMessage(sender, { text: '✅ Aviso salvo!' });
        break;

      case '/listarAvisos':
        const avisos = await this.listarAvisosUseCase.execute();
        if (!avisos.length) {
          await this.sock.sendMessage(sender, { text: 'Nenhum aviso salvo.' });
          return;
        }
        await this.sock.sendMessage(sender, {
          text: avisos
            .map(a => `${a.texto} — ${a.data} (faltam ${dayjs(a.data, 'DD/MM').diff(dayjs(), 'days')} dias)`)
            .join('\n'),
        });
        break;
    }
  }
}
