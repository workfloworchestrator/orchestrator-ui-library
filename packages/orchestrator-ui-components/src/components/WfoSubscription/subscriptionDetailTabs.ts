import { WfoFilterTab } from '../WfoFilterTabs';
import { WfoSubscriptionDetailTab } from './utils';

export const subscriptionDetailTabs: WfoFilterTab<WfoSubscriptionDetailTab>[] =
    [
        {
            id: WfoSubscriptionDetailTab.GENERAL_TAB,
            translationKey: 'general',
        },
        {
            id: WfoSubscriptionDetailTab.SERVICE_CONFIGURATION_TAB,
            translationKey: 'serviceConfiguration',
        },
        {
            id: WfoSubscriptionDetailTab.PROCESSES_TAB,
            translationKey: 'workflows',
        },
        {
            id: WfoSubscriptionDetailTab.RELATED_SUBSCRIPTIONS_TAB,
            translationKey: 'relatedSubscriptions',
        },
    ];
/*
  -        prepend: <EuiIcon type="devToolsApp" />,
  -        prepend: <EuiIcon type="submodule" />,
  -        prepend: <EuiIcon type="indexRuntime" />,
  -        prepend: <EuiIcon type="heatmap" />,
*/
