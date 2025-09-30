import React, { useContext, useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiButton } from '@elastic/eui';

import { WfoIsAllowedToRender, getErrorToastMessage } from '@/components';
import { WfoInsyncIcon } from '@/components';
import { PATH_TASKS, PATH_WORKFLOWS } from '@/components';
import { PolicyResource } from '@/configuration/policy-resources';
import { ConfirmationDialogContext } from '@/contexts';
import { useOrchestratorTheme, useShowToastMessage } from '@/hooks';
import { useSetSubscriptionInSyncMutation } from '@/rtk/endpoints';
import { SubscriptionDetail, ToastTypes } from '@/types';
import { formatDate } from '@/utils';

import { getLastUncompletedProcess, getLatestTaskDate } from './utils';

interface WfoInSyncFieldProps {
    subscriptionDetail: SubscriptionDetail;
}

export const WfoInSyncField = ({ subscriptionDetail }: WfoInSyncFieldProps) => {
    const t = useTranslations('subscriptions.detail');
    const { theme } = useOrchestratorTheme();
    const [inSync, setInSync] = useState<boolean>(subscriptionDetail.insync);
    const lastTaskRunDate = getLatestTaskDate(
        subscriptionDetail.processes?.page,
    );
    const lastUncompletedProcess = getLastUncompletedProcess(
        subscriptionDetail?.processes?.page,
    );

    const [setSubscriptionInSync, { isLoading }] =
        useSetSubscriptionInSyncMutation();
    const { showToastMessage } = useShowToastMessage();
    const { showConfirmDialog } = useContext(ConfirmationDialogContext);

    useEffect(() => {
        setInSync(subscriptionDetail.insync);
    }, [subscriptionDetail.insync]);

    const setInSyncAction = () => {
        setSubscriptionInSync(subscriptionDetail.subscriptionId)
            .unwrap()
            .then(() => {
                setInSync(true);
                showToastMessage(
                    ToastTypes.SUCCESS,
                    t('setInSyncSuccess.text'),
                    t('setInSyncSuccess.title'),
                );
            })
            .catch((error) => {
                const errorToastMessage = error?.data?.detail
                    ? getErrorToastMessage(error?.data?.detail)
                    : t('setInSyncFailed.text').toString();

                showToastMessage(
                    ToastTypes.ERROR,
                    errorToastMessage,
                    t('setInSyncFailed.title'),
                );
                console.error('Failed to set subscription in sync.', error);
            });
    };

    const getProcessLink = () => {
        const processUrl = `${
            lastUncompletedProcess?.isTask ? PATH_TASKS : PATH_WORKFLOWS
        }/${lastUncompletedProcess?.processId}`;

        const confirmSetInSync = () => {
            showConfirmDialog({
                question: t('setInSyncQuestion'),
                onConfirm: () => {
                    setInSyncAction();
                },
            });
        };

        return (
            <>
                <Link
                    href={processUrl}
                    css={{
                        paddingLeft: theme.base / 2,
                        paddingRight: theme.base,
                    }}
                >
                    {t('see')} {lastUncompletedProcess?.processId}
                </Link>
                <WfoIsAllowedToRender resource={PolicyResource.PROCESS_RETRY}>
                    <EuiButton
                        isLoading={isLoading}
                        isDisabled={isLoading}
                        color="danger"
                        size="s"
                        onClick={confirmSetInSync}
                    >
                        {t('setInSync')}
                    </EuiButton>
                </WfoIsAllowedToRender>
            </>
        );
    };

    return (
        <>
            <div css={{ paddingRight: theme.base / 4, display: 'flex' }}>
                <WfoInsyncIcon inSync={inSync} />
            </div>
            {inSync && lastTaskRunDate && `(${formatDate(lastTaskRunDate)})`}
            {!inSync && lastUncompletedProcess && getProcessLink()}
        </>
    );
};
