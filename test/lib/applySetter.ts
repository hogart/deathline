import { Expect, TestCase } from 'alsatian';
import { createTestUser } from '../testUser';
import { applySetter } from '../../lib/applySetter';
import { TState } from '../../lib/deathline';

export class ApplySetterFixture {
    @TestCase(
        applySetter(createTestUser())
    )
    public applyEmptySetter(state: TState) {
        Expect(state).toBeEmpty();
    }

    @TestCase(
        applySetter(
            createTestUser({
                state: {
                    varInc: 7,
                    varDec: 10,
                    varMul: 2,
                    varDiv: 100,
                    varPow: 2,
                },
            }),
            {
                varInc: { $inc: 3 },
                varDec: { $dec: 5 },
                varMul: { $mul: 2 },
                varDiv: { $div: 10 },
                varPow: { $pow: 10 },
            }
        )
    )
    public applyMathSetters(state: TState) {
        Expect(state.varInc).toEqual(10);
        Expect(state.varDec).toEqual(5);
        Expect(state.varMul).toEqual(4);
        Expect(state.varDiv).toEqual(10);
        Expect(state.varPow).toEqual(1024);
    }

    @TestCase(
        applySetter(
            createTestUser({
                state: {
                    varPrepend: 'var',
                    varAppend: 'var',
                },
            }),
            {
                varPrepend: { $prepend: 'prepend-' },
                varAppend: { $append: '-append' },
            }
        )
    )
    public applyStringSetters(state: TState) {
        Expect(state.varPrepend).toEqual('prepend-var');
        Expect(state.varAppend).toEqual('var-append');
    }

    @TestCase(
        applySetter(
            createTestUser({
                state: {
                    varTrue: false,
                    varFalse: true,
                },
            }),
            {
                varTrue: { $neg: 42 },
                varFalse: { $neg: 42 },
            }
        )
    )
    public applyBooleanSetters(state: TState) {
        Expect(state.varTrue).toEqual(true);
        Expect(state.varFalse).toEqual(false);
    }

    @TestCase(
        applySetter(
            createTestUser({
                state: {
                    var$set: 'var1',
                    varDirect: 'var2',
                },
            }),
            {
                var$set: { $set: 42 },
                varDirect: 100500,
            }
        )
    )
    public applySetSetters(state: TState) {
        Expect(state.var$set).toEqual(42);
        Expect(state.varDirect).toEqual(100500);
    }
}