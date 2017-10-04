import {IGame, IUser} from './deathline';
import {clone} from './clone';

export function createUser(game: IGame): IUser {
    return {
        state: clone(game.state),
        currentId: game.start,
    }
}