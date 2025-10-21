import { randomBytes, randomUUID } from "crypto"

export class Aviso {
    private constructor(
        readonly id: string | undefined,
        readonly codigo: string,
        readonly chatId: string,
        readonly data: string,
        readonly message: string,
    ) {}

    public static create(chatId: string, message: string, data: string) {
        const codigo = randomBytes(3).toString('hex').toUpperCase()
        return new Aviso(undefined, codigo, chatId, data, message)
    }


    
}