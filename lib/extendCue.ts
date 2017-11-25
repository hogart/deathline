import { IChoice, ICue, IGame, ITransition, TCue, TSetter, } from './deathline';
import { clone } from './clone';

function mergeSetter(target?: TSetter, src?: TSetter): TSetter | undefined {
    if (target === undefined || src === undefined) {
        return target || src;
    } else {
        return Object.assign(target, src);
    }
}

function mergeTransition(target?: ITransition, src?: ITransition): ITransition | undefined {
    if (target === undefined || src === undefined) {
        return target || src;
    }

    const result: ITransition = {
        id: target.id || src.id,
    };

    const setter = mergeSetter(target.setter, src.setter);
    if (setter !== undefined) {
        result.setter = setter;
    }
    const delay = target.delay || src.delay;
    if (delay !== undefined) {
        result.delay = delay;
    }

    return result;
}

function mergeChoice(target: IChoice, src: IChoice): IChoice {
    const result: any = {
        ...mergeTransition(target, src),
        label: target.label || src.label,
    };

    const visible = target.visible || src.visible;
    if (visible !== undefined) {
        result.visible = visible;
    }

    return result as IChoice;
}

function mergeChoices(target?: IChoice[], src?: IChoice[]): IChoice[] | undefined {
    if (target === undefined || src === undefined) {
        return target || src;
    }

    const result = [];
    for (let i = 0, len = Math.max(target.length, src.length); i < len; i++) {
        if (target[i] && src[i]) {
            result[i] = mergeChoice(target[i], src[i]);
        } else {
            result[i] = target[i] || src[i];
        }
    }

    return result;
}

function mergeCue(target: ICue, src: ICue): ICue {
    const result: ICue = {
        text: src.text || target.text,
    };

    const choices = mergeChoices(target.choices, src.choices);
    if (choices !== undefined) {
        result.choices = choices;
    }

    const transition = mergeTransition(target.autoTransition, src.autoTransition);
    if (transition !== undefined) {
        result.autoTransition = transition;
    }

    return result;
}

export function extendCue(cue: TCue, game: IGame): TCue {
    let currCue = cue;
    const parentCues = [];

    while (currCue.extends !== undefined) {
        const parent = game.cues[currCue.extends];
        if (parent) {
            parentCues.push(parent);
            currCue = parent;
        }
    }

    let media: any = null;

    let result = parentCues.reduce((accumulator: any, parentCue: any) => {
        if (media === null) {
            if (parentCue.img) {
                media = { img: parentCue.img };
            } else if (parentCue.audio) {
                media = { audio: parentCue.audio };
            }
        }

        return mergeCue(accumulator, parentCue);
    }, clone<TCue>(cue));

    result = Object.assign(result, media);

    return result as TCue;
}