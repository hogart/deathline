import { IChoice, TCue } from './deathline';

/**
 * Checks if it was valid choice and returns choice object or null
 */
export function getChoice(targetCue: string, currentCue: TCue): IChoice | null {
    if (currentCue.choices) {
        return currentCue.choices.find(
            (choice: IChoice) => choice.id === targetCue
        ) || null;
    } else {
        return null;
    }
}