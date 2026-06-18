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
};

export const WfoSubscriptionActionExpandableMenuItem: FC<WfoSubscriptionActionExpandableMenuItemProps> = ({
  subscriptionAction,
  onClickLockedRelation,
  children,
}) => {
  const t = useTranslations('subscriptions.detail.actions');

  const { clickableStyle, expandableMenuItemStyle, expandButtonStyle, expandedContentStyle, linkStyle } =
    useWithOrchestratorTheme(getSubscriptionActionStyles);
  const [isExpanded, setIsExpanded] = useState(false);

  // TODO: remove lockedRelationsUuids fallback when orchestrator-core 6.0.0 is released and only use the _detail variant
  const lockedRelationsDetail = subscriptionAction.locked_relations_detail;
  const lockedRelationsUuids = subscriptionAction.locked_relations;
  const hasLockedRelations = (lockedRelationsDetail?.length ?? 0) > 0 || (lockedRelationsUuids?.length ?? 0) > 0;

  return (
    <div>
      <div
        css={[expandableMenuItemStyle, hasLockedRelations && clickableStyle]}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>{children}</div>
        {hasLockedRelations && (
          <EuiButtonIcon
            css={expandButtonStyle}
            iconType={isExpanded ? 'arrowDown' : 'arrowRight'}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={t('expand')}
          />
        )}
      </div>
      {hasLockedRelations && isExpanded && (
        <div css={expandedContentStyle}>
          <EuiText size="xs">{t('lockedBySubscriptions')}</EuiText>
          <ul css={{ margin: 0, paddingLeft: 16, listStyleType: 'disc' }}>
            {lockedRelationsDetail ?
              lockedRelationsDetail.map((relation) => (
                <li key={relation.subscription_id}>
                  <EuiText size="xs">
                    <Link
                      css={linkStyle}
                      href={`${PATH_SUBSCRIPTIONS}/${relation.subscription_id}`}
                      target="_blank"
                      onClick={() => onClickLockedRelation(relation)}
                    >
                      {relation.subscription_description}
                    </Link>
                  </EuiText>
                </li>
              ))
            : lockedRelationsUuids?.map((id) => (
                <li key={id}>
                  <EuiText size="xs">
                    <Link css={linkStyle} href={`${PATH_SUBSCRIPTIONS}/${id}`} target="_blank">
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
