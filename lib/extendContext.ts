import { ICue, IGame, IUser } from './deathline';

export type TContext = IContextUpdate | IContextMessage;

export function extendContext(tgBot: Telegraf, game: IGame) {
    tgBot.context.deathline = {
        getUser(ctx: TContext): IUser {
            const username = ctx.from.username;
            const user = ctx.session[username];

            return user;
        },

        getCue(ctx: TContext, cueId?: string): ICue {
            return game.cues[cueId || this.getUser(ctx).currentId];
        },
    };
}