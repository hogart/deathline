import get = require('lodash.get');
import set = require('lodash.set');
import { IUser, TSetter, TState } from './deathline';
import { clone } from './clone';
import { IDict } from './IDict';

const setterMap: IDict<Function> = {
    // Math operations
    $inc(value: number, operand: number): number {
        return value + operand;
    },
    $dec(value: number, operand: number): number {
        return value - operand;
    },
    $mul(value: number, operand: number): number {
        return value * operand;
    },
    $div(value: number, operand: number): number {
        return value / operand;
    },
    $pow(value: number, operand: number): number {
        return value ** operand;
    },

    // Boolean
    $neg(value: number, operand: any): boolean {
        return !value;
    },

    // string
    $append(value: string, operand: string): string {
        return value + operand;
    },
    $prepend(value: string, operand: string): string {
        return operand + value;
    },

    $set(value: any, operand: any): any {
        return operand;
    },
};

export function applySetter(user: IUser, setter?: TSetter): TState {
    const state = clone(user.state);

    if (!setter) {
        return state;
    }

    Object.keys(setter).forEach((stateKey) => {
        const action = setter[stateKey];

        let operation: Function;
        let operand: any;

        // first key is our operation
        const operationName = <string>Object.keys(action)[0];

        if (setterMap.hasOwnProperty(operationName)) {
            operation = setterMap[operationName];
            operand = action[operationName];
        } else {
            operation = setterMap.$set;
            operand = action;
        }

        const oldValue = get(state, stateKey);
        const newValue = operation(oldValue, operand);
        set(state, stateKey, newValue);
    });

    return state;
}