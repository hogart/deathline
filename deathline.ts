import ms = require('ms');
import dotenv = require('dotenv');
import { Renderer } from './lib/Renderer';
import { createBot } from './lib/createBot';
import { loadGame } from './lib/loadGame';
import { IUser } from './lib/deathline';
import { TimeOutManager } from './lib/TimeOutManager';
import { extractCueId } from './lib/extractCueId';
import { isValidChoice } from './lib/isValidChoice';
import { createUser } from './lib/createUser';
import { cuePrefix } from './lib/constants';
import { applySetter } from './lib/applySetter';

dotenv.config();

const bot = createBot(process.env.BOT_TOKEN as string, 'game_db.json');

loadGame(process.env.GAME_NAME).then((game) => {
    const timeOutManager = new TimeOutManager();
    const renderer = new Renderer(game);

    bot.command('/help', (ctx) => {
        return ctx.reply(
            renderer.help(ctx.session[ctx.from.username])
        );
    });

    bot.command('/start', (ctx) => {
        const username = ctx.from.username;
        if (ctx.session[username]) {
            const {message, buttons} = renderer.restart(ctx.session[username]);

            return ctx.reply(message, buttons);
        } else {
            ctx.session[username] = createUser(game);
            const {message, buttons} = renderer.cue(ctx.session[username]);

            return ctx.reply(message, buttons);
        }
    });

    function restart(ctx: IContextUpdate) {
        const username = ctx.from.username;
        ctx.session[username] = createUser(game);
        const {message, buttons} = renderer.cue(ctx.session[username]);

        return ctx.reply(message, buttons);
    }

    bot.action('/restart', restart);
    bot.command('/restart', restart);

    bot.action(cuePrefix, (ctx) => {
        const username = ctx.from.username;
        const user = ctx.session[username] as IUser;
        const cueId = extractCueId(ctx);
        const choice = isValidChoice(cueId, game, user);

        if (choice !== null) {
            if (user.timeout) {
                timeOutManager.clear(user.timeout);
            }

            applySetter(user, choice.setter);

            const renderReply = () => {
                user.currentId = choice.id;
                const {message, buttons} = renderer.cue(user);

                return ctx.reply(message, buttons);
            };

            if (choice.delay) {
                const delay = typeof choice.delay === 'number' ? (choice.delay * 1000) : ms(choice.delay);
                user.timeout = timeOutManager.set(renderReply, delay);
                const {message} = renderer.waiting(user);
                ctx.reply(message);
            } else {
                return renderReply();
            }
        }
    });

    bot.startPolling();
    console.log('Bot started polling');
}).catch((e) => console.error(e));