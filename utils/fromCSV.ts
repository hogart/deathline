// tslint:disable:no-magic-numbers

import * as path from 'path';
import { readFile as _readFile, writeFile as _writeFile } from 'fs';
import { promisify } from 'util';
import parse = require('csv-parse');
import { IChoice, ICue, IDict } from '../lib/deathline';

const readFile = promisify(_readFile);
const writeFile = promisify(_writeFile);

const parseP = promisify<string, string[][]>((data: string, cb: IParseCallback) => {
    parse(data, {from: 2}, cb);
});

const projectRoot = path.resolve(__dirname, '..');
const fileArg = process.argv[2];
const prefix = process.argv[3] ? `${process.argv[3]}:` : null;

function resolveInputPath(filePath: string): string {
    if (path.isAbsolute(filePath)) {
        return filePath;
    } else {
        return path.resolve(projectRoot, filePath);
    }
}

const inputFile = resolveInputPath(fileArg);
const outFile = inputFile.replace(/\.csv$/, '.json');

function prefixId(id: string): string {
    return prefix ? `${prefix}${id}` : id;
}

function lineToCue(line: string[]): [string, ICue] {
    const [cueId, text, ...choiceAndMisc] = line;
    const choiceLines = choiceAndMisc.slice(0, 5);
    const direct = choiceAndMisc[6];
    const comment = choiceAndMisc[7];

    const cue: ICue = {
        text,
    };

    const choices: IChoice[] = [];

    if (direct) {
        cue.autoTransition = {
            id: direct,
        };
    } else {
        for (let i = 0; i < 6; i += 2) {
            const label = choiceLines[i] && choiceLines[i].trim();
            const id = choiceLines[i + 1] && choiceLines[i + 1].trim();

            if (!!id !== !!label) { // xor
                console.info(`Cue "${cueId}" has empty choice id OR label: "${id}"/"${label}"`);
            } else if (id && label) {
                choices.push({
                    id: prefixId(id),
                    label,
                });
            }
        }

        if (choices.length) {
            cue.choices = choices;
        } else if (cue.autoTransition) {
            console.info(`Cue "${cueId}" lacks both autoTransition and choices.`);
        }
    }

    if (comment) {
        console.info(`Cue "${cueId}" commented: "${comment}"`);
    }

    return [prefixId(cueId), cue];
}

function gridToCues(grid: string[][]): IDict<ICue> {
    return grid.reduce<IDict<ICue>>(
        (accumulator: IDict<ICue>, line: string[]) => {
            const [id, cue] = lineToCue(line);

            accumulator[id] = cue;

            return accumulator;
        },
        {}
    );
}

readFile(inputFile)
    .then((buffer) => {
        return parseP(buffer.toString());
    })
    .then((grid) => {
        return gridToCues(grid);
    })
    .then((cues) => {
        return writeFile(outFile, JSON.stringify(cues, null, '  '));
    })
    .catch((e) => console.error(e));