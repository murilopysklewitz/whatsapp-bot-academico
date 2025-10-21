import { AddAvisoUsecase } from "../usecases/AddAvisoUsecase.js";
import { ICommands } from "./ICommands.js";

export class AddCommand implements ICommands {
    constructor( private readonly addAvisoUsecase: AddAvisoUsecase) {

    }
    async execute(chatId: string, args: string[]): Promise<string>{
        const [data, ...messageArr] = args
        if( messageArr.length == 0|| !data ){
            throw new Error(" /add enviado incorretamente \nmodelo: /add 13/10 Prova de calculo")
        }
        const message = messageArr.join(' ')
        await this.addAvisoUsecase.execute(chatId, data, message)
        return 'aviso criado com sucesso'
    }
}