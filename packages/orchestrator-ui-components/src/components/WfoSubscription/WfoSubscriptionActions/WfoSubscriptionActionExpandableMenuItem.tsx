import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiButtonIcon, EuiText } from '@elastic/eui';

import { PATH_SUBSCRIPTIONS } from '@/components';
import { useWithOrchestratorTheme } from '@/hooks';
import { SubscriptionAction, SubscriptionRelation } from '@/types';

import { getSubscriptionActionStyles } from './styles';

export type WfoSubscriptionActionExpandableMenuItemProps = {
  subscriptionAction: SubscriptionAction;
  onClickLockedRelation: (relation: SubscriptionRelation) => void;
  children: React.ReactNode;
  subscriptionPath?: string;
};

export const WfoSubscriptionActionExpandableMenuItem: FC<WfoSubscriptionActionExpandableMenuItemProps> = ({
  subscriptionAction,
  onClickLockedRelation,
  children,
  subscriptionPath = PATH_SUBSCRIPTIONS,
}) => {
  const t = useTranslations('subscriptions.detail.actions');

  const { clickableStyle, expandableMenuItemStyle, expandButtonStyle, expandedContentStyle, linkStyle } =
    useWithOrchestratorTheme(getSubscriptionActionStyles);
  const [isExpanded, setIsExpanded] = useState(false);

  // TODO: remove lockedRelationsUuids fallback when orchestrator-core 6.0.0 is released and only use the _detail variant
  const relationsDetail = [
    ...(subscriptionAction.locked_relations_detail ?? []),
    ...(subscriptionAction.unterminated_in_use_by_subscriptions_detail ?? []),
  ];
  const relationsUuids = [
    ...(subscriptionAction.locked_relations ?? []),
    ...(subscriptionAction.unterminated_in_use_by_subscriptions ?? []),
  ];
  const hasRelations = relationsDetail.length > 0 || relationsUuids.length > 0;

  return (
    <div>
      <div css={[expandableMenuItemStyle, hasRelations && clickableStyle]} onClick={() => setIsExpanded(!isExpanded)}>
        <div>{children}</div>
        {hasRelations && (
          <EuiButtonIcon
            css={expandButtonStyle}
            iconType={isExpanded ? 'arrowDown' : 'arrowRight'}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={t('expand')}
          />
        )}
      </div>
      {hasRelations && isExpanded && (
        <div css={expandedContentStyle}>
          <EuiText size="xs">{t('lockedBySubscriptions')}</EuiText>
          <ul css={{ margin: 0, paddingLeft: 16, listStyleType: 'disc' }}>
            {relationsDetail.length > 0 ?
              relationsDetail.map((relation) => (
                <li key={relation.subscription_id}>
                  <EuiText size="xs">
                    <Link
                      css={linkStyle}
                      href={`${subscriptionPath}/${relation.subscription_id}`}
                      target="_blank"
                      onClick={() => onClickLockedRelation(relation)}
                    >
                      {relation.subscription_description}
                    </Link>
                  </EuiText>
                </li>
              ))
            : relationsUuids.map((id) => (
                <li key={id}>
                  <EuiText size="xs">
                    <Link css={linkStyle} href={`${subscriptionPath}/${id}`} target="_blank">
                      {id}
                    </Link>
                  </EuiText>
                </li>
              ))
            }
          </ul>
        </div>
      )}
    </div>
  );
};
