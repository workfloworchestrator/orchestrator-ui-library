import React from 'react';
import { useTranslations } from 'next-intl';

import { SubscriptionDetail } from '../../types';
import { WFONoResults } from '../WFONoResults';

import { WFOSearchStrikethrough } from '../../icons';
import { useOrchestratorTheme } from '../../hooks';

interface WFORelatedSubscriptionsProps {
    subscriptionDetail: SubscriptionDetail;
}

export const WFORelatedSubscriptions = ({
    subscriptionDetail,
}: WFORelatedSubscriptionsProps) => {
  const t = useTranslations('subscriptions.detail')
  const { theme } = useOrchestratorTheme()

  const relatedSubscriptions =
        subscriptionDetail &&
        subscriptionDetail.inUseBySubscriptions &&
        subscriptionDetail.inUseBySubscriptions.page;

    return (
        (relatedSubscriptions && relatedSubscriptions.length > 0 && (
            <div>Yes</div>
        )) || (
          <WFONoResults 
            text={t('noRelatedSubscriptions')}
            icon={<WFOSearchStrikethrough color={theme.colors.link} />}
          />
        )
    );
};
