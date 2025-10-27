import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { EuiContextMenuItem, EuiToolTip } from '@elastic/eui';

import { flattenArrayProps } from '@/components';
import { WfoSubscriptionActionExpandableMenuItem } from '@/components/WfoSubscription/WfoSubscriptionActions/WfoSubscriptionActionExpandableMenuItem';
import { getSubscriptionActionStyles } from '@/components/WfoSubscription/WfoSubscriptionActions/styles';
import {
    useCheckEngineStatus,
    useOrchestratorTheme,
    useWithOrchestratorTheme,
} from '@/hooks';
import { WfoXCircleFill } from '@/icons';
import { SubscriptionAction, WorkflowTarget } from '@/types';

import { WfoTargetTypeIcon } from '../WfoTargetTypeIcon';

interface MenuItemProps {
    subscriptionAction: SubscriptionAction;
    target: WorkflowTarget;
    setPopover: (isOpen: boolean) => void;
    onClick: () => void;
}

export const WfoSubscriptionActionsMenuItem: FC<MenuItemProps> = ({
    subscriptionAction,
    onClick,
    target,
    setPopover,
}) => {
    const {
        linkMenuItemStyle,
        tooltipMenuItemStyle,
        disabledIconStyle,
        iconStyle,
        secondaryIconStyle,
    } = useWithOrchestratorTheme(getSubscriptionActionStyles);

    const { isEngineRunningNow } = useCheckEngineStatus();
    const t = useTranslations('subscriptions.detail.actions');
    const { theme } = useOrchestratorTheme();

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
        if (!subscriptionAction.reason) return actionItem;
        const tooltipContent = t(
            subscriptionAction.reason,
            flattenArrayProps(subscriptionAction),
        );

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

    const getIcon = () =>
        subscriptionAction.reason ? (
            <div css={disabledIconStyle}>
                <WfoTargetTypeIcon target={target} disabled />
                <div css={secondaryIconStyle}>
                    <WfoXCircleFill
                        width={20}
                        height={20}
                        color={theme.colors.danger}
                    />
                </div>
            </div>
        ) : (
            <div css={iconStyle}>
                <WfoTargetTypeIcon target={target} />
            </div>
        );

    const ActionItem = () => (
        <EuiContextMenuItem
            icon={getIcon()}
            disabled={!!subscriptionAction.reason}
            css={{
                whiteSpace: 'nowrap',
            }}
        >
            {subscriptionAction.description}
        </EuiContextMenuItem>
    );

    return subscriptionAction?.reason
        ? tooltipIt(<ActionItem />)
        : linkIt(<ActionItem />);
};
