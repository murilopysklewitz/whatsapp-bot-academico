

export interface ICommands {
    execute: ( chatId: string, args: string[], ) => Promise<string>
}