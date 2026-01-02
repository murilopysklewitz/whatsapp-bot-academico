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
    
    async processAviso(message: string): Promise<string> {
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
        console.log("[OPEN AI AGENT] resposta da IA sem tratamento", result);
        if(!result) throw new Error("mensagem não encontrada");
        return result;
    }

    private buildAvisoPrompt(message: string): string {
        return `
      Você é um analisador de mensagens.
      
      REGRAS OBRIGATÓRIAS:
      - Responda APENAS com JSON válido
      - Não use markdown
      - Não inclua texto fora do JSON
      - Nunca explique nada
      - Nunca inclua comentários
      - Nunca inclua campos extras
      
      FORMATO EXATO DA RESPOSTA:
      {
        "isAviso": boolean,
        "message": string | null,
        "date": string | null
      }
      
      REGRAS DE DATA:
      - A data DEVE estar no formato "DD/MM"
      - Se não houver data clara, use null
      - NÃO invente datas
      - NÃO use texto como "amanhã", "depois", "semana que vem"
      
      QUANDO isAviso = true:
      - mensagem: descrição curta e objetiva do aviso
      - data: "DD/MM" se existir, senão null
      
      QUANDO isAviso = false:
      {
        "isAviso": false,
        "message": null,
        "date": null
      }
      
      Considere aviso quando:
      - O usuário pedir para lembrar algo
      - Mencionar data, prazo ou compromisso
      - Usar verbos como lembrar, avisar, marcar, agendar
      
      Mensagem do usuário:
      "${message}"
      `;
      }
}