import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
    EuiButton,
    EuiButtonIcon,
    EuiContextMenuItem,
    EuiContextMenuPanel,
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
    shortListOnly?: boolean; // NEW PROP
};

export const WfoSubscriptionActions: FC<WfoSubscriptionActionsProps> = ({
    subscriptionId,
    isLoading,
    shortListOnly = false, // defaults to full list
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
    const { data: subscriptionActions } = useGetSubscriptionActionsQuery(
        { subscriptionId },
        { skip: isLoading || !isPopoverOpen },
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

    const button = shortListOnly ? (
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
                    {/* FULL LIST MODE */}
                    {!shortListOnly && subscriptionActions && (
                        <>
                            {isAllowed(
                                PolicyResource.SUBSCRIPTION_MODIFY +
                                    subscriptionId,
                            ) &&
                                subscriptionActions.modify && (
                                    <>
                                        <MenuBlock title={t('modify')} />
                                        {subscriptionActions.modify.map(
                                            (action, index) => (
                                                <MenuItem
                                                    key={`m_${index}`}
                                                    action={action}
                                                    index={index}
                                                    target={
                                                        WorkflowTarget.MODIFY
                                                    }
                                                />
                                            ),
                                        )}
                                    </>
                                )}
                        </>
                    )}

                    {/* VALIDATE (Always included) */}
                    {subscriptionActions &&
                        isAllowed(
                            PolicyResource.SUBSCRIPTION_VALIDATE +
                                subscriptionId,
                        ) &&
                        subscriptionActions.validate && (
                            <>
                                <MenuBlock title={t('tasks')} />
                                {subscriptionActions.validate.map(
                                    (action, index) => (
                                        <MenuItem
                                            key={`s_${index}`}
                                            action={action}
                                            index={index}
                                            target={WorkflowTarget.VALIDATE}
                                            isTask
                                        />
                                    ),
                                )}
                            </>
                        )}

                    {/* RECONCILE (Always included) */}
                    {subscriptionActions &&
                    isAllowed(
                        PolicyResource.SUBSCRIPTION_RECONCILE + subscriptionId,
                    ) &&
                    subscriptionActions.reconcile.length > 0 ? (
                        <>
                            <MenuBlock title={t('reconcile')} />
                            {subscriptionActions.reconcile.map(
                                (action, index) => (
                                    <MenuItem
                                        key={`r_${index}`}
                                        action={action}
                                        index={index}
                                        target={WorkflowTarget.RECONCILE}
                                    />
                                ),
                            )}
                        </>
                    ) : (
                        <>
                            <MenuBlock title={t('reconcile')} />
                            <MenuItem
                                key={`r_0`}
                                action={{
                                    name: t('reconcile'),
                                    reason: 'notAvailableForWorkflow',
                                    description: t('reconcile'),
                                }}
                                index={0}
                                target={WorkflowTarget.RECONCILE}
                            />
                        </>
                    )}

                    {/* FULL LIST MODE */}
                    {!shortListOnly && subscriptionActions && (
                        <>
                            {isAllowed(
                                PolicyResource.SUBSCRIPTION_TERMINATE +
                                    subscriptionId,
                            ) &&
                                subscriptionActions.terminate && (
                                    <>
                                        <MenuBlock title={t('terminate')} />
                                        {subscriptionActions.terminate.map(
                                            (action, index) => (
                                                <MenuItem
                                                    key={`t_${index}`}
                                                    action={action}
                                                    index={index}
                                                    target={
                                                        WorkflowTarget.TERMINATE
                                                    }
                                                />
                                            ),
                                        )}
                                    </>
                                )}
                        </>
                    )}
                </EuiPanel>
            </EuiContextMenuPanel>
        </EuiPopover>
    );
};
