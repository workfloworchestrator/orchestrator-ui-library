import React from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import {
    WfoError,
    WfoFirstPartUUID,
    WfoKeyValueTable,
    WfoLoading,
} from '@/components';
import type { WfoKeyValueTableDataType } from '@/components';
import { PATH_SUBSCRIPTIONS } from '@/components';
import { useWithOrchestratorTheme } from '@/hooks';
import { useGetInUseByRelationDetailsQuery } from '@/rtk';
import { InUseByRelation, InUseByRelationDetail } from '@/types';

import { getSubscriptionDetailStyles } from './styles';

interface WfoInUseByRelationsProps {
    inUseByRelations: InUseByRelation[];
}

export const WfoInUseByRelations = ({
    inUseByRelations,
}: WfoInUseByRelationsProps) => {
    const t = useTranslations('subscriptions.detail');
    const { inUseByRelationDetailsStyle } = useWithOrchestratorTheme(
        getSubscriptionDetailStyles,
    );
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
                key: t('subscriptionId'),
                value: (
                    <WfoFirstPartUUID
                        UUID={inUseByRelationDetails.subscriptionId}
                        showCopyIcon={false}
                    />
                ),
                textToCopy: inUseByRelationDetails.subscriptionId,
            },
            {
                key: t('description'),
                value: (
                    <Link
                        href={`${PATH_SUBSCRIPTIONS}/${inUseByRelationDetails.subscriptionId}`}
                        target="_blank"
                    >
                        {inUseByRelationDetails.description}
                    </Link>
                ),
                textToCopy: inUseByRelationDetails.description,
            },
            {
                key: t('productName'),
                value: inUseByRelationDetails.product.name,
                textToCopy: inUseByRelationDetails.product.name,
            },
        ];
    };

    return (
        <>
            {data?.inUseByRelationDetails.map((relation, index) => {
                const keyValues = getKeyValues(relation);

                return (
                    <div css={inUseByRelationDetailsStyle} key={index}>
                        <WfoKeyValueTable
                            keyValues={keyValues}
                            showCopyToClipboardIcon={true}
                        />
                    </div>
                );
            })}
        </>
    );
};
