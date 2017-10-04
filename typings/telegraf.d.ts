interface IMessage {
    text: string;
}

interface IUpdate {
    update_id: number;
    callback_query: {
        from: object;
        message: object;
        data: any;
    };
    message: {
        message_id: number;
        from: {
            id: number;
        };
        chat: object;
        date: number;
        text: string;
        entities: object[];
    }
}

interface IContext {
    reply(message: string, opts?: any): void;
    session? : any;
    from: {
        username: string;
    }
}

interface IContextMessage extends IContext {
    message: IMessage;
}

interface IContextUpdate extends IContext {
    update: IUpdate;
}

interface IHandler<T extends IContext> {
    (ctx: T): void;
}

declare class Telegraf {
    constructor(token: string, options?: object);

    command(cmd: string, handler: IHandler<IContextUpdate>): void;
    hears(msg: string | RegExp, handler: IHandler<IContextMessage>): void;
    action(msg: string | RegExp, handler: IHandler<IContextUpdate>): void;
    startPolling(): void;
    use(...middlware: Function[]): void;
}


declare namespace Telegraf {
    export class Markup {
        static keyboard(desc: any): any;
    }

    export class Extra {
        static HTML(): any;
        static markdown(): any;
    }
}

declare module 'telegraf' {
    export = Telegraf;
}