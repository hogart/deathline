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
        return this.markupRenderer().markup((m: any) => {
            return m.inlineKeyboard(
                buttons.map((button) => this.button(button, m))
            );
        });
    }

    public choices(choices: IChoice[], state: TState): any {
        return this.markupRenderer().markup((m: any) => {
            const buttons = choices.map((choice) =>
                this.button(
                    {
                        label: this.template(choice.label, state),
                        action: `/cue:${choice.id}`,
                    },
                    m
                )
            );

            return m.inlineKeyboard(buttons);
        });
    }

    public cue(cue: ICue, state: TState): IReply {
        const message = this.template(cue.text, state);
        const buttons = cue.choices ? this.choices(cue.choices, state) : null;

        return {
            message,
            buttons,
        };
    }

    public help(user?: IUser): string {
        return this.template(
            this.game.description,
            user ? user.state : this.game.state // in case user sees this before starting game
        );
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