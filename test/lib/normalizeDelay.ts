import { Expect, TestCase } from 'alsatian';
import { normalizeDelay } from '../../lib/normalizeDelay';

export class NormalizeDelayFixture {
    @TestCase(
        normalizeDelay({
            setter: {},
            id: 'any',
        })
    )
    public normalizeZeroDelay(delay: number) {
        Expect(delay).toEqual(0);
    }
}