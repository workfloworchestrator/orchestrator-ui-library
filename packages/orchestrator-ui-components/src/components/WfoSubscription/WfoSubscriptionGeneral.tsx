import React from 'react';

import { EuiFlexGrid, EuiFlexItem } from '@elastic/eui';

import {
  WfoSubscriptionDetailSection,
  WfoSubscriptionFixedInputSection,
  WfoSubscriptionMetadataSection,
  WfoSubscriptionProductInfoSection,
  useSubscriptionDetailGeneralSectionConfigurationOverride,
} from '@/components';
import { WfoSubscriptionDetailGeneralConfiguration } from '@/rtk';
import { SubscriptionDetail } from '@/types';
import { toOptionalArrayEntry } from '@/utils';

interface WfoSubscriptionGeneralProps {
  subscriptionDetail: SubscriptionDetail;
}

export enum WfoSubscriptionGeneralSections {
  BLOCK_TITLE_SUBSCRIPTION_DETAILS = 'blockTitleSubscriptionDetails',
  BLOCK_TITLE_METADATA = 'metadata',
  BLOCK_TITLE_FIXED_INPUTS = 'blockTitleFixedInputs',
  BLOCK_TITLE_PRODUCT_INFO = 'blockTitleProductInfo',
}

export const WfoSubscriptionGeneral = ({ subscriptionDetail }: WfoSubscriptionGeneralProps) => {
  const { overrideSections } = useSubscriptionDetailGeneralSectionConfigurationOverride();

  const { metadata, fixedInputs, product } = subscriptionDetail;

  const hasMetadata = Object.entries(metadata).length > 0;
  const hasFixedInputs = fixedInputs.length > 0;

  const defaultConfiguration: WfoSubscriptionDetailGeneralConfiguration[] = [
    {
      id: WfoSubscriptionGeneralSections.BLOCK_TITLE_SUBSCRIPTION_DETAILS,
      node: <WfoSubscriptionDetailSection subscriptionDetail={subscriptionDetail} />,
    },
    ...toOptionalArrayEntry(
      {
        id: WfoSubscriptionGeneralSections.BLOCK_TITLE_METADATA,
        node: <WfoSubscriptionMetadataSection metadata={metadata} />,
      },
      hasMetadata,
    ),
    ...toOptionalArrayEntry(
      {
        id: WfoSubscriptionGeneralSections.BLOCK_TITLE_FIXED_INPUTS,
        node: <WfoSubscriptionFixedInputSection fixedInputs={fixedInputs} />,
      },
      hasFixedInputs,
    ),
    {
      id: WfoSubscriptionGeneralSections.BLOCK_TITLE_PRODUCT_INFO,
      node: <WfoSubscriptionProductInfoSection product={product} />,
    },
  ];

  const configuration: WfoSubscriptionDetailGeneralConfiguration[] =
    overrideSections?.(defaultConfiguration, subscriptionDetail) || defaultConfiguration;

  return (
    <EuiFlexGrid direction="row">
      {configuration.map(({ id, node }) => (
        <EuiFlexItem key={id}>{node}</EuiFlexItem>
      ))}
    </EuiFlexGrid>
  );
};
