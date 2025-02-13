import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
    EuiButton,
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
};

export const WfoSubscriptionActions: FC<WfoSubscriptionActionsProps> = ({
    subscriptionId,
    isLoading,
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
        {
            subscriptionId,
        },
        { skip: isLoading },
    );
    const { isEngineRunningNow } = useCheckEngineStatus();
    const { isAllowed } = usePolicy();

    const onButtonClick = () => {
        setPopover(!isPopoverOpen);
    };

    const closePopover = () => {
        setPopover(false);
    };

    const MenuItem: FC<MenuItemProps> = ({
        action,
        target,
        isTask = false,
    }) => {
        // Change icon to include x if there's a reason
        // Add tooltip with reason
        const linkIt = (actionItem: React.ReactNode) => {
            const path = isTask ? PATH_START_NEW_TASK : PATH_START_NEW_WORKFLOW;
            const url = {
                pathname: `${path}/${action.name}`,
                query: { subscriptionId: subscriptionId },
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
            /**
              Whether an action is disabled is indicated by it having a reason property.
              The value of the reason property is as a translation key that should
              be part of the local translations under subscription.details.workflow.disableReasons
              Some of these reasons may contain dynamic values. The values are passed as extra keys next to
              the reason key. The complete reason object is passed to the translate function to make this work.
              An extra variable passed in might be of type array, before passing it in arrays are flattened to ,
              concatenated strings.

              Example action item response for an action that is disabled
              const reason = {
                name: "...",
                description: "...",
                reason: "random_reason_translation_key" =>
                  this maps to a key in subscription.details.workflow.disableReasons containing
                  ".... {randomVar1} .... {randomVar2}  "
                randomVar: [
                  "array value 1",
                  "array value 2"
                ],
                randomVar2: "flat string"

              }

              // Translation function invocation
              t('randonReason', reason)
            */
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

        const getIcon = () => {
            return action.reason ? (
                <div css={disabledIconStyle}>
                    <WfoTargetTypeIcon target={target} disabled={true} />
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
        };

        const ActionItem = () => (
            <EuiContextMenuItem icon={getIcon()} disabled={!!action.reason}>
                {action.description}
            </EuiContextMenuItem>
        );

        return action?.reason
            ? tooltipIt(<ActionItem />)
            : linkIt(<ActionItem />);
    };

    const button = (
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
                    {subscriptionActions &&
                        isAllowed(
                            PolicyResource.SUBSCRIPTION_MODIFY + subscriptionId,
                        ) &&
                        subscriptionActions.modify && (
                            <>
                                <MenuBlock title={t('modify')}></MenuBlock>
                                {subscriptionActions.modify.map(
                                    (action, index) => (
                                        <MenuItem
                                            key={`m_${index}`}
                                            action={action}
                                            index={index}
                                            target={WorkflowTarget.MODIFY}
                                        />
                                    ),
                                )}
                            </>
                        )}

                    {subscriptionActions &&
                        isAllowed(
                            PolicyResource.SUBSCRIPTION_VALIDATE +
                                subscriptionId,
                        ) &&
                        subscriptionActions.system && (
                            <>
                                <MenuBlock title={t('tasks')}></MenuBlock>
                                {subscriptionActions.system.map(
                                    (action, index) => (
                                        <MenuItem
                                            key={`s_${index}`}
                                            action={action}
                                            index={index}
                                            target={WorkflowTarget.SYSTEM}
                                            isTask={true}
                                        />
                                    ),
                                )}
                            </>
                        )}

                    {subscriptionActions &&
                        isAllowed(
                            PolicyResource.SUBSCRIPTION_TERMINATE +
                                subscriptionId,
                        ) &&
                        subscriptionActions.terminate && (
                            <>
                                <MenuBlock title={t('terminate')}></MenuBlock>
                                {subscriptionActions.terminate.map(
                                    (action, index) => (
                                        <MenuItem
                                            key={`t_${index}`}
                                            action={action}
                                            index={index}
                                            target={WorkflowTarget.TERMINATE}
                                        />
                                    ),
                                )}
                            </>
                        )}
                </EuiPanel>
            </EuiContextMenuPanel>
        </EuiPopover>
    );
};
