import React, { FC } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { EuiContextMenuItem, EuiToolTip } from '@elastic/eui';
import { css } from '@emotion/react';

import { flattenArrayProps } from '@/components';
import {
    PATH_START_NEW_TASK,
    PATH_START_NEW_WORKFLOW,
} from '@/components/WfoPageTemplate';
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
    key: string;
    action: SubscriptionAction;
    index: number;
    target: WorkflowTarget;
    isTask?: boolean;
    isDisabled?: boolean;
    subscriptionId: string;
    setPopover: (isOpen: boolean) => void;
}

export const WfoSubscriptionActionsMenuItem: FC<MenuItemProps> = ({
    action,
    target,
    isTask = false,
    subscriptionId,
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
    const router = useRouter();
    const t = useTranslations('subscriptions.detail.actions');
    const { theme } = useOrchestratorTheme();

    const linkIt = (actionItem: React.ReactNode) => {
        const path = isTask ? PATH_START_NEW_TASK : PATH_START_NEW_WORKFLOW;
        const url = {
            pathname: `${path}/${action.name}`,
            query: { subscriptionId },
        };

        const handleLinkClick = async (e: React.MouseEvent) => {
            e.preventDefault();
            setPopover(false);
            if (await isEngineRunningNow()) {
                router.push(url);
            }
        };

        return (
            <Link href={url} onClick={handleLinkClick}>
                <div css={linkMenuItemStyle}>{actionItem}</div>
            </Link>
        );
    };

    const tooltipIt = (actionItem: React.ReactNode) => {
        if (!action.reason) return actionItem;
        const tooltipContent = t(action.reason, flattenArrayProps(action));

        return (
            <div css={tooltipMenuItemStyle}>
                <EuiToolTip position="top" content={tooltipContent}>
                    <WfoSubscriptionActionExpandableMenuItem
                        subscriptionAction={action}
                        onClickLockedRelation={() => setPopover(false)}
                    >
                        {actionItem}
                    </WfoSubscriptionActionExpandableMenuItem>
                </EuiToolTip>
            </div>
        );
    };

    const getIcon = () =>
        action.reason ? (
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
            disabled={!!action.reason}
            css={{
                whiteSpace: 'nowrap',
            }}
        >
            {action.description}
        </EuiContextMenuItem>
    );

    return action?.reason ? tooltipIt(<ActionItem />) : linkIt(<ActionItem />);
};
