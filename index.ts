import Telegraf = require('telegraf');
import ms = require('ms');
import { createBot } from './lib/createBot';
import { loadGame } from './lib/loadGame';
import { renderCue } from './lib/renderCue';
import { IUser } from './lib/deathline';
import { TimeOutManager } from './lib/TimeOutManager';
import { extractCueId } from './lib/extractCueId';
import { isValidChoice } from './lib/isValidChoice';
import { createUser } from './lib/createUser';
import { cuePrefix, waitingMsg } from './constants';

const bot = createBot('', 'game_db.json');

loadGame().then((game) => {
    const timeOutManager = new TimeOutManager();

    bot.command('/help', (ctx) => {
        return ctx.reply(game.description);
    });

    bot.command('/start', (ctx) => {
        const username = ctx.from.username;
        if (ctx.session[username]) {
            return ctx.reply(
                'Вы действительно хотите начать всё сначала?',
                Telegraf.Extra.markdown().markup((m: any) =>
                    m.inlineKeyboard([
                        [m.callbackButton('Да, заново', '/restart')],
                    ])
                )
            );
        } else {
            ctx.session[username] = createUser(game);
            const {message, choices} = renderCue(game, ctx.session[username]);

            return ctx.reply(message, choices);
        }
    });

    function restart(ctx: IContextUpdate) {
        const username = ctx.from.username;
        ctx.session[username] = createUser(game);
        const {message, choices} = renderCue(game, ctx.session[username]);

        return ctx.reply(message, choices);
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

            const renderReply = () => {
                user.currentId = choice.id;
                const {message, choices} = renderCue(game, ctx.session[username]);
                return ctx.reply(message, choices);
            };

            if (choice.delay) {
                const delay = typeof choice.delay === 'number' ? choice.delay : ms(choice.delay);
                user.timeout = timeOutManager.set(renderReply, delay);
                ctx.reply(waitingMsg);
            } else {
                return renderReply();
            }
        }
    });

    bot.startPolling();
    console.log('Bot started polling');
});





