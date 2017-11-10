import { Expect, TestCase } from 'alsatian';
import { runSafeExpression } from '../../lib/safeExpression';

export class SafeExpressionFixture {
    @TestCase(
        runSafeExpression('state.var1 && state.var2', {
            var1: true,
            var2: false,
        })
    )
    public runSimpleExpression(result: boolean) {
        Expect(result).toBe(false);
    }

    @TestCase('require("fs")')
    @TestCase(`eval("console.log('eval is evil')")`)
    @TestCase(`new Function("console.log('hacked!')")`)
    @TestCase(`Function("console.log('hacked!')")`)
    @TestCase(`setTimeout("console.log('hacked!')")`)
    @TestCase(`setInterval("console.log('hacked!')")`)
    public checkForbiddenFunctions(expr: string) {
        try {
            runSafeExpression(expr, {});
        } catch (caughtError) {
            Expect(<string>caughtError.message).toContain('Possible security violation');
        }
    }

    @TestCase('console.log(global.process)')
    @TestCase('console.log(process.argv)')
    public checkGlobalSanitized(expr: string) {
        Expect(() => runSafeExpression(expr, {})).toThrow();
    }
}