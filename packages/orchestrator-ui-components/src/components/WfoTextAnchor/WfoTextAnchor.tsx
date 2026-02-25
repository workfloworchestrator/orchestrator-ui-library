import React from 'react';

import { EuiText } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';

import { getStyles } from './styles';

interface WfoTextAnchorProps {
  text: string;
  onClick: () => void;
}

export const WfoTextAnchor = ({ text, onClick }: WfoTextAnchorProps) => {
  const { textAnchorStyle } = useWithOrchestratorTheme(getStyles);

  return (
    <EuiText onClick={onClick} css={textAnchorStyle}>
      {text}
    </EuiText>
  );
};
