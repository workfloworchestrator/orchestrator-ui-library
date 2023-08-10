import { getSubscriptionsTabTypeFromString } from './getSubscriptionsTabTypeFromString';
import { WFOSubscriptionsTabType } from '../../pages';

describe('getSubscriptionsTabTypeFromString', () => {
    it('returns SubscriptionsTabType.ACTIVE', () => {
        const result = getSubscriptionsTabTypeFromString('ACTIVE');
        expect(result).toEqual(WFOSubscriptionsTabType.ACTIVE);
    });

    it('returns SubscriptionsTabType.TERMINATED', () => {
        const result = getSubscriptionsTabTypeFromString('TERMINATED');
        expect(result).toEqual(WFOSubscriptionsTabType.TERMINATED);
    });

    it('returns SubscriptionsTabType.TRANSIENT', () => {
        const result = getSubscriptionsTabTypeFromString('TRANSIENT');
        expect(result).toEqual(WFOSubscriptionsTabType.TRANSIENT);
    });

    it('returns SubscriptionsTabType.ALL', () => {
        const result = getSubscriptionsTabTypeFromString('ALL');
        expect(result).toEqual(WFOSubscriptionsTabType.ALL);
    });

    it('returns undefined when no tabId is provided', () => {
        const result = getSubscriptionsTabTypeFromString(undefined);
        expect(result).toEqual(undefined);
    });

    it('returns undefined when no match is found', () => {
        const result = getSubscriptionsTabTypeFromString('thisTabDoesNotExist');
        expect(result).toEqual(undefined);
    });
});
