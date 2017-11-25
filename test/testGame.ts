import { IGame } from '../lib/deathline';

export function createTestGame(props?: any): IGame {
    const game: IGame = {
        title: '',
        description: '',
        settings: {},
        gameFile: '',
        start: '1',
        state: {},
        cues: {},

        ...props,
    };

    return game;
}