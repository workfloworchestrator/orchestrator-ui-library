import React, { useContext } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiFlexGrid, EuiFlexItem } from '@elastic/eui';
import { EuiButton } from '@elastic/eui';

import { ConfirmationDialogContext } from '@/contexts';
import { SubscriptionDetail } from '@/types';
import { formatDate } from '@/utils';

import {
    WfoProductStatusBadge,
    WfoSubscriptionStatusBadge,
} from '../WfoBadges';
import { WfoInsyncIcon } from '../WfoInsyncIcon/WfoInsyncIcon';
import { WfoKeyValueTableDataType } from '../WfoKeyValueTable/WfoKeyValueTable';
import { PATH_TASKS, PATH_WORKFLOWS } from '../WfoPageTemplate';
import { SubscriptionKeyValueBlock } from './SubscriptionKeyValueBlock';
import { getLastUncompletedProcess, getLatestTaskDate } from './utils';

interface WfoSubscriptionGeneralProps {
    subscriptionDetail: SubscriptionDetail;
}

export const WfoSubscriptionGeneral = ({
    subscriptionDetail,
}: WfoSubscriptionGeneralProps) => {
    const t = useTranslations('subscriptions.detail');
    const { showConfirmDialog } = useContext(ConfirmationDialogContext);
    const setInSyncAction = () => {
        // console.log('todo: implement api call');
    };

    const InSyncField = ({ inSync }: { inSync: boolean }) => {
        const lastTaskRunDate = getLatestTaskDate(
            subscriptionDetail.processes.page,
        );
        const lastUncompletedProcess = getLastUncompletedProcess(
            subscriptionDetail.processes.page,
        );

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
                    <EuiButton
                        color="danger"
                        size="s"
                        onClick={confirmSetInSync}
                    >
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
                {inSync &&
                    lastTaskRunDate &&
                    `(${formatDate(lastTaskRunDate)})`}
                {!inSync && lastUncompletedProcess && getProcessLink()}
            </>
        );
    };

    const getSubscriptionDetailBlockData = (): WfoKeyValueTableDataType[] => {
        return [
            {
                key: t('subscriptionId'),
                value: subscriptionDetail.subscriptionId,
                textToCopy: subscriptionDetail.subscriptionId,
            },
            {
                key: t('productName'),
                value: subscriptionDetail.product.name,
            },
            {
                key: t('description'),
                value: subscriptionDetail.description,
            },
            {
                key: t('startDate'),
                value: formatDate(subscriptionDetail.startDate),
            },
            {
                key: t('endDate'),
                value: formatDate(subscriptionDetail.endDate),
            },
            {
                key: t('status'),
                value: (
                    <WfoSubscriptionStatusBadge
                        status={subscriptionDetail.status}
                    />
                ),
            },
            {
                key: t('insync'),
                value: <InSyncField inSync={subscriptionDetail.insync} />,
            },
            {
                key: t('customer'),
                value:
                    subscriptionDetail && subscriptionDetail.customer
                        ? `${subscriptionDetail.customer?.fullname}`
                        : '-',
            },
            {
                key: t('customerUuid'),
                value:
                    subscriptionDetail && subscriptionDetail.customer
                        ? `${subscriptionDetail.customer?.customerId}`
                        : '-',
                textToCopy: subscriptionDetail.customer?.customerId,
            },
            {
                key: t('note'),
                value: (subscriptionDetail && subscriptionDetail.note) || '-',
            },
        ];
    };

    const getFixedInputBlockData = (): WfoKeyValueTableDataType[] => {
        return subscriptionDetail.fixedInputs.map((fixedInput) => ({
            key: fixedInput.field,
            value: fixedInput.value,
        }));
    };

    const getProductInfoBlockData = (): WfoKeyValueTableDataType[] => {
        const product = subscriptionDetail.product;
        return [
            {
                key: t('name'),
                value: product.name,
            },
            {
                key: t('description'),
                value: product.description,
            },
            {
                key: t('productType'),
                value: product.productType,
            },
            {
                key: t('tag'),
                value: product.tag,
            },
            {
                key: t('status'),
                value: <WfoProductStatusBadge status={product.status} />,
            },
            {
                key: t('created'),
                value: formatDate(product.createdAt),
            },
            {
                key: t('endDate'),
                value: formatDate(product.endDate),
            },
        ];
    };

    return (
        <EuiFlexGrid direction={'row'}>
            <>
                <EuiFlexItem>
                    <SubscriptionKeyValueBlock
                        title={t('blockTitleSubscriptionDetails')}
                        keyValues={getSubscriptionDetailBlockData()}
                    />
                </EuiFlexItem>
                <EuiFlexItem>
                    <SubscriptionKeyValueBlock
                        title={t('blockTitleFixedInputs')}
                        keyValues={getFixedInputBlockData()}
                    />
                </EuiFlexItem>
                <EuiFlexItem>
                    <SubscriptionKeyValueBlock
                        title={t('blockTitleProductInfo')}
                        keyValues={getProductInfoBlockData()}
                    />
                </EuiFlexItem>
            </>
        </EuiFlexGrid>
    );
};
