export interface IDict<T> {
    [key: string]: T;
}

type TState = IDict<any>;

interface ISetterInc {
    $inc: any;
}

interface ISetterDec {
    $dec: number;
}

interface ISetterMul {
    $mul: number;
}

interface ISetterSet {
    $set: any;
}

interface ISetterNeg {
    $neg: any;
}

export type TSetter = IDict<ISetterInc & ISetterDec & ISetterMul & ISetterSet & ISetterNeg>;

export interface IChoice {
    /** button label */
    label: string;
    /** cue id to go to */
    id: string;
    /** variables to change */
    setter?: TSetter;
    /** delay before automatically going to given cue, seconds if number, interval if string */
    delay?: number | string;
}

interface ICue {
    /** cue contents, is processed with variables */
    text: string;
    /** choices to make */
    choices?: IChoice[];
}

export interface ITemplateSettings<T> {
    escape?: T;
    evaluate?: T;
    interpolate?: T;
}

export interface IGameSettings {
    /** Use markdown (otherwise HTML) */
    markdown?: boolean;
    /** _.template settings */
    templateSettings?: ITemplateSettings<string>;
    restartRequest?: string;
    restartConfirmation?: string;
    waitingMessage?: string;
}

export interface IGame {
    /** initial game state */
    state: TState;
    /** game title */
    title: string;
    /** game description, for help */
    description: string;
    /** various engine settings */
    settings: IGameSettings;
    /** starting cue */
    start: string;
    /** cues */
    cues: IDict<ICue>;
}

export interface IUser {
    /** last shown cue id */
    currentId: string;
    /** user game state */
    state: TState;
    /** current timeout, if any */
    timeout?: number;
}