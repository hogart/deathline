import { IUser } from '../lib/deathline';

export function createTestUser(props?: any): IUser {
    const user: IUser = {
        state: {},
        currentId: 'starting cue',
        ...props,
    };

    return user;
}