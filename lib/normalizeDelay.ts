import ms = require('ms');
import { ITransition } from './deathline';

export function normalizeDelay(transition: ITransition): number {
    if (!transition.delay) {
        return 0;
    } else if (typeof transition.delay === 'number') {
        return transition.delay * 1000;
    } else {
        return ms(transition.delay);
    }
}