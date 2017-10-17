interface IStorage {}

declare class LocalSession {
    constructor(options?: ILocalSessionOptions);

    public middleware(): Function;

    public static storagefileSync: IStorage;
    public static storagefileAsync: IStorage;
    public static storageMemory: IStorage;
}

interface ILocalSessionOptions {
    database?: string;
    storage?: IStorage;
    format?: {
        serialize(object: any): string;
        deserialize(str: string): any;
    };
    state?: any;
}

declare namespace LocalSession {

}

declare module 'telegraf-session-local' {
    export = LocalSession;
}
