import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
    EuiButton,
    EuiButtonIcon,
    EuiContextMenuItem,
    EuiContextMenuPanel,
    EuiLoadingSpinner,
    EuiPanel,
    EuiPopover,
    EuiTitle,
    EuiToolTip,
} from '@elastic/eui';

import { PATH_START_NEW_TASK, PATH_START_NEW_WORKFLOW } from '@/components';
import { PolicyResource } from '@/configuration/policy-resources';
import {
    useCheckEngineStatus,
    useOrchestratorTheme,
    usePolicy,
    useWithOrchestratorTheme,
} from '@/hooks';
import { WfoXCircleFill } from '@/icons';
import { WfoDotsHorizontal } from '@/icons/WfoDotsHorizontal';
import { useGetSubscriptionActionsQuery } from '@/rtk/endpoints/subscriptionActions';
import { SubscriptionAction, WorkflowTarget } from '@/types';

import { WfoTargetTypeIcon } from '../WfoTargetTypeIcon';
import { flattenArrayProps } from '../utils';
import { WfoSubscriptionActionExpandableMenuItem } from './WfoSubscriptionActionExpandableMenuItem';
import { getSubscriptionActionStyles } from './styles';

type MenuItemProps = {
    key: string;
    action: SubscriptionAction;
    index: number;
    target: WorkflowTarget;
    isTask?: boolean;
    isDisabled?: boolean;
};

type MenuBlockProps = {
    title: string;
};
const MenuBlock: FC<MenuBlockProps> = ({ title }) => (
    <EuiTitle size="xxxs">
        <h3>{title}</h3>
    </EuiTitle>
);

export type WfoSubscriptionActionsProps = {
    subscriptionId: string;
    isLoading?: boolean;
    compactMode?: boolean;
};

export const WfoSubscriptionActions: FC<WfoSubscriptionActionsProps> = ({
    subscriptionId,
    isLoading,
    compactMode = false,
}) => {
    const { theme } = useOrchestratorTheme();
    const {
        linkMenuItemStyle,
        tooltipMenuItemStyle,
        disabledIconStyle,
        iconStyle,
        secondaryIconStyle,
    } = useWithOrchestratorTheme(getSubscriptionActionStyles);

    const router = useRouter();
    const t = useTranslations('subscriptions.detail.actions');
    const [isPopoverOpen, setPopover] = useState(false);
    const disableQuery = isLoading || (!isPopoverOpen && compactMode);
    const {
        data: subscriptionActions,
        isLoading: subscriptionActionsIsLoading,
    } = useGetSubscriptionActionsQuery(
        { subscriptionId },
        { skip: disableQuery },
    );
    const { isEngineRunningNow } = useCheckEngineStatus();
    const { isAllowed } = usePolicy();

    const onButtonClick = () => setPopover(!isPopoverOpen);
    const closePopover = () => setPopover(false);

    const MenuItem: FC<MenuItemProps> = ({
        action,
        target,
        isTask = false,
    }) => {
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
            <EuiContextMenuItem icon={getIcon()} disabled={!!action.reason}>
                {action.description}
            </EuiContextMenuItem>
        );

        return action?.reason
            ? tooltipIt(<ActionItem />)
            : linkIt(<ActionItem />);
    };

    const button = compactMode ? (
        <EuiButtonIcon
            iconType={() => <WfoDotsHorizontal />}
            onClick={onButtonClick}
            aria-label="Row context menu"
            isLoading={isLoading}
        />
    ) : (
        <EuiButton
            iconType="arrowDown"
            iconSide="right"
            onClick={onButtonClick}
            isLoading={isLoading}
        >
            {t('actions')}
        </EuiButton>
    );

    const {
        SUBSCRIPTION_VALIDATE,
        SUBSCRIPTION_RECONCILE,
        SUBSCRIPTION_MODIFY,
        SUBSCRIPTION_TERMINATE,
    } = PolicyResource;
    const compactItems = (
        <>
            {isAllowed(SUBSCRIPTION_VALIDATE + subscriptionId) &&
                subscriptionActions?.validate && (
                    <>
                        {!compactMode && <MenuBlock title={t('tasks')} />}
                        {subscriptionActions.validate.map((action, index) => (
                            <MenuItem
                                key={`s_${index}`}
                                action={action}
                                index={index}
                                target={WorkflowTarget.VALIDATE}
                                isTask
                            />
                        ))}
                    </>
                )}

            {isAllowed(SUBSCRIPTION_RECONCILE + subscriptionId) &&
                (subscriptionActions?.reconcile?.length ?? 0) > 0 && (
                    <>
                        {!compactMode && <MenuBlock title={t('reconcile')} />}
                        {subscriptionActions?.reconcile.map((action, index) => (
                            <MenuItem
                                key={`r_${index}`}
                                action={action}
                                index={index}
                                target={WorkflowTarget.RECONCILE}
                            />
                        ))}
                    </>
                )}
        </>
    );

    const fullItems = (
        <>
            {isAllowed(SUBSCRIPTION_MODIFY + subscriptionId) &&
                subscriptionActions?.modify && (
                    <>
                        <MenuBlock title={t('modify')} />
                        {subscriptionActions.modify.map((action, index) => (
                            <MenuItem
                                key={`m_${index}`}
                                action={action}
                                index={index}
                                target={WorkflowTarget.MODIFY}
                            />
                        ))}
                    </>
                )}
            {compactItems}
            {isAllowed(SUBSCRIPTION_TERMINATE + subscriptionId) &&
                subscriptionActions?.terminate && (
                    <>
                        <MenuBlock title={t('terminate')} />
                        {subscriptionActions.terminate.map((action, index) => (
                            <MenuItem
                                key={`t_${index}`}
                                action={action}
                                index={index}
                                target={WorkflowTarget.TERMINATE}
                            />
                        ))}
                    </>
                )}
        </>
    );

    const MenuItemsList = () => (compactMode ? compactItems : fullItems);

    return (
        <EuiPopover
            id="subscriptionActionPopover"
            button={button}
            isOpen={isPopoverOpen}
            closePopover={closePopover}
            panelPaddingSize="none"
            anchorPosition="downLeft"
        >
            <EuiContextMenuPanel>
                <EuiPanel color="transparent" paddingSize="s">
                    {subscriptionActionsIsLoading ? (
                        <EuiLoadingSpinner />
                    ) : (
                        <MenuItemsList />
                    )}
                </EuiPanel>
            </EuiContextMenuPanel>
        </EuiPopover>
    );
};
