import { readFile as _readFile} from 'fs';
import * as util from 'util';
import * as Ajv from 'ajv';
import { IGame } from './deathline';

const readFile = util.promisify(_readFile);

// tslint:disable-next-line:no-var-requires
const schema = require('../schema.json');
const ajv = new Ajv();
const validate = ajv.compile(schema);

export function loadGame(gameName: string = 'pushkin'): Promise<IGame> {
    function onGameLoaded(contents: Buffer) {
        const game: IGame = JSON.parse(contents.toString());
        const valid = validate(game);
        if (!valid) {
            throw new Error(JSON.stringify(validate.errors));
        }
        console.log(`Game "${game.title}" loaded from "${gameName}".`);

        return game;
    }

    return readFile(`./games/${gameName}.json`)
        .then(onGameLoaded);
}