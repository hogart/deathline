import { IUser, TSetter } from './deathline';

export function applySetter(user: IUser, setter?: TSetter): void {
    if (!setter) {
        return;
    }

    const state = user.state;

    Object.keys(setter).forEach((key) => {
        const action = setter[key];
        if (action.$inc !== undefined) {
            state[key] += action.$inc;
        } else if (action.$dec !== undefined) {
            state[key] -= action.$dec;
        } else if (action.$mul !== undefined) {
            state[key] *= action.$mul;
        } else if (action.$neg !== undefined) {
            state[key] = !state[key];
        } else {
            state[key] = action;
        }
    });
}