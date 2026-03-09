import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiButtonIcon, EuiFlexGroup, EuiText, EuiToolTip } from '@elastic/eui';

import { useGetOrchestratorConfig } from '@/hooks';

interface WfoProductInformationWithLinkProps {
  workflowName: string;
  productNames: string;
}

export const WfoProductInformationWithLink = ({ workflowName, productNames }: WfoProductInformationWithLinkProps) => {
  const { workflowInformationLinkUrl, showWorkflowInformationLink } = useGetOrchestratorConfig();
  const t = useTranslations('processes.detail');
  const docsUrl = workflowInformationLinkUrl + workflowName;
  return (
    <EuiFlexGroup gutterSize={'s'} alignItems={'center'}>
      {showWorkflowInformationLink && (
        <EuiToolTip content={t('openWorkflowTaskInfo')}>
          <a href={docsUrl} target="_blank">
            <EuiButtonIcon iconSize={'l'} iconType={'info'} aria-label={t('openWorkflowTaskInfo')} />
          </a>
        </EuiToolTip>
      )}
      <EuiText size="s">{productNames}</EuiText>
    </EuiFlexGroup>
  );
};
