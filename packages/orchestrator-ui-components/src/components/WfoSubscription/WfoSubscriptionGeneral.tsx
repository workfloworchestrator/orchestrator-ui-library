import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexGrid, EuiFlexItem } from '@elastic/eui';

import { SubscriptionDetail } from '@/types';
import { getDate, parseDateToLocaleDateTimeString } from '@/utils';

import {
    WfoProductStatusBadge,
    WfoSubscriptionStatusBadge,
} from '../WfoBadges';
import { WfoInsyncIcon } from '../WfoInsyncIcon/WfoInsyncIcon';
import { WfoKeyValueTableDataType } from '../WfoKeyValueTable/WfoKeyValueTable';
import { SubscriptionKeyValueBlock } from './SubscriptionKeyValueBlock';

interface WfoSubscriptionGeneralProps {
    subscriptionDetail: SubscriptionDetail;
}

export const WfoSubscriptionGeneral = ({
    subscriptionDetail,
}: WfoSubscriptionGeneralProps) => {
    const t = useTranslations('subscriptions.detail');

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
                value: parseDateToLocaleDateTimeString(
                    getDate(subscriptionDetail?.startDate),
                ),
            },
            {
                key: t('endDate'),
                value: parseDateToLocaleDateTimeString(
                    getDate(subscriptionDetail?.endDate),
                ),
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
                value: <WfoInsyncIcon inSync={subscriptionDetail.insync} />,
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
                value: parseDateToLocaleDateTimeString(
                    getDate(product.createdAt),
                ),
            },
            {
                key: t('endDate'),
                value: parseDateToLocaleDateTimeString(
                    getDate(product?.endDate),
                ),
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
