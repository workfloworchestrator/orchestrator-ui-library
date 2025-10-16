import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiButton,
    EuiButtonIcon,
    EuiContextMenuPanel,
    EuiLoadingSpinner,
    EuiPanel,
    EuiPopover,
    EuiTitle,
} from '@elastic/eui';

import { WfoInSyncField } from '@/components';
import { WfoSubscriptionActionsMenuItem } from '@/components/WfoSubscription/WfoSubscriptionActions/WfoSubscriptionActionsMenuItem';
import { PolicyResource } from '@/configuration/policy-resources';
import { usePolicy } from '@/hooks';
import { WfoDotsHorizontal } from '@/icons/WfoDotsHorizontal';
import { useGetSubscriptionDetailQuery } from '@/rtk';
import { useGetSubscriptionActionsQuery } from '@/rtk/endpoints/subscriptionActions';
import { WorkflowTarget } from '@/types';

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

    const { data: subscriptionDetail } = useGetSubscriptionDetailQuery(
        {
            subscriptionId,
        },
        { skip: !isPopoverOpen && compactMode },
    );

    const { isAllowed } = usePolicy();

    const onButtonClick = () => setPopover(!isPopoverOpen);
    const closePopover = () => setPopover(false);

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
        SET_IN_SYNC,
    } = PolicyResource;
    const compactItems = (
        <>
            {isAllowed(SUBSCRIPTION_VALIDATE + subscriptionId) &&
                subscriptionActions?.validate && (
                    <>
                        {!compactMode && <MenuBlock title={t('tasks')} />}
                        {subscriptionActions.validate.map((action, index) => (
                            <WfoSubscriptionActionsMenuItem
                                key={`s_${index}`}
                                action={action}
                                index={index}
                                target={WorkflowTarget.VALIDATE}
                                isTask
                                subscriptionId={subscriptionId}
                                setPopover={setPopover}
                            />
                        ))}
                    </>
                )}

            {isAllowed(SUBSCRIPTION_RECONCILE + subscriptionId) &&
                (subscriptionActions?.reconcile?.length ?? 0) > 0 && (
                    <>
                        {!compactMode && <MenuBlock title={t('reconcile')} />}
                        {subscriptionActions?.reconcile.map((action, index) => (
                            <WfoSubscriptionActionsMenuItem
                                key={`r_${index}`}
                                action={action}
                                index={index}
                                target={WorkflowTarget.RECONCILE}
                                subscriptionId={subscriptionId}
                                setPopover={setPopover}
                            />
                        ))}
                    </>
                )}

            {isAllowed(SET_IN_SYNC) && compactMode && subscriptionDetail && (
                <div>
                    <WfoInSyncField
                        compactMode={true}
                        subscriptionDetail={subscriptionDetail?.subscription}
                        setPopover={setPopover}
                    />
                </div>
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
                            <WfoSubscriptionActionsMenuItem
                                key={`m_${index}`}
                                action={action}
                                index={index}
                                target={WorkflowTarget.MODIFY}
                                subscriptionId={subscriptionId}
                                setPopover={setPopover}
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
                            <WfoSubscriptionActionsMenuItem
                                key={`t_${index}`}
                                action={action}
                                index={index}
                                target={WorkflowTarget.TERMINATE}
                                subscriptionId={subscriptionId}
                                setPopover={setPopover}
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
