import { DeleteAvisoUsecase } from "../usecases/DeleteAvisoUsecase.js";
import { ICommands } from "./ICommands.js";

export class DeleteCommand implements ICommands {
    constructor(private readonly deleteAvisoUsecase: DeleteAvisoUsecase){}
    async execute(chatId: string, args: string[]): Promise<string>{
        if (!args.length) {
            return " Você precisa informar o código do aviso para deletar. Ex: /delete ABC123";
          }
        const codigo = args.join()
        return await this.deleteAvisoUsecase.execute(codigo)
    }
}