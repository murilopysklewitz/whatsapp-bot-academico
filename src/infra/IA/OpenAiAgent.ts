import OpenAI from 'openai';


export class OpenAiAgent {
    private client: OpenAI;

    constructor(
        apiKey: string
    ){
        this.client = new OpenAI({apiKey})
    }

    async returnMessage(message: string): Promise<string>{
        const response = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a student assist"
                },
                {
                    role: "user",
                    content: message
                }
            ]
        })
        return response.choices[0]?.message.content ?? '';
    }
}