import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { EuiContextMenuItem, EuiLoadingSpinner, EuiToolTip } from '@elastic/eui';

import { flattenSubscriptionActionProps } from '@/components';
import { WfoSubscriptionActionExpandableMenuItem } from '@/components/WfoSubscription/WfoSubscriptionActions/WfoSubscriptionActionExpandableMenuItem';
import { getSubscriptionActionStyles } from '@/components/WfoSubscription/WfoSubscriptionActions/styles';
import { useCheckEngineStatus, useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoXCircleFill } from '@/icons';
import { SubscriptionAction, WorkflowTarget } from '@/types';

import { WfoTargetTypeIcon } from '../WfoTargetTypeIcon';

interface MenuItemProps {
  subscriptionAction: SubscriptionAction;
  target: WorkflowTarget;
  setPopover: (isOpen: boolean) => void;
  onClick: () => void;
  isLoading?: boolean;
}

export const WfoSubscriptionActionsMenuItem: FC<MenuItemProps> = ({
  subscriptionAction,
  onClick,
  target,
  setPopover,
  isLoading = false,
}) => {
  const { linkMenuItemStyle, tooltipMenuItemStyle, disabledIconStyle, iconStyle, secondaryIconStyle } =
    useWithOrchestratorTheme(getSubscriptionActionStyles);

  const { isEngineRunningNow } = useCheckEngineStatus();
  const t = useTranslations('subscriptions.detail.actions');
  const { theme } = useOrchestratorTheme();
  const subscriptionActionReason =
    subscriptionAction.reason ? subscriptionAction.reason
    : isLoading ? 'subscription.running_process'
    : undefined;

  const linkIt = (actionItem: React.ReactNode) => {
    const handleLinkClick = async (e: React.MouseEvent) => {
      e.preventDefault();
      setPopover(false);

      if (await isEngineRunningNow()) {
        onClick();
      }
    };

    return (
      <div css={linkMenuItemStyle} onClick={handleLinkClick}>
        {actionItem}
      </div>
    );
  };

  // TODO: remove UUID-only fallback when orchestrator-core 6.0.0 is released and only use the _detail variants
  const getRelationsList = () => {
    const detailRelations = [
      ...(subscriptionAction.locked_relations_detail ?? []),
      ...(subscriptionAction.unterminated_in_use_by_subscriptions_detail ?? []),
    ];
    if (detailRelations.length > 0) {
      return (
        <ul css={{ margin: 0, paddingLeft: 16, listStyleType: 'disc' }}>
          {detailRelations.map((r) => (
            <li key={r.subscription_id}>{r.subscription_description || r.subscription_id}</li>
          ))}
        </ul>
      );
    }
    const uuidRelations = [
      ...(subscriptionAction.locked_relations ?? []),
      ...(subscriptionAction.unterminated_in_use_by_subscriptions ?? []),
    ];
    if (uuidRelations.length === 0) return null;
    return (
      <ul css={{ margin: 0, paddingLeft: 16, listStyleType: 'disc' }}>
        {uuidRelations.map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
    );
  };

  const tooltipIt = (actionItem: React.ReactNode) => {
    if (!subscriptionActionReason) return actionItem;
    const relationsList = getRelationsList();
    const tooltipContent =
      relationsList ?
        <span css={{ whiteSpace: 'pre-line' }}>
          {t(subscriptionActionReason, flattenSubscriptionActionProps(subscriptionAction))}
          {relationsList}
        </span>
      : t(subscriptionActionReason, flattenSubscriptionActionProps(subscriptionAction));

    return (
      <div css={tooltipMenuItemStyle}>
        <EuiToolTip position="top" content={tooltipContent}>
          <WfoSubscriptionActionExpandableMenuItem
            subscriptionAction={subscriptionAction}
            onClickLockedRelation={() => setPopover(false)}
          >
            {actionItem}
          </WfoSubscriptionActionExpandableMenuItem>
        </EuiToolTip>
      </div>
    );
  };

  const getIcon = () => {
    if (isLoading) return <EuiLoadingSpinner size="m" />;
    return subscriptionActionReason ?
        <div css={disabledIconStyle}>
          <WfoTargetTypeIcon target={target} disabled />
          <div css={secondaryIconStyle}>
            <WfoXCircleFill width={20} height={20} color={theme.colors.danger} />
          </div>
        </div>
      : <div css={iconStyle}>
          <WfoTargetTypeIcon target={target} />
        </div>;
  };

  const ActionItem = () => (
    <EuiContextMenuItem
      icon={getIcon()}
      disabled={!!subscriptionActionReason}
      css={{
        whiteSpace: 'nowrap',
      }}
    >
      {subscriptionAction.description}
    </EuiContextMenuItem>
  );

  return subscriptionActionReason ? tooltipIt(<ActionItem />) : linkIt(<ActionItem />);
};
