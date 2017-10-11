import { cuePrefix } from './constants';

export function extractCueId(ctx: IContextUpdate): string {
    return ctx.update.callback_query.data.replace(cuePrefix, '');
}