import React, { useContext } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiButton } from '@elastic/eui';

import { ConfirmationDialogContext } from '@/contexts';
import { useShowToastMessage } from '@/hooks';
import { useSetSubscriptionInSyncMutation } from '@/rtk/endpoints';
import { SubscriptionDetail, ToastTypes } from '@/types';
import { formatDate } from '@/utils';

import { WfoInsyncIcon } from '../WfoInsyncIcon/WfoInsyncIcon';
import { PATH_TASKS, PATH_WORKFLOWS } from '../WfoPageTemplate';
import { getLastUncompletedProcess, getLatestTaskDate } from './utils';

interface WfoInSyncFieldProps {
    subscriptionDetail: SubscriptionDetail;
}

export const WfoInSyncField = ({ subscriptionDetail }: WfoInSyncFieldProps) => {
    const t = useTranslations('subscriptions.detail');
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
                // Optimistic update for now
                showToastMessage(
                    ToastTypes.SUCCESS,
                    t('setInSyncSuccess.text'),
                    t('setInSyncSuccess.title'),
                );
                subscriptionDetail.insync = true;
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
        const processUrl =
            (lastUncompletedProcess?.isTask ? PATH_TASKS : PATH_WORKFLOWS) +
            '/' +
            lastUncompletedProcess?.processId;

        const confirmSetInSync = () => {
            showConfirmDialog({
                question: t('setInSyncQuestion'),
                confirmAction: () => {
                    setInSyncAction();
                },
            });
        };

        return (
            <>
                <Link
                    href={processUrl}
                    css={{ paddingLeft: 10, paddingRight: 20 }}
                >
                    {t('see')} {lastUncompletedProcess?.processId}
                </Link>
                <EuiButton color="danger" size="s" onClick={confirmSetInSync}>
                    {t('setInSync')}
                </EuiButton>
            </>
        );
    };

    return (
        <>
            <div css={{ paddingRight: 4, display: 'flex' }}>
                <WfoInsyncIcon inSync={inSync} />
            </div>
            {inSync && lastTaskRunDate && `(${formatDate(lastTaskRunDate)})`}
            {!inSync && lastUncompletedProcess && getProcessLink()}
        </>
    );
};
