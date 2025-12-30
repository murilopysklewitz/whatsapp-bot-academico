import OpenAI from 'openai';

interface smartPingResult {
    isAviso: boolean,
    message: string,
    date: string
}
export class OpenAiAgent {
    private client: OpenAI;

    constructor(
        apiKey: string
    ) {
        this.client = new OpenAI({ apiKey })
    }

    async returnMessage(message: string): Promise<string> {
        const response = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a student assistent"
                },
                {
                    role: "user",
                    content: message
                }
            ]
        })
        return response.choices[0]?.message.content ?? '';
    }
    async processAviso(message: string): Promise<smartPingResult> {
        const response = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {

                    role: "system",
                    content:
                        `
                            Você deve analisar a mensagem do usuário e identificar se ela representa um aviso a ser salvo.
                        `
                },
                {
                    role: "user",
                    content: this.buildAvisoPrompt(message)
                }
            ]
        })
        const result = response.choices[0]?.message.content ?? '';
        if(!result) throw new Error("mensagem não encontrada");

        try{

            let parsed = JSON.parse(result);


            if(!this.isValidAviso(parsed)){throw new Error("Aviso inválido")}

            return parsed;

        }catch(e: any){
            throw new Error("Não foi possível processar mensagem", e);
        }
    }

    private isValidAviso(obj: any): boolean{
        return (
            typeof obj?.isAviso === 'boolean' &&
            ('mensagem' in obj) &&
            ('data' in obj)
          )
    }

    private buildAvisoPrompt(message: string): string {
        return `
      Você é um analisador de mensagens.
      
      Regras:
      - Responda APENAS com JSON válido
      - Não use markdown
      - Não inclua texto fora do JSON
      
      Formato obrigatório:
      {
        "isAviso": boolean,
        "mensagem": string,
        "data": string 
      }
      
      Considere aviso quando:
      - O usuário pedir para lembrar algo
      - Mencionar data, hora ou prazo
      - Usar verbos como lembrar, avisar, marcar, agendar
      
      Mensagem do usuário:
      "${message}"
      `
      }
      
}