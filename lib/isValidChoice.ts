import { IChoice, IGame, IUser } from './deathline';

export function isValidChoice(cueId: string, game: IGame, user: IUser): IChoice | null {
    const cue = game.cues[user.currentId];

    if (cue.choices) {
        return cue.choices.find(
            (choice: IChoice) => choice.id === cueId
        ) || null;
    } else {
        return null;
    }
}