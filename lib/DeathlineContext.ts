import {IGame, IUser, TCue} from './deathline';
import {IReply, Renderer} from './Renderer';
import {TContext} from './extendContext';
import { filePathToOptions } from './filePathToOptions';

export class DeathlineContext {
    private tgBot: Telegraf;
    private game: IGame;
    private renderer: Renderer;

    constructor(tgBot: Telegraf, game: IGame, renderer: Renderer) {
        this.tgBot = tgBot;
        this.game = game;
        this.renderer = renderer;
    }

    public getUser(ctx: TContext): IUser {
        const username = ctx.from.username;
        const user = ctx.session[username];

        return user;
    }

    public getCue(ctx: TContext, cueId?: string): TCue {
        return this.game.cues[cueId || this.getUser(ctx).currentId];
    }

    public reply(ctx: TContext, reply: IReply) {
        if (reply.img) {
            return filePathToOptions(reply.img).then((options) => {
                return ctx.replyWithPhoto(options, {
                    caption: reply.message,
                    ...reply.buttons,
                });
            }).catch((e) => {
                console.error(e);

                return ctx.reply('Bad image', reply.buttons);
            });
        } else if (reply.audio) {
            return filePathToOptions(reply.audio).then((options) => {
                return ctx.replyWithAudio(options, {
                    caption: reply.message,
                    ...reply.buttons,
                });
            }).catch((e) => {
                console.error(e);

                return ctx.reply('Bad audio', reply.buttons);
            });
        } else {
            if (this.game.settings.markdown) {
                return ctx.replyWithMarkdown(reply.message, reply.buttons);
            } else {
                return ctx.replyWithHTML(reply.message, reply.buttons);
            }
        }
    }

    public help(ctx: TContext, user: IUser) {
        return (this.game.settings.markdown ? ctx.replyWithMarkdown : ctx.replyWithHTML)(this.renderer.help(user.state || this.game.state));
    }
}