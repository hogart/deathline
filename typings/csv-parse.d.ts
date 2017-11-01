interface IParseCallback {
    (error: Error, grid: string[][]): void;
}

interface IParseOptions {
    from?: number;
}

declare function parse(data: string, options: object, cb: IParseCallback): never;
declare function parse(data: string, cb: IParseCallback): never;

declare module 'csv-parse' {
    export = parse;
}