import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { EuiContextMenuItem, EuiLoadingSpinner, EuiToolTip } from '@elastic/eui';

import { flattenArrayProps } from '@/components';
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

  const tooltipIt = (actionItem: React.ReactNode) => {
    if (!subscriptionActionReason) return actionItem;
    const tooltipContent = t(subscriptionActionReason, flattenArrayProps(subscriptionAction));

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
