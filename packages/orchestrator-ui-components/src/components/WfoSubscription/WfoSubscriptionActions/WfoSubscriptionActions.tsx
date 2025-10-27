import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
    EuiButton,
    EuiButtonIcon,
    EuiContextMenuPanel,
    EuiLoadingSpinner,
    EuiPanel,
    EuiPopover,
    EuiTitle,
} from '@elastic/eui';

import {
    PATH_START_NEW_TASK,
    PATH_START_NEW_WORKFLOW,
    PATH_TASKS,
    PATH_WORKFLOWS,
    WfoInSyncField,
} from '@/components';
import { WfoSubscriptionActionsMenuItem } from '@/components/WfoSubscription/WfoSubscriptionActions/WfoSubscriptionActionsMenuItem';
import { PolicyResource } from '@/configuration/policy-resources';
import { usePolicy, useShowToastMessage } from '@/hooks';
import { WfoDotsHorizontal } from '@/icons/WfoDotsHorizontal';
import {
    useGetSubscriptionActionsQuery,
    useGetSubscriptionDetailQuery,
    useStartProcessMutation,
} from '@/rtk';
import { ToastTypes, WorkflowTarget } from '@/types';

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
    const router = useRouter();
    const disableQuery = isLoading || (!isPopoverOpen && compactMode);
    const {
        data: subscriptionActions,
        isLoading: subscriptionActionsIsLoading,
    } = useGetSubscriptionActionsQuery(
        { subscriptionId },
        { skip: disableQuery },
    );
    const { showToastMessage } = useShowToastMessage();
    const [startProcess] = useStartProcessMutation();

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

    const redirectToUrl = (workflowName: string, isTask: boolean = false) => {
        const path = isTask ? PATH_START_NEW_TASK : PATH_START_NEW_WORKFLOW;

        const url = {
            pathname: `${path}/${workflowName}`,
            query: {
                subscriptionId,
            },
        };
        router.push(url);
    };

    const silentlyStartAction = (
        workflowName: string,
        isTask: boolean = false,
    ) => {
        startProcess({
            workflowName,
            userInputs: [
                {
                    subscription_id: subscriptionId,
                },
            ],
        })
            .unwrap()
            .then((result) => {
                closePopover();
                const processUrl = `${isTask ? PATH_TASKS : PATH_WORKFLOWS}/${result.id}`;

                showToastMessage(
                    ToastTypes.SUCCESS,
                    <Link href={processUrl}>{processUrl}</Link>,
                    t('actionStarted'),
                );
            })
            .catch((error) => {
                showToastMessage(
                    ToastTypes.ERROR,
                    t('actionStartFailed'),
                    t('actionStartFailed'),
                );
                console.error('Failed to set subscription in sync.', error);
            });
    };

    const compactItems = (
        <>
            {isAllowed(SUBSCRIPTION_VALIDATE + subscriptionId) &&
                subscriptionActions?.validate && (
                    <>
                        {!compactMode && <MenuBlock title={t('tasks')} />}
                        {subscriptionActions.validate.map(
                            (subscriptionAction, index) => (
                                <WfoSubscriptionActionsMenuItem
                                    key={`s_${index}`}
                                    subscriptionAction={subscriptionAction}
                                    target={WorkflowTarget.VALIDATE}
                                    setPopover={setPopover}
                                    onClick={() => {
                                        if (compactMode) {
                                            silentlyStartAction(
                                                subscriptionAction.name,
                                                true,
                                            );
                                        } else {
                                            redirectToUrl(
                                                subscriptionAction.name,
                                                true,
                                            );
                                        }
                                    }}
                                />
                            ),
                        )}
                    </>
                )}

            {isAllowed(SUBSCRIPTION_RECONCILE + subscriptionId) &&
                (subscriptionActions?.reconcile?.length ?? 0) > 0 && (
                    <>
                        {!compactMode && <MenuBlock title={t('reconcile')} />}
                        {subscriptionActions?.reconcile.map(
                            (subscriptionAction, index) => (
                                <WfoSubscriptionActionsMenuItem
                                    key={`r_${index}`}
                                    subscriptionAction={subscriptionAction}
                                    target={WorkflowTarget.RECONCILE}
                                    setPopover={setPopover}
                                    onClick={() => {
                                        if (compactMode) {
                                            silentlyStartAction(
                                                subscriptionAction.name,
                                                false,
                                            );
                                        } else {
                                            redirectToUrl(
                                                subscriptionAction.name,
                                            );
                                        }
                                    }}
                                />
                            ),
                        )}
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
                        {subscriptionActions.modify.map(
                            (subscriptionAction, index) => (
                                <WfoSubscriptionActionsMenuItem
                                    key={`m_${index}`}
                                    subscriptionAction={subscriptionAction}
                                    target={WorkflowTarget.MODIFY}
                                    setPopover={setPopover}
                                    onClick={() => {
                                        redirectToUrl(subscriptionAction.name);
                                    }}
                                />
                            ),
                        )}
                    </>
                )}
            {compactItems}
            {isAllowed(SUBSCRIPTION_TERMINATE + subscriptionId) &&
                subscriptionActions?.terminate && (
                    <>
                        <MenuBlock title={t('terminate')} />
                        {subscriptionActions.terminate.map(
                            (subscriptionAction, index) => (
                                <WfoSubscriptionActionsMenuItem
                                    key={`t_${index}`}
                                    subscriptionAction={subscriptionAction}
                                    target={WorkflowTarget.TERMINATE}
                                    setPopover={setPopover}
                                    onClick={() => {
                                        redirectToUrl(subscriptionAction.name);
                                    }}
                                />
                            ),
                        )}
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
