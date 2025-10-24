import { randomBytes } from "crypto";
import { ObjectId } from "bson";
import { Aviso } from "../../domain/entities/Aviso.js";
import { AvisosGateway } from "../../domain/gateway/AvisosGateway.js";
import dayjs from "dayjs";

export class AddAvisoUsecase {
    constructor(private readonly gateway: AvisosGateway){}
    async execute(chatId: string, data: string, message: string): Promise<void> {
        const codigo = randomBytes(3).toString('hex').toUpperCase();
        if (!this.isValidData(data)) {
            throw new Error('Data inválida. Use o formato DD/MM (ex: 25/12)');
          }

        const aviso = Aviso.create(codigo, chatId, message, data)
        await this.gateway.save(aviso)
    }

    private isValidData(data:string): boolean {
        const regex = /^(\d{1,2})\/(\d{1,2})$/;
        if (!regex.test(data)) return false;

        const [dia, mes] = data.split('/').map(Number)
        if (!dia || !mes || dia < 1 || dia > 31 || mes < 1 || mes > 12) {
            return false;
          }

        const ano = dayjs().year()
        const dataCompleta = dayjs(`${ano}-${mes}-${dia}`, 'YYYY-M-D', true)
        return dataCompleta.isValid();
    }
}