import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexGrid, EuiFlexItem } from '@elastic/eui';

import { WfoJsonCodeBlock } from '@/components';
import { useSubscriptionDetailGeneralSectionConfigurationOverride } from '@/components/WfoSubscription/overrides/useSubscriptionDetailGeneralSectionConfigurationOverride';
import { WfoSubscriptionDetailGeneralConfiguration } from '@/rtk';
import { SubscriptionDetail } from '@/types';
import { camelToHuman, formatDate } from '@/utils';

import {
    WfoProductStatusBadge,
    WfoSubscriptionStatusBadge,
} from '../WfoBadges';
import { WfoKeyValueTableDataType } from '../WfoKeyValueTable/WfoKeyValueTable';
import { SubscriptionKeyValueBlock } from './SubscriptionKeyValueBlock';
import { WfoInSyncField } from './WfoInSyncField';

interface WfoSubscriptionGeneralProps {
    subscriptionDetail: SubscriptionDetail;
}

export const WfoSubscriptionGeneral = ({
    subscriptionDetail,
}: WfoSubscriptionGeneralProps) => {
    const t = useTranslations('subscriptions.detail');
    const { overrideSections } =
        useSubscriptionDetailGeneralSectionConfigurationOverride();

    const getSubscriptionDetailBlockData = (): WfoKeyValueTableDataType[] => [
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
            value: <WfoInSyncField subscriptionDetail={subscriptionDetail} />,
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

    const getMetadataBlockData = (): WfoKeyValueTableDataType[] =>
        Object.entries(subscriptionDetail.metadata).map(([key, value]) => ({
            key: camelToHuman(key),
            value: <WfoJsonCodeBlock data={value} isBasicStyle />,
        }));

    const getFixedInputBlockData = (): WfoKeyValueTableDataType[] =>
        subscriptionDetail.fixedInputs.map((fixedInput) => ({
            key: fixedInput.field,
            value: fixedInput.value,
        }));

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

    const hasMetadata = Object.entries(subscriptionDetail.metadata).length > 0;
    const hasFixedInputs = subscriptionDetail.fixedInputs.length > 0;

    const defaultConfiguration: WfoSubscriptionDetailGeneralConfiguration[] = [
        {
            id: 'blockTitleSubscriptionDetails',
            node: (
                <SubscriptionKeyValueBlock
                    title={t('blockTitleSubscriptionDetails')}
                    keyValues={getSubscriptionDetailBlockData()}
                />
            ),
        },
        ...(hasMetadata
            ? [
                  {
                      id: 'metadata',
                      node: (
                          <SubscriptionKeyValueBlock
                              title={t('metadata')}
                              keyValues={getMetadataBlockData()}
                          />
                      ),
                  },
              ]
            : []),
        ...(hasFixedInputs
            ? [
                  {
                      id: 'blockTitleFixedInputs',
                      node: (
                          <SubscriptionKeyValueBlock
                              title={t('blockTitleFixedInputs')}
                              keyValues={getFixedInputBlockData()}
                          />
                      ),
                  },
              ]
            : []),
        {
            id: 'blockTitleProductInfo',
            node: (
                <SubscriptionKeyValueBlock
                    title={t('blockTitleProductInfo')}
                    keyValues={getProductInfoBlockData()}
                />
            ),
        },
    ];

    const configuration: WfoSubscriptionDetailGeneralConfiguration[] =
        overrideSections?.(defaultConfiguration) || defaultConfiguration;

    return (
        <EuiFlexGrid direction="row">
            {configuration.map(({ id, node }) => (
                <EuiFlexItem key={id}>{node}</EuiFlexItem>
            ))}
        </EuiFlexGrid>
    );
};
