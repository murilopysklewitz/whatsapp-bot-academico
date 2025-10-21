import { randomBytes, randomUUID } from "crypto"

export class Aviso {
    private constructor(
        readonly chatId: string,
        readonly message: string,
        readonly data: string,
        readonly id: string 
        )
        {}

    public static create(chatId: string, message: string, data:string) {
        const id = randomBytes(6).toString("hex")
        return new Aviso(chatId, message, data, id)
    }
    
}