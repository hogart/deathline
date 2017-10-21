import { IGame } from './deathline';
import { Renderer } from './Renderer';
import { DeathlineContext } from './DeathlineContext';

export type TContext = IContextUpdate | IContextMessage;

namespace Telegraf {
    interface IContext {
        deathline: DeathlineContext;
    }
}

export function extendContext(tgBot: Telegraf, game: IGame, renderer: Renderer) {
    tgBot.context.deathline = new DeathlineContext(tgBot, game, renderer);
}