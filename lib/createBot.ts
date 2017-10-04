import Telegraf = require('telegraf');
import LocalSession = require('telegraf-session-local');

export function createBot(token: string, db: string): Telegraf {
    const bot = new Telegraf(token);
    const localSession = new LocalSession({ database: db });
    bot.use(localSession.middleware());

    return bot;
}