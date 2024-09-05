import React from 'react';

import { EuiFlexGrid, EuiFlexItem } from '@elastic/eui';

import { WfoSubscriptionDetailSection } from '@/components/WfoSubscription/WfoSubscriptionGeneralSections/WfoSubscriptionDetailSection';
import { WfoSubscriptionFixedInputSection } from '@/components/WfoSubscription/WfoSubscriptionGeneralSections/WfoSubscriptionFixedInputSection';
import { WfoSubscriptionMetadataSection } from '@/components/WfoSubscription/WfoSubscriptionGeneralSections/WfoSubscriptionMetadataSection';
import { WfoSubscriptionProductInfoSection } from '@/components/WfoSubscription/WfoSubscriptionGeneralSections/WfoSubscriptionProductInfoSection';
import { useSubscriptionDetailGeneralSectionConfigurationOverride } from '@/components/WfoSubscription/overrides/useSubscriptionDetailGeneralSectionConfigurationOverride';
import { WfoSubscriptionDetailGeneralConfiguration } from '@/rtk';
import { SubscriptionDetail } from '@/types';
import { toOptionalArrayEntry } from '@/utils';

interface WfoSubscriptionGeneralProps {
    subscriptionDetail: SubscriptionDetail;
    isFetching: boolean;
}

export enum WfoSubscriptionGeneralSections {
    BLOCK_TITLE_SUBSCRIPTION_DETAILS = 'blockTitleSubscriptionDetails',
    BLOCK_TITLE_METADATA = 'metadata',
    BLOCK_TITLE_FIXED_INPUTS = 'blockTitleFixedInputs',
    BLOCK_TITLE_PRODUCT_INFO = 'blockTitleProductInfo',
}

export const WfoSubscriptionGeneral = ({
    subscriptionDetail,
    isFetching,
}: WfoSubscriptionGeneralProps) => {
    const { overrideSections } =
        useSubscriptionDetailGeneralSectionConfigurationOverride();

    const hasMetadata = Object.entries(subscriptionDetail.metadata).length > 0;
    const hasFixedInputs = subscriptionDetail.fixedInputs.length > 0;

    const defaultConfiguration: WfoSubscriptionDetailGeneralConfiguration[] = [
        {
            id: WfoSubscriptionGeneralSections.BLOCK_TITLE_SUBSCRIPTION_DETAILS,
            node: (
                <WfoSubscriptionDetailSection
                    subscriptionDetail={subscriptionDetail}
                    isFetching={isFetching}
                />
            ),
        },
        ...toOptionalArrayEntry(
            {
                id: WfoSubscriptionGeneralSections.BLOCK_TITLE_METADATA,
                node: (
                    <WfoSubscriptionMetadataSection
                        subscriptionDetail={subscriptionDetail}
                    />
                ),
            },
            hasMetadata,
        ),
        ...toOptionalArrayEntry(
            {
                id: WfoSubscriptionGeneralSections.BLOCK_TITLE_FIXED_INPUTS,
                node: (
                    <WfoSubscriptionFixedInputSection
                        subscriptionDetail={subscriptionDetail}
                    />
                ),
            },
            hasFixedInputs,
        ),
        {
            id: WfoSubscriptionGeneralSections.BLOCK_TITLE_PRODUCT_INFO,
            node: (
                <WfoSubscriptionProductInfoSection
                    subscriptionDetail={subscriptionDetail}
                />
            ),
        },
    ];

    const configuration: WfoSubscriptionDetailGeneralConfiguration[] =
        overrideSections?.(defaultConfiguration, subscriptionDetail) ||
        defaultConfiguration;

    return (
        <EuiFlexGrid direction="row">
            {configuration.map(({ id, node }) => (
                <EuiFlexItem key={id}>{node}</EuiFlexItem>
            ))}
        </EuiFlexGrid>
    );
};
