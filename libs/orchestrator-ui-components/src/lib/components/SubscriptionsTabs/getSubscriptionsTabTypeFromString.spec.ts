import { getSubscriptionsTabTypeFromString } from './getSubscriptionsTabTypeFromString';
import { SubscriptionsTabType } from './SubscriptionsTabs';

describe('getSubscriptionsTabTypeFromString', () => {
    it('returns ACTIVE', () => {
        const result = getSubscriptionsTabTypeFromString(
            SubscriptionsTabType.ACTIVE,
        );
        expect(result).toEqual(SubscriptionsTabType.ACTIVE);
    });

    it('returns TERMINATED', () => {
        const result = getSubscriptionsTabTypeFromString(
            SubscriptionsTabType.TERMINATED,
        );
        expect(result).toEqual(SubscriptionsTabType.TERMINATED);
    });

    it('returns TRANSIENT', () => {
        const result = getSubscriptionsTabTypeFromString(
            SubscriptionsTabType.TRANSIENT,
        );
        expect(result).toEqual(SubscriptionsTabType.TRANSIENT);
    });

    it('returns ALL', () => {
        const result = getSubscriptionsTabTypeFromString(
            SubscriptionsTabType.ALL,
        );
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
