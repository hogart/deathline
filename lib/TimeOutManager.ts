import Timer = NodeJS.Timer;
import { IDict } from './deathline';

export class TimeOutManager {
    private timeouts: IDict<Timer>;
    private counter: number;

    constructor() {
        this.timeouts = {};
        this.counter = 0;
    }

    set(cb: Function, delay: number, ...args: any[]): number {
        const id = this.counter;
        const t: Timer = setTimeout(() => {
            this.clear(id);
            cb.apply(null, ...args);
        }, delay);

        this.timeouts[this.counter] = t;
        this.counter++;

        return id;
    }

    clear(id: number): void {
        clearTimeout(this.timeouts[id]);
        delete this.timeouts[id];
    }
}