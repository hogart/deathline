import { readFile as _readFile} from 'fs'
import * as util from 'util'
import { IGame } from './deathline';

const readFile = util.promisify(_readFile);

export function loadGame(gameName: string = 'pushkin'): Promise<IGame> {
    return readFile(`./games/${gameName}.json`)
        .then((contents) => {
            const game: IGame = JSON.parse(contents.toString());
            console.log(`Game "${game.title}" loaded from "${gameName}".`);

            return game;
        });
}