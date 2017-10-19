import Telegraf = require('telegraf');
import template = require('lodash.template');
import { TemplateExecutor } from 'lodash';
import { IChoice, ICue, IDict, IGame, ITemplateSettings, IUser, TState } from './deathline';
import { restartConfirmation, restartRequest, waitingMessage } from './constants';

interface IButton {
    action: string;
    label: string;
}

export interface IReply {
    message: string;
    buttons?: any;
    auto?: Promise<IReply>;
    img?: string;
    audio?: string;
}

/**
 * Responsible for all text rendering in game
 */
export class Renderer {
    private game: IGame;
    private markupRenderer: Function;

    private templateSettings: ITemplateSettings<RegExp>;
    private templateCache: IDict<TemplateExecutor>;

    private restartRequest: string;
    private restartConfirmation: string;
    private waitingMessage: string;

    constructor(game: IGame) {
        this.game = game;
        const settings = game.settings;

        this.markupRenderer = settings.markdown ? Telegraf.Extra.markdown : Telegraf.Extra.HTML;

        this.initTemplateSettings(settings.templateSettings);

        this.templateCache = {};

        this.restartRequest = settings.restartRequest || restartRequest;
        this.restartConfirmation = settings.restartConfirmation || restartConfirmation;
        this.waitingMessage = settings.waitingMessage || waitingMessage;
    }

    private initTemplateSettings(templateSettings?: ITemplateSettings<string>): void {
        this.templateSettings = {};

        if (templateSettings) {
            if (templateSettings.escape) {
                this.templateSettings.escape = new RegExp(templateSettings.escape);
            }

            if (templateSettings.evaluate) {
                this.templateSettings.evaluate = new RegExp(templateSettings.evaluate);
            }

            if (templateSettings.interpolate) {
                this.templateSettings.evaluate = new RegExp(templateSettings.interpolate);
            }
        }
    }

    private template(str: string, data?: object): string {
        if (!this.templateCache[str]) {
            this.templateCache[str] = template(str, this.templateSettings);
        }

        return this.templateCache[str](data);
    }

    private button(button: IButton, m: any): any[] {
        return [m.callbackButton(button.label, button.action)];
    }

    private inlineKeyboard(buttons: IButton[]): any {
        return this.markupRenderer().markup((markup: any) => {
            const keyboard = buttons.map(
                (button) => this.button(button, markup)
            );

            return markup.inlineKeyboard(keyboard);
        });
    }

    public choices(choices: IChoice[], state: TState): any {
        return this.markupRenderer().markup((markup: any) => {
            const keyboard = choices.map((choice) =>
                this.button(
                    {
                        label: this.template(choice.label, state),
                        action: `/cue:${choice.id}`,
                    },
                    markup
                )
            );

            return markup.inlineKeyboard(keyboard);
        });
    }

    public cue(cue: ICue, state: TState): IReply {
        const reply: IReply = {
            message: this.template(cue.text, state),
            buttons: cue.choices ? this.choices(cue.choices, state) : null,
        };

        if (cue.img) {
            reply.img = cue.img;
        } else if (cue.audio) {
            reply.audio = cue.audio;
        }

        return reply;
    }

    public help(state: TState): string {
        return this.template(this.game.description, state);
    }

    public restart(user: IUser): IReply {
        const message = this.template(
            this.restartRequest,
            user.state
        );
        const buttons = this.inlineKeyboard([{
            label: this.template(this.restartConfirmation, user.state),
            action: '/restart',
        }]);

        return {
            message,
            buttons,
        };
    }

    public waiting(user: IUser): IReply {
        const message = this.template(
            this.waitingMessage,
            user.state
        );

        return {
            message,
        };
    }
}