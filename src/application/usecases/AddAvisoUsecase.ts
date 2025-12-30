import { randomBytes } from "crypto";
import { ObjectId } from "bson";
import { Aviso } from "../../domain/entities/Aviso.js";
import { AvisosGateway } from "../../domain/gateway/AvisosGateway.js";

export class AddAvisoUsecase {
    constructor(private readonly gateway: AvisosGateway){}
    async execute(chatId: string, data: string, message: string): Promise<void> {

      if (!data || !message) {
        throw new Error('Aviso incompleto');
      }
    
      if (!this.isValidData(data)) {
        throw new Error('Data inválida. Use o formato DD/MM (ex: 25/12)');
      }

        const codigo = randomBytes(3).toString('hex').toUpperCase();

        const aviso = Aviso.create(codigo, chatId, message, data)
        await this.gateway.save(aviso)
    }

    private isValidData(data?: string): boolean {
      if (!data || typeof data !== 'string') return false;
    
      const match = data.match(/^(\d{1,2})\/(\d{1,2})$/);
      if (!match) return false;
    
      const dia = Number(match[1]);
      const mes = Number(match[2]);
    
      if (mes < 1 || mes > 12) return false;
    
      const diasNoMes = new Date(2025, mes, 0).getDate();
      return dia >= 1 && dia <= diasNoMes;
    }
    
    
}