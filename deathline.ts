import dotenv = require('dotenv');
import { IReply, Renderer } from './lib/Renderer';
import { createBot } from './lib/createBot';
import { loadGame } from './lib/loadGame';
import { IUser, ITransition } from './lib/deathline';
import { TimeOutManager } from './lib/TimeOutManager';
import { extractCueId } from './lib/extractCueId';
import { getChoice } from './lib/getChoice';
import { createUser } from './lib/createUser';
import { cuePrefix } from './lib/constants';
import { applySetter } from './lib/applySetter';
import { normalizeDelay } from './lib/normalizeDelay';
import { extendContext, TContext } from './lib/extendContext';

dotenv.config();

const bot = createBot(process.env.BOT_TOKEN as string, 'game_db.json');

loadGame(process.env.GAME_NAME).then((game) => {
    const timeOutManager = new TimeOutManager();
    const renderer = new Renderer(game);
    extendContext(bot, game);

    bot.command('/help', (ctx) => {
        return ctx.reply(
            renderer.help(ctx.deathline.getUser(ctx))
        );
    });

    bot.command('/start', (ctx) => {
        const username = ctx.from.username;

        if (!ctx.session[username]) {
            ctx.session[username] = createUser(game);
        }

        const transition: ITransition = {
            id: game.start,
        };

        return transitionTo(transition, ctx.session[username])
            .then(replyResolver(ctx));
    });

    function replyResolver(ctx: TContext) {
        return function (reply: IReply) {
            if (reply.auto) {
                reply.auto.then(replyResolver(ctx));
            }

            return ctx.reply(reply.message, reply.buttons);
        };
    }

    function restart(ctx: IContextUpdate) {
        const username = ctx.from.username;
        ctx.session[username] = createUser(game);

        const transition = {
            id: game.start,
        };

        return transitionTo(transition, ctx.session[username])
            .then(replyResolver(ctx));
    }

    bot.action('/restart', restart);
    bot.command('/restart', restart);

    function transitionTo(transition: ITransition, user: IUser): Promise<IReply> {
        const targetCue = game.cues[transition.id];

        if (transition.setter) {
            user.state = applySetter(user, transition.setter);
        }

        const {message, buttons} = renderer.cue(targetCue, user.state);

        return new Promise((resolve) => {
            timeOutManager.set(() => {
                const reply: IReply = {message, buttons};
                if (targetCue.autoTransition) {
                    reply.auto = handleAutoTransition(targetCue.autoTransition, user);
                }
                resolve(reply);
            }, normalizeDelay(transition));
        });
    }

    function handleAutoTransition(transition: ITransition, user: IUser): Promise<IReply> {
        return new Promise((resolve) => {
            timeOutManager.set(
                () => {
                    resolve(transitionTo(transition, user));
                },
                normalizeDelay(transition)
            );
        });
    }

    bot.action(cuePrefix, (ctx) => {
        const user = ctx.deathline.getUser(ctx);
        const newCue = extractCueId(ctx);
        const transition = getChoice(newCue, ctx.deathline.getCue(ctx));

        if (transition) {
            // clear idle timeout
            if (user.timeout) {
                timeOutManager.clear(user.timeout);
            }

            transitionTo(transition, user)
                .then((reply) => ctx.reply(reply.message, reply.buttons));
        }

    });

    bot.startPolling();
    console.log('Bot started polling');
}).catch((e) => console.error(e));