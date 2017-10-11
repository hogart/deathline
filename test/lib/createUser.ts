import { Expect, TestCase } from 'alsatian';
import { createUser } from '../../lib/createUser';
import { IGame, IUser } from '../../lib/deathline';

const testGame = {
    state: {
        var1: 'some value',
        var2: true,
    },
    start: 'some id',
    title: '',
    description: '',
    settings: {},
    cues: {},
};

export class CreateUserFixture {
    @TestCase(
        testGame,
        createUser(testGame)
    )
    public createUserTest(game: IGame, user: IUser) {
        Expect(user.state.var1).toEqual('some value');
        Expect(user.state.var2).toEqual(true);
        Expect(user.state).not.toBe(game.state);
        Expect(user.currentId).toBe('some id');
    }
}
