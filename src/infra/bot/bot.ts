import { AddAvisoUseCase } from '../../usecases/AddAvisoUsecase.js';
import { ListarAvisosUseCase } from '../../usecases/ListarAvisoUsecase.js';
import { DeletarAvisoUseCase } from '../../usecases/DeletarAvisoUsecase.js';
import { Aviso } from '../../domain/entities/Aviso.js';

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
      let response: string;

      switch (command!.toLowerCase()) {
        case '/ajuda':
          response = this.getHelpText();
          break;

        case '/addaviso':
        case '/add':
          if (args.length < 2) {
             '⚠️ Uso: /add DD/MM texto\n\nExemplo:\n/add 25/12 Prova de BD';
          }
      
          const [dataStr, ...textoArray] = args;
          const texto = textoArray.join(' ');
      
          const aviso = await this.addAvisoUseCase.execute({
            texto,
            data: dataStr!,
            grupo: chatId,
          });
      
          const dias = aviso.getDiasRestantes();
           `✅ Aviso salvo!\n\n📅 ${dataStr}\n📝 ${texto}\n⏰ Faltam ${dias} dia(s)`;
          response = await this.addAviso(chatId, args);
          break;

        case '/listaravisos':
        case '/lista':
          response = await this.listarAvisos(chatId);
          break;

        case '/deletaraviso':
        case '/deletar':
          response = await this.deletarAviso(chatId, args);
          break;

        default:
          response = `❌ Comando "${command}" não reconhecido.\n\nUse /ajuda`;
      }

      await sock.sendMessage(chatId, { text: response });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      await sock.sendMessage(chatId, { text: `❌ Erro: ${errorMessage}` });
    }
  }

  // ========== COMANDOS ==========

  private getHelpText(): string {
    return `
📚 *Bot - Comandos*

*Gerenciar Avisos:*
• /add DD/MM texto
  Exemplo: /add 25/12 Prova de BD

• /lista
  Lista avisos do grupo

• /deletar [número]
  Deleta aviso pelo número da lista

• /ajuda
  Mostra esta mensagem
    `.trim();
  }

  private async addAviso(chatId: string, args: string[]): Promise<string> {
    if (args.length < 2) {
      return '⚠️ Uso: /add DD/MM texto\n\nExemplo:\n/add 25/12 Prova de BD';
    }

    const [dataStr, ...textoArray] = args;
    const texto = textoArray.join(' ');

    const aviso = await this.addAvisoUseCase.execute({
      texto,
      data: dataStr!,
      grupo: chatId,
    });

    const dias = aviso.getDiasRestantes();
    return `✅ Aviso salvo!\n\n📅 ${dataStr}\n📝 ${texto}\n⏰ Faltam ${dias} dia(s)`;
  }

  private async listarAvisos(chatId: string): Promise<string> {
    const avisos = await this.listarAvisosUseCase.execute(chatId);

    if (!avisos.length) {
      return '📭 Nenhum aviso cadastrado.\n\nUse /add DD/MM texto';
    }

    const lista = avisos
      .map((aviso, i) => this.formatarAviso(aviso, i + 1))
      .join('\n\n');

    return `📋 *Avisos:*\n\n${lista}\n\n💡 Total: ${avisos.length}`;
  }

  private async deletarAviso(chatId: string, args: string[]): Promise<string> {
    if (args.length !== 1) {
      return '⚠️ Uso: /deletar [número]\n\nExemplo: /deletar 1';
    }

    const index = parseInt(args[0]!) - 1;
    
    if (isNaN(index) || index < 0) {
      return '❌ Número inválido';
    }

    const avisos = await this.listarAvisosUseCase.execute(chatId);
    
    if (index >= avisos.length) {
      return `❌ Aviso ${index + 1} não existe. Use /lista`;
    }

    const aviso = avisos[index]!;
    await this.deletarAvisoUseCase.execute(aviso.id);

    return `🗑️ Aviso deletado:\n"${aviso.texto}" - ${aviso.data}`;
  }

  // ========== FORMATAÇÃO ==========

  private formatarAviso(aviso: Aviso, numero: number): string {
    const dias = aviso.getDiasRestantes();
    const emoji = this.getEmoji(dias, aviso.isAtrasado());
    const urgencia = this.getUrgencia(dias, aviso.isAtrasado());

    return `${numero}. ${emoji} *${aviso.texto}*\n   ${aviso.data}${urgencia}`;
  }

  private getEmoji(dias: number, atrasado: boolean): string {
    if (atrasado) return '⏰';
    if (dias === 0) return '🔥';
    if (dias === 1) return '⚠️';
    if (dias <= 3) return '📌';
    return '📅';
  }

  private getUrgencia(dias: number, atrasado: boolean): string {
    if (atrasado) return ' (ATRASADO!)';
    if (dias === 0) return ' (HOJE!)';
    if (dias === 1) return ' (AMANHÃ!)';
    return ` (${dias} dias)`;
  }
}