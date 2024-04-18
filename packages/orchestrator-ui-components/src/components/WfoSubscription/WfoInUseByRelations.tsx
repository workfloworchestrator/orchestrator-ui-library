import React from 'react';

import { useTranslations } from 'next-intl';

import {
    WfoError,
    WfoFirstPartUUID,
    WfoKeyValueTable,
    WfoLoading,
} from '@/components';
import type { WfoKeyValueTableDataType } from '@/components';
import { useGetInUseByRelationDetailsQuery } from '@/rtk';
import { InUseByRelation, InUseByRelationDetail } from '@/types';

interface WfoInUseByRelationsProps {
    inUseByRelations: InUseByRelation[];
}

export const WfoInUseByRelations = ({
    inUseByRelations,
}: WfoInUseByRelationsProps) => {
    const t = useTranslations('subscriptions.detail');

    const subscriptionIds = inUseByRelations
        .map((relation) => relation.subscription_id)
        .join('|');
    const { data, isLoading, isError } = useGetInUseByRelationDetailsQuery({
        subscriptionIds,
    });

    if (isError) {
        return <WfoError />;
    }

    if (isLoading) {
        return <WfoLoading />;
    }

    const getKeyValues = (
        inUseByRelationDetails: InUseByRelationDetail,
    ): WfoKeyValueTableDataType[] => {
        return [
            {
                key: t('description'),
                value: inUseByRelationDetails.description,
                textToCopy: inUseByRelationDetails.description,
            },
            {
                key: t('productType'),
                value: inUseByRelationDetails.product.productType,
                textToCopy: inUseByRelationDetails.product.productType,
            },
            {
                key: t('subscriptionId'),
                value: (
                    <WfoFirstPartUUID
                        UUID={inUseByRelationDetails.subscriptionId}
                    />
                ),
                textToCopy: inUseByRelationDetails.subscriptionId,
            },
        ];
    };

    return (
        <>
            {data?.inUseByRelationDetails.map((relation, index) => {
                const keyValues = getKeyValues(relation);

                return (
                    <WfoKeyValueTable
                        keyValues={keyValues}
                        showCopyToClipboardIcon={true}
                        key={index}
                    />
                );
            })}
        </>
    );
};
