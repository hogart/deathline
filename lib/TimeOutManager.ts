import Timer = NodeJS.Timer;
import { IDict } from './deathline';
import { normalizeDelay } from './normalizeDelay';
import { messageBufferDelay } from './constants';

/**
 * Node.js setTimeout returns complex object with circular references.
 * To be able to save timeouts to session, we need to manage timeouts buy some numeric id.
 */
export class TimeOutManager {
    private timeouts: IDict<Timer>;
    private counter: number;

    constructor() {
        this.timeouts = {};
        this.counter = 0;
    }

    public set(cb: Function, delay: number, ...args: any[]): number {
        const id = this.counter;
        const t = setTimeout(() => {
            this.clear(id);
            cb.apply(null, ...args);
        }, delay);

        this.timeouts[this.counter] = t;
        this.counter++;

        return id;
    }

    public clear(id: number): void {
        clearTimeout(this.timeouts[id]);
        delete this.timeouts[id];
    }

    public promise<T>(cb: () => T | Promise<T>, delay?: string | number): Promise<T> {
        const delayMs = normalizeDelay(delay) || messageBufferDelay;

        return new Promise((resolve) => {
            this.set(() => {
                resolve(cb());
            }, delayMs);
        });
    }
}