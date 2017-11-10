import { IChoice, TCue } from './deathline';

/**
 * Checks if it was valid choice and returns choice object or null
 */
export function getChoice(currentCue: TCue, choiceIndex: number): IChoice | null {
    if (currentCue.choices) {
        return currentCue.choices[choiceIndex] || null;
    } else {
        return null;
    }
}