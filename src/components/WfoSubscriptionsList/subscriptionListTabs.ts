import { WfoFilterTab } from '../../components';

export enum WfoSubscriptionListTab {
  ACTIVE = 'ACTIVE',
  TERMINATED = 'TERMINATED',
  TRANSIENT = 'TRANSIENT',
  ALL = 'ALL',
}

export const subscriptionListTabs: WfoFilterTab<WfoSubscriptionListTab>[] = [
  {
    id: WfoSubscriptionListTab.ACTIVE,
    translationKey: 'active',
  },
  {
    id: WfoSubscriptionListTab.TERMINATED,
    translationKey: 'terminated',
  },
  {
    id: WfoSubscriptionListTab.TRANSIENT,
    translationKey: 'transient',
  },
  {
    id: WfoSubscriptionListTab.ALL,
    translationKey: 'all',
  },
];
