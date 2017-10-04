import template = require('lodash.template');
import Telegraf = require('telegraf');
import { IGame, IUser, IChoice } from './deathline';

interface IReply {
    message: string,
    choices?: any;
}

export function renderChoices(choices: IChoice[], user: IUser): any {
    return Telegraf.Extra.markdown().markup((m: any) =>
        m.inlineKeyboard(
            choices.map((choice) => [
                m.callbackButton(
                    template(choice.label)(user.state),
                    `/cue:${choice.id}`
                )
            ])
        )
    )
}

export function renderCue(game: IGame, user: IUser): IReply {
    const cue = game.cues[user.currentId];
    const message = template(cue.text)(user.state);
    const choices = cue.choices ? renderChoices(cue.choices, user) : null;

    return {
        message,
        choices,
    };
}