import ms = require('ms');

export function normalizeDelay(delay: string | number = 0): number {
    if (typeof delay === 'number') {
        return delay * 1000;
    } else {
        return ms(delay);
    }
}