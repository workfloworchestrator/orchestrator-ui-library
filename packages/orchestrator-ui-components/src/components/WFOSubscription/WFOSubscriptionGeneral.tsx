import React from 'react';

import { EuiFlexGrid, EuiFlexItem } from '@elastic/eui';
import { useTranslations } from 'next-intl';

import { WFOCheckmarkCircleFill, WFOMinusCircleOutline } from '../../icons';
import {
    WFOSubscriptionStatusBadge,
    WFOProductStatusBadge,
} from '../WFOBadges';

import { SubscriptionKeyValueBlock } from './SubscriptionKeyValueBlock';
import { SubscriptionDetail } from '../../types';
import { WFOKeyValueTableDataType } from '../WFOKeyValueTable/WFOKeyValueTable';
import { useOrchestratorTheme } from '../../hooks';

interface WFOSubscriptionGeneralProps {
    subscriptionDetail: SubscriptionDetail;
}

export const WFOSubscriptionGeneral = ({
    subscriptionDetail,
}: WFOSubscriptionGeneralProps) => {
    const t = useTranslations('subscriptions.detail');
    const { theme } = useOrchestratorTheme();

    const getInSyncIcon = (value: boolean) => {
        return value ? (
            <WFOCheckmarkCircleFill
                height={20}
                width={20}
                color={theme.colors.primary}
            />
        ) : (
            <WFOMinusCircleOutline
                height={20}
                width={20}
                color={theme.colors.mediumShade}
            />
        );
    };

    const getSubscriptionDetailBlockData = (): WFOKeyValueTableDataType[] => {
        return [
            {
                key: t('subscriptionId'),
                value: subscriptionDetail.subscriptionId,
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
                value: subscriptionDetail.startDate,
            },
            {
                key: t('endDate'),
                value: subscriptionDetail.endDate,
            },
            {
                key: t('status'),
                value: (
                    <WFOSubscriptionStatusBadge
                        status={subscriptionDetail.status}
                    />
                ),
            },
            {
                key: t('insync'),
                value: getInSyncIcon(subscriptionDetail.insync),
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
                        ? `${subscriptionDetail.customer?.identifier}`
                        : '-',
            },
        ];
    };

    const getFixedInputBlockData = (): WFOKeyValueTableDataType[] => {
        return subscriptionDetail.fixedInputs.map((fixedInput) => ({
            key: fixedInput.field,
            value: fixedInput.value,
        }));
    };

    const getProductInfoBlockData = (): WFOKeyValueTableDataType[] => {
        const product = subscriptionDetail.product;
        return [
            {
                key: 'name',
                value: product.name,
            },
            {
                key: 'description',
                value: product.description,
            },
            {
                key: 'productType',
                value: product.productType,
            },
            {
                key: 'tag',
                value: product.tag,
            },
            {
                key: 'status',
                value: <WFOProductStatusBadge status={product.status} />,
            },
            {
                key: 'created',
                value: product.createdAt,
            },
            {
                key: 'endDate',
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
