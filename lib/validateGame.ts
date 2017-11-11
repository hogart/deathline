import * as Ajv from 'ajv';
import { ICue, IGame, IImportedCues } from './deathline';
import { IDict } from './IDict';

// tslint:disable-next-line:no-var-requires
const schema = require('../schema.json');
const ajv = new Ajv();
const validator = ajv.compile(schema);

function validateBySchema(game: IGame): boolean {
    const valid = validator(game);

    if (!valid) {
        console.error(validator.errors);
    }

    return valid as boolean;
}

function pluck<T>(arr: T[], key: keyof T): any[] {
    return arr.map((item) => item[key]);
}

interface IInvalidTransition {
    id: string;
    index?: number;
}

interface IValidationResult {
    isValid: boolean;
    orphanChoices: IInvalidTransition[];
    orphanCues: IInvalidTransition[];
    potentialEndings: string[];
}

function validateChoices(cueIds: string[], cue: ICue, id: string): IInvalidTransition[] | true {
    const orphanChoices: IInvalidTransition[] = [];

    cue.choices!.forEach((choice, index) => {
        if (!cueIds.includes(choice.id)) {
            orphanChoices.push({
                id,
                index,
            });
        }
    });

    return orphanChoices.length ? orphanChoices : true;
}

function validateAutoTransition(cueIds: string[], cue: ICue, id: string): boolean {
    if (cue.autoTransition) {
        return cueIds.includes(cue.autoTransition.id);
    } else {
        return false;
    }
}

export function validateCues(cues: IImportedCues): IValidationResult {
    const cueIds = Object.keys(cues.cues);
    const availableChoices: string[] = [];
    const info: IValidationResult = {
        isValid: true,
        orphanChoices: [],
        orphanCues: [],
        potentialEndings: [],
    };

    cueIds.forEach((cueId) => {
        const cue = cues.cues[cueId];
        if (cue.choices) {
            availableChoices.push(...pluck(cue.choices, 'id') as string[]);
            const isValidChoices = validateChoices(cueIds, cue, cueId);
            if (isValidChoices !== true) {
                info.orphanChoices.push(...isValidChoices);
                info.isValid = false;
            }
        } else if (cue.autoTransition) {
            availableChoices.push(cue.autoTransition.id);
            const isValidAutoTransition = validateAutoTransition(cueIds, cue, cueId);
            if (!isValidAutoTransition) {
                info.isValid = false;
                info.orphanChoices.push({
                    id: cueId,
                });
            }
        } else {
            info.potentialEndings.push(cueId);
        }

    });

    cueIds.forEach((cueId) => {
        if (!availableChoices.includes(cueId) && cues.start !== cueId) {
            info.isValid = false;
            info.orphanCues.push({
                id: cueId,
            });
        }
    });

    return info;
}

function renderOrphanTransitions(transitions: IInvalidTransition[]): string {
    return transitions
        .map((transition) => {
            return `${transition.id}.${transition.index !== undefined ? transition.index : 'auto'}`;
        })
        .join(', ');
}

export function renderValidationResult(info: IValidationResult) {
    if (!info.isValid) {
        if (info.orphanChoices.length) {
            console.error(`Detected orphan choices and transitions: ${renderOrphanTransitions(info.orphanChoices)}.`);
        }

        if (info.orphanCues.length) {
            console.error(`Detected orphan cues (no inbound transitions): ${pluck(info.orphanCues, 'id').join(', ')}.`);
        }
    }

    if (info.potentialEndings.length) {
        console.info(`Detected following game endings (cues with no outbound transitions): ${info.potentialEndings.join(', ')}. Check if this is intended.`);
    } else {
        console.warn(`No endings detected, check if this is intended.`);
    }
}

export function validateGame(game: IGame): boolean {
    const wellFormed = validateBySchema(game);
    if (!wellFormed) {
        return false;
    } else {
        const validationResult = validateCues(game);
        renderValidationResult(validationResult);

        if (!validationResult.isValid) {
            return false;
        }
    }

    return true;
}