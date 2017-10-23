import { IGame } from './deathline';
import { TextRenderer } from './TextRenderer';
import { DeathlineContext } from './DeathlineContext';
import { MediaRenderer } from './MediaRenderer';

export type TContext = IContextUpdate | IContextMessage;

namespace Telegraf {
    interface IContext {
        deathline: DeathlineContext;
    }
}

export function extendContext(tgBot: Telegraf, game: IGame, textRenderer: TextRenderer, mediaRenderer: MediaRenderer) {
    tgBot.context.deathline = new DeathlineContext(tgBot, game, textRenderer, mediaRenderer);
}