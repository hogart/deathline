import { readFile as _readFile} from 'fs';
import * as util from 'util';
import * as path from 'path';
import { IGame } from './deathline';
import { validateGame } from './validateGame';

const readFile = util.promisify(_readFile);

function nameToPath(gameName: string): string {
    return `./games/${gameName}.json`;
}

export function loadGame(gameName: string = 'test_game'): Promise<IGame> {
    const gameFile = nameToPath(gameName);

    function onGameLoaded(contents: Buffer) {
        const game: IGame = JSON.parse(contents.toString());
        const isGameValid = validateGame(game);

        if (isGameValid) {
            console.log(`Game "${game.title}" loaded from "${gameName}".`);

            game.gameFile = path.resolve(__dirname, '..', gameFile);

            return game;
        } else {
            throw new Error(`Game from "${gameName}" is not valid.`);
        }
    }

    return readFile(gameFile)
        .then(onGameLoaded);
}