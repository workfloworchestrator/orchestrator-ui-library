import React, { useContext } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiButton } from '@elastic/eui';

import { PolicyResource } from '@/configuration/policy-resources';
import { ConfirmationDialogContext } from '@/contexts';
import { useOrchestratorTheme, useShowToastMessage } from '@/hooks';
import { useSetSubscriptionInSyncMutation } from '@/rtk/endpoints';
import { SubscriptionDetail, ToastTypes } from '@/types';
import { formatDate } from '@/utils';

import { WfoIsAllowedToRender } from '../WfoAuth/WfoIsAllowedToRender';
import { WfoInsyncIcon } from '../WfoInsyncIcon/WfoInsyncIcon';
import { PATH_TASKS, PATH_WORKFLOWS } from '../WfoPageTemplate';
import { getLastUncompletedProcess, getLatestTaskDate } from './utils';

interface WfoInSyncFieldProps {
    subscriptionDetail: SubscriptionDetail;
    isFetching: boolean;
}

export const WfoInSyncField = ({
    subscriptionDetail,
    isFetching,
}: WfoInSyncFieldProps) => {
    const t = useTranslations('subscriptions.detail');
    const { theme } = useOrchestratorTheme();
    const inSync = subscriptionDetail.insync;
    const lastTaskRunDate = getLatestTaskDate(
        subscriptionDetail.processes.page,
    );
    const lastUncompletedProcess = getLastUncompletedProcess(
        subscriptionDetail.processes.page,
    );
    const [setSubscriptionInSync] = useSetSubscriptionInSyncMutation();
    const { showToastMessage } = useShowToastMessage();
    const { showConfirmDialog } = useContext(ConfirmationDialogContext);

    const setInSyncAction = () => {
        setSubscriptionInSync(subscriptionDetail.subscriptionId)
            .unwrap()
            .then(() => {
                showToastMessage(
                    ToastTypes.SUCCESS,
                    t('setInSyncSuccess.text'),
                    t('setInSyncSuccess.title'),
                );
            })
            .catch((error) => {
                showToastMessage(
                    ToastTypes.ERROR,
                    error?.data?.detail
                        ? error.data.detail
                        : t('setInSyncFailed.text').toString,
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
                        isLoading={isFetching}
                        isDisabled={isFetching}
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
