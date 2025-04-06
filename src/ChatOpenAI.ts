import OpenAI from "openai";

export default class ChatOpenAI {
    private llm: OpenAI;
    private messages: OpenAI.Chat.ChatCompletionMessageParam[];
    private model: string;

    constructor(model: string, apiKey: string, baseURL: string, systemPrompt: string) {
        this.llm = new OpenAI({
            apiKey: apiKey,
            baseURL: baseURL,
        });
        this.messages = [
            {
                role: "system",
                content: systemPrompt,
            },
        ];
        this.model = model;
    }

    async chat(message: string) {
        this.messages.push({
            role: "user",
            content: message,
        });

        const stream = await this.llm.chat.completions.create({
            model: this.model,
            messages: this.messages,
            stream: true
        });

        let result = '';

        for await (const chunk of stream) {
            result += chunk.choices[0].delta.content || '';
            process.stdout.write(chunk.choices[0].delta.content || '');
        }

        return result;
    }
}
