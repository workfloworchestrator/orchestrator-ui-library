import React from 'react';

import { EuiFlexGrid, EuiFlexItem } from '@elastic/eui';
import { useTranslations } from 'next-intl';

import { SubscriptionKeyValueBlock } from './SubscriptionKeyValueBlock';
import { SubscriptionDetail, KeyValue } from '../../types';

interface SubscriptionGeneralProps {
    subscriptionDetail: SubscriptionDetail;
}

export const SubscriptionGeneral = ({
    subscriptionDetail,
}: SubscriptionGeneralProps) => {
    const t = useTranslations('subscriptions.detail');

    const getSubscriptionDetailBlockData = (): KeyValue[] => {
        return [
            {
                key: t('subscriptionId'),
                value: subscriptionDetail.subscriptionId,
            },
            {
                key: t('description'),
                value: subscriptionDetail.description,
            },
            {
                key: t('startDate'),
                value: subscriptionDetail.startDate,
            },
            {
                key: t('endDate'),
                value: subscriptionDetail.endDate,
            },
            {
                key: t('insync'),
                value: subscriptionDetail.insync,
            },
            {
                key: t('customer'),
                value: `${subscriptionDetail.customer?.fullname}`,
            },
            {
                key: t('customerUuid'),
                value: `${subscriptionDetail.customer?.identifier}`,
            },
        ];
    };

    const getFixedInputBlockData = (): KeyValue[] => {
        return subscriptionDetail.fixedInputs.map((fixedInput) => ({
            key: fixedInput.field,
            value: fixedInput.value,
        }));
    };

    const getProductInfoBlockData = (): KeyValue[] => {
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
                value: product.status,
            },
            {
                key: t('created'),
                value: product.createdAt,
            },
            {
                key: t('endDate'),
                value: product.endDate,
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
