import Telegraf = require('telegraf');
import template = require('lodash.template');
import { TemplateExecutor } from 'lodash';
import { IAudioCue, IChoice, TCue, IGame, IImgCue, ITemplateSettings, IUser, TState, IGameSettings } from './deathline';
import { restartConfirmation, restartRequest, waitingMessage } from './constants';
import { runSafeExpression } from './safeExpression';
import { IDict } from './IDict';

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
export class TextRenderer {
    private game: IGame;
    private markupRenderer: Function;

    private templateSettings: ITemplateSettings<RegExp> = {};
    private templateCache: IDict<TemplateExecutor> = {};

    private restartRequest: string = restartRequest;
    private restartConfirmation: string = restartConfirmation;
    private waitingMessage: string = waitingMessage;

    constructor(game: IGame) {
        this.game = game;
        const settings = game.settings;

        this.markupRenderer = settings.markdown ? Telegraf.Extra.markdown : Telegraf.Extra.HTML;

        this.initTemplate(settings.templateSettings);

        this.initServiceMessages(settings);
    }

    private initTemplate(templateSettings?: ITemplateSettings<string>): void {
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

    private initServiceMessages(settings: IGameSettings) {
        this.restartRequest = settings.restartRequest || this.restartRequest;
        this.restartConfirmation = settings.restartConfirmation || this.restartConfirmation;
        this.waitingMessage = settings.waitingMessage || this.waitingMessage;
    }

    private template(str: string, data?: object): string {
        if (!this.templateCache[str]) {
            this.templateCache[str] = template(str, this.templateSettings);
        }

        return this.templateCache[str](data);
    }

    private renderButton(button: IButton, m: any): any[] {
        return [m.callbackButton(button.label, button.action)];
    }

    private choiceLabel(choice: IChoice, state: TState): string {
        return this.template(choice.label, state);
    }

    private choiceAction(cueId: string, index: number): string {
        return `/cue::${cueId}::${index}`;
    }

    private choiceButton(choice: IChoice, state: TState, cueId: string, index: number, markup: any): any { // TODO: reduce amount of args
        return this.renderButton(
            {
                label: this.choiceLabel(choice, state),
                action: this.choiceAction(cueId, index),
            },
            markup
        );
    }

    private inlineKeyboard(buttons: IButton[]): any {
        return this.markupRenderer().markup((markup: any) => {
            const keyboard = buttons.map(
                (button) => this.renderButton(button, markup)
            );

            return markup.inlineKeyboard(keyboard);
        });
    }

    public choices(choices: IChoice[], state: TState, cueId: string): any {
        return this.markupRenderer().markup((markup: any) => {
            const renderButton = (choice: IChoice, index: number) => {
                return this.choiceButton(choice, state, cueId, index, markup);
            };

            const keyboard = choices.reduce<any[]>((buttons, choice, index) => {
                if (this.isChoiceVisible(choice, state)) {
                    buttons.push(renderButton(choice, index));
                }

                return buttons;
            }, []);

            return markup.inlineKeyboard(keyboard);
        });
    }

    private isChoiceVisible(choice: IChoice, state: TState): boolean {
        if (choice.visible !== undefined) {
            const isVisible = runSafeExpression(choice.visible, state);

            return isVisible;
        } else {
            return true;
        }
    }

    private isImgCue(cue: TCue): cue is IImgCue {
        return (<IImgCue>cue).img !== undefined;
    }

    private isAudioCue(cue: TCue): cue is IAudioCue {
        return (<IAudioCue>cue).audio !== undefined;
    }

    public cue(cue: TCue, state: TState, id: string): IReply {
        const reply: IReply = {
            message: this.template(cue.text, state),
            buttons: cue.choices ? this.choices(cue.choices, state, id) : null,
        };

        if (this.isImgCue(cue)) {
            reply.img = cue.img;
        } else if (this.isAudioCue(cue)) {
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