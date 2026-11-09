import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText, EuiToolTip } from '@elastic/eui';

import { useGetOrchestratorConfig, useOrchestratorTheme } from '@/hooks';

interface WfoProductInformationWithLinkProps {
  workflowName: string;
  productNames: string;
}

export const WfoProductInformationWithLink = ({ workflowName, productNames }: WfoProductInformationWithLinkProps) => {
  const { workflowInformationLinkUrl, showWorkflowInformationLink } = useGetOrchestratorConfig();
  const t = useTranslations('processes.detail');
  const docsUrl = workflowInformationLinkUrl + workflowName;
  const { theme } = useOrchestratorTheme();

  return (
    <EuiFlexGroup css={{ paddingBottom: theme.size.xs }} gutterSize={'s'} alignItems={'center'}>
      {showWorkflowInformationLink && (
        <EuiToolTip content={t('openWorkflowTaskInfo')}>
          <a href={docsUrl} target="_blank">
            <EuiButtonIcon iconSize={'l'} iconType={'info'} aria-label={t('openWorkflowTaskInfo')} />
          </a>
        </EuiToolTip>
      )}
      <EuiFlexItem>
        <EuiSpacer size={'xs'} />
        <EuiText size="m">{productNames}</EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
