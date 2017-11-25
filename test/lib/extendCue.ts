import { Expect, TestCase } from 'alsatian';
import { extendCue } from '../../lib/extendCue';
import { ICue } from '../../lib/deathline';
import { createTestGame } from '../testGame';

const game1 = createTestGame({
    cues: {
        1: {
            extends: '2',
            text: '',
            choices: [
                {
                    id: '0',
                    label: '000',
                    setter: {
                        var1: 'var1',
                        var2: {
                            $set: 'var2',
                        },
                    },
                },
            ],
        },
        2: {
            text: 'text',
            choices: [
                {
                    id: '1',
                    label: '111',
                    setter: {
                        var1: 'var1-override',
                        var2: {
                            $inc: 5,
                        },
                    },
                },
            ],
        },
    },
});

const game2 = createTestGame({
    cues: {
        1: {
            extends: '2',
            text: '1',
        },
        2: {
            extends: '3',
            text: '2',
            autoTransition: {
                id: '2',
                delay: '1500h',
            },
        },
        3: {
            text: '3',
            autoTransition: {
                setter: {
                    var1: 42,
                },
            },
        },
    },
});

const game3 = createTestGame({
    cues: {
        1: {
            extends: '2',
            text: '1',
            choices: [
                { label: 'choice1-1', id: 'choice1-1' },
            ],
        },
        2: {
            extends: '3',
            text: '2',
            choices: [
                { label: 'choice2-1', id: 'choice2-1', visible: 'some var' },
                { label: 'choice2-2', id: 'choice2-2', },
            ],
        },
        3: {
            text: '3',
            choices: [
                { label: 'choice2-1', id: 'choice2-1', visible: 'some other var' },
                { label: 'choice2-2', id: 'choice2-2', visible: 'yet another var' },
            ],
        },
    },
});

export class ExtendCueFixture {
    @TestCase(
        extendCue(game1.cues['1'], game1)
    )
    public simpleExtendWithChoices(extendedCue: ICue) {
        Expect(extendedCue.text).toEqual('text');

        const choice = (extendedCue.choices && extendedCue.choices[0])!;
        Expect(choice.id).toEqual('0');
        Expect(choice.label).toEqual('000');

        const setter = choice.setter!;
        console.log(setter);
        Expect(setter.var1).toEqual('var1-override');
        Expect(setter.var2.$inc).toEqual(5);
    }

    @TestCase(
        extendCue(game2.cues['1'], game2)
    )
    public threeLevelExtend(extendedCue: ICue) {
        Expect(extendedCue.text).toEqual('3');

        const autoTransition = extendedCue.autoTransition!;
        Expect(autoTransition.delay).toEqual('1500h');
        Expect(autoTransition.id).toEqual('2');

        const setter = autoTransition.setter!;
        Expect(setter.var1).toEqual(42);
    }

    @TestCase(
        extendCue(game3.cues['1'], game3)
    )
    public choicesExtend(extendedCue: ICue) {
        const choices = extendedCue.choices!;
        const ch0 = choices[0];
        const ch1 = choices[1];

        Expect(ch0.visible).toEqual('some var');
        Expect(ch1.visible).toEqual('yet another var');
    }
}