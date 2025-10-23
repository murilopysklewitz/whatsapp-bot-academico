import { randomBytes, randomUUID } from "crypto"

export class Aviso {
    private constructor(
        readonly id: string|undefined,
        readonly codigo: string,
        readonly chatId: string,
        readonly data: string,
        readonly message: string,
    ) {}

    public static create( codigo: string, chatId: string, message: string, data: string) {
        return new Aviso(undefined, codigo, chatId, data, message)
    }

    public static fromDatabase(
        id: string,
        codigo: string,
        chatId: string,
        data: string,
        message: string
    ) {
        return new Aviso(id, codigo, chatId, data, message);
    }

    
}