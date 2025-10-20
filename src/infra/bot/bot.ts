
import dayjs from 'dayjs';
import { AddAvisoUseCase } from '../../usecases/AddAvisoUsecase.js';
import { ListarAvisosUseCase } from '../../usecases/ListarAvisoUsecase.js';
import { DeletarAvisoUseCase } from '../../usecases/DeletarAvisoUsecase.js';


export class WhatsAppBot {
  constructor(
    private addAvisoUseCase: AddAvisoUseCase,
    private listarAvisosUseCase: ListarAvisosUseCase,
    private deletarAvisoUseCase: DeletarAvisoUseCase,
  ) {}

  async handleMessage(
    chatId: string, 
    message: string, 
    participant: string, 
    sock: any
  ): Promise<void> {
    const trimmed = message.trim();
    
    if (!trimmed.startsWith('/')) return;

    const [command, ...args] = trimmed.split(' ');

    try {
      switch (command!.toLowerCase()) {
        case '/ajuda':
          await this.sendHelp(chatId, sock);
          break;

        case '/addaviso':
        case '/add':
          await this.handleAddAviso(chatId, args, sock);
          break;

        case '/listaravisos':
        case '/lista':
          await this.handleListarAvisos(chatId, sock);
          break;

        case '/deletaraviso':
        case '/deletar':
          await this.handleDeletarAviso(chatId, args, sock);
          break;

        default:
          await sock.sendMessage(chatId, { 
            text: `❌ Comando "${command}" não reconhecido.\n\nUse /ajuda` 
          });
      }
    } catch (error) {
      console.error('Erro ao processar comando:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro desconhecido';
      
      await sock.sendMessage(chatId, { 
        text: `❌ Erro: ${errorMessage}` 
      });
    }
  }

  private async sendHelp(chatId: string, sock: any): Promise<void> {
    const helpText = `
🤖 *StudySync Bot - Comandos*

📅 *Gerenciar Avisos:*
- /add DD/MM texto
  Exemplo: /add 25/12 Prova de BD

- /lista
  Lista avisos do grupo

- /deletar [número]
  Deleta aviso pelo número da lista

- /ajuda
  Mostra esta mensagem
    `.trim();

    await sock.sendMessage(chatId, { text: helpText });
  }

  private async handleAddAviso(
    chatId: string, 
    args: string[], 
    sock: any
  ): Promise<void> {
    if (args.length < 2) {
      await sock.sendMessage(chatId, { 
        text: '❌ Uso: /add DD/MM texto\n\nExemplo:\n/add 25/12 Prova de BD' 
      });
      return;
    }

    const [dataStr, ...textoArray] = args;
    const texto = textoArray.join(' ');

    const aviso = await this.addAvisoUseCase.execute({
      texto,
      data: dataStr!,
      grupo: chatId,
    });

    const diasRestantes = aviso.getDiasRestantes();
    
    await sock.sendMessage(chatId, { 
      text: `✅ Aviso salvo!\n\n📅 ${dataStr}\n📝 ${texto}\n⏰ Faltam ${diasRestantes} dia(s)` 
    });
  }

  private async handleListarAvisos(chatId: string, sock: any): Promise<void> {

    const avisos = await this.listarAvisosUseCase.execute(chatId);

    if (!avisos.length) {
      await sock.sendMessage(chatId, { 
        text: '📭 Nenhum aviso cadastrado.\n\nUse /add DD/MM texto' 
      });
      return;
    }

    const hoje = dayjs();
    const textoAvisos = avisos.map((aviso, index) => {
      const diasRestantes = aviso.getDiasRestantes();
      
      let emoji = '📅';
      let urgencia = '';
      
      if (aviso.isAtrasado()) {
        emoji = '⏰';
        urgencia = ' (ATRASADO!)';
      } else if (diasRestantes === 0) {
        emoji = '🔥';
        urgencia = ' (HOJE!)';
      } else if (diasRestantes === 1) {
        emoji = '⚠️';
        urgencia = ' (AMANHÃ!)';
      } else if (diasRestantes <= 3) {
        emoji = '📌';
        urgencia = ` (${diasRestantes} dias)`;
      } else {
        urgencia = ` (${diasRestantes} dias)`;
      }

      return `${index + 1}. ${emoji} *${aviso.texto}*\n   ${aviso.data}${urgencia}`;
    }).join('\n\n');

    await sock.sendMessage(chatId, { 
      text: `📋 *Avisos:*\n\n${textoAvisos}\n\n💡 Total: ${avisos.length}` 
    });
  }

  private async handleDeletarAviso(
    chatId: string, 
    args: string[], 
    sock: any
  ): Promise<void> {
    if (args.length !== 1) {
      await sock.sendMessage(chatId, { 
        text: '❌ Uso: /deletar [número]\n\nExemplo: /deletar 1' 
      });
      return;
    }

    const index = parseInt(args[0]!) - 1;
    
    if (isNaN(index) || index < 0) {
      await sock.sendMessage(chatId, { 
        text: '❌ Número inválido' 
      });
      return;
    }
    const avisos = await this.listarAvisosUseCase.execute(chatId);
    
    if (index >= avisos.length) {
      await sock.sendMessage(chatId, { 
        text: `❌ Aviso ${index + 1} não existe. Use /lista` 
      });
      return;
    }

    const aviso = avisos[index];
    await this.deletarAvisoUseCase.execute(aviso!.id);

    await sock.sendMessage(chatId, { 
      text: `🗑️ Aviso deletado:\n"${aviso!.texto}" - ${aviso!.data}` 
    });
  }
}
