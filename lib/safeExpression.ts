import { TState } from './deathline';
import { CacheMap } from './CacheMap';

const blacklist = ['global', 'process', 'require', 'eval', 'Function', 'setTimeout', 'setInterval'];

function createSafeExpression(code: string): Function {
    return new Function(...blacklist, 'state', `return ${code};`);
}

const compiled = new CacheMap<string, Function>(createSafeExpression);

export class SecurityError extends Error {
    constructor(code: string, state: TState) {
        super();
        this.message = `Possible security violation in expression "${code}" with "${JSON.stringify(state)}"`;
        this.name = 'NotAFileError';
    }
}

/**
 * Tries to run string as expression as safely as it can.
 * @throws SecurityError
 * @param {string} code
 * @param {TState} state
 * @returns {any}
 */
export function runSafeExpression(code: string, state: TState): any {
    const expr = compiled.get(code);

    let result: any;

    function guard(): never {
        throw new SecurityError(code, state);
    }

    const args: Function[] = [];
    // skip 'global' and 'process'
    for (let i = 2, len = blacklist.length; i < len; i++) {
        args.push(guard);
    }

    try {
        result = expr(null, null, ...args, state);

        return result;
    } catch (e) {
        if (e instanceof SecurityError) {
            console.error(e.message);
        }

        throw e;
    }
}