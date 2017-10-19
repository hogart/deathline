import { ICue, IGame, IUser } from './deathline';
import { IReply, Renderer } from './Renderer';

export type TContext = IContextUpdate | IContextMessage;

export function extendContext(tgBot: Telegraf, game: IGame, renderer: Renderer) {
    tgBot.context.deathline = {
        getUser(ctx: TContext): IUser {
            const username = ctx.from.username;
            const user = ctx.session[username];

            return user;
        },

        getCue(ctx: TContext, cueId?: string): ICue {
            return game.cues[cueId || this.getUser(ctx).currentId];
        },

        reply(ctx: TContext, reply: IReply) {
            let method;

            if (reply.img) {
                method = ctx.replyWithPhoto;
            } else if (reply.audio) {
                method = ctx.replyWithAudio;
            } else {
                if (game.settings.markdown) {
                    method = ctx.replyWithMarkdown;
                } else {
                    method = ctx.replyWithHTML;
                }
            }

            return method(reply.message, reply.buttons);
        },

        help(ctx: TContext, user: IUser) {
            return (game.settings.markdown ? ctx.replyWithMarkdown : ctx.replyWithHTML)(renderer.help(user.state || game.state));
        },
    };
}