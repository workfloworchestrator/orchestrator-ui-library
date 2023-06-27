import { getSubscriptionsTabTypeFromString } from './getSubscriptionsTabTypeFromString';
import { SubscriptionsTabType } from './SubscriptionsTabs';

describe('getSubscriptionsTabTypeFromString', () => {
    it('returns SubscriptionsTabType.ACTIVE', () => {
        const result = getSubscriptionsTabTypeFromString('ACTIVE');
        expect(result).toEqual(SubscriptionsTabType.ACTIVE);
    });

    it('returns SubscriptionsTabType.TERMINATED', () => {
        const result = getSubscriptionsTabTypeFromString('TERMINATED');
        expect(result).toEqual(SubscriptionsTabType.TERMINATED);
    });

    it('returns SubscriptionsTabType.TRANSIENT', () => {
        const result = getSubscriptionsTabTypeFromString('TRANSIENT');
        expect(result).toEqual(SubscriptionsTabType.TRANSIENT);
    });

    it('returns SubscriptionsTabType.ALL', () => {
        const result = getSubscriptionsTabTypeFromString('ALL');
        expect(result).toEqual(SubscriptionsTabType.ALL);
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
