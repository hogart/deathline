interface IStorage {}

declare class LocalSession {
    constructor(options?: ILocalSessionOptions);

    middleware(): Function;

    static storagefileSync: IStorage;
    static storagefileAsync: IStorage;
    static storageMemory: IStorage;
}

interface ILocalSessionOptions {
    database?: string;
    storage?: IStorage;
    format?: {
        serialize(object: any): string;
        deserialize(str: string): any;
    },
    state?: any;
}

declare namespace LocalSession {

}

declare module 'telegraf-session-local' {
    export = LocalSession;
}
