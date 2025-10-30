import dayjs from "dayjs";
import { Aviso } from "../../domain/entities/Aviso.js";
import { AvisosGateway } from "../../domain/gateway/AvisosGateway.js";

export class ListAvisoUsecase {
    constructor(private readonly gateway: AvisosGateway){}

    async execute(chatId: string): Promise<Aviso[]> {
        const avisos = await this.gateway.list(chatId)
        return avisos.sort((a, b) => {
            const dataA = this.parseData(a.data)
            const dataB = this.parseData(b.data)
            return dataA.diff(dataB)
        })
    }
    private parseData(dataStr: string): dayjs.Dayjs {

        const [dia, mes] = dataStr.split('/').map(Number)
        const ano = dayjs().year() 
        
        
        let data = dayjs(`${ano}-${mes}-${dia}`, 'YYYY-M-D')
        

        if (data.isBefore(dayjs(), 'day')) {
          data = data.add(1, 'year')
        }
        
        return data;
      }

    
}