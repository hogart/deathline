import { IDict } from './IDict';

export type TState = IDict<any>;

export type TSetter = IDict<any>; // TODO: more strict type-checking

export interface ITransition {
    /** cue id to go to */
    id: string;
    /** variables to change */
    setter?: TSetter;
    /** delay before automatically going to given cue, seconds if number, interval if string */
    delay?: number | string;
}

export interface IChoice extends ITransition {
    /** button label */
    label: string;
    /** expression to calculate against state to check if this choice displayed to user */
    visible?: string;
}

export interface ICue {
    /** cue contents, is processed with variables */
    text: string;
    /** choices to make */
    choices?: IChoice[];
    /** automatically transit to given cue */
    autoTransition?: ITransition;
    /** cue id to inherit properties from */
    extends?: string;
}

export interface IImgCue extends ICue {
    img: string;
}

export interface IAudioCue extends ICue {
    audio: string;
}

export type TCue = ICue | IImgCue | IAudioCue;

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

export interface IImportedCues {
    /** starting cue */
    start: string;
    /** cues */
    cues: IDict<ICue>;
}

export interface IGame extends IImportedCues {
    /** initial game state */
    state: TState;
    /** game title */
    title: string;
    /** game description, for help */
    description: string;
    /** various engine settings */
    settings: IGameSettings;
    /** cues */
    cues: IDict<TCue>;
    gameFile: string;
}

export interface IUser {
    /** last shown cue id */
    currentId: string;
    /** user game state */
    state: TState;
    /** current timeout, if any */
    timeout?: number;
}