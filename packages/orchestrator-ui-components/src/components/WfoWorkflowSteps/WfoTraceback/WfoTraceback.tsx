import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { EuiCodeBlock, EuiText } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';

import { getStyles } from './styles';

export type WfoTracebackProps = {
  children: string | null;
};

export const WfoTraceback: FC<WfoTracebackProps> = ({ children }) => {
  const { codeBlockStyle } = useWithOrchestratorTheme(getStyles);
  const t = useTranslations('processes.steps');

  return (
    <>
      <EuiText>
        <h3>{t('traceback')}</h3>
      </EuiText>
      <EuiCodeBlock css={codeBlockStyle}>{children}</EuiCodeBlock>
    </>
  );
};
