import React, { FC } from 'react';

import { EuiCodeBlock } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';

import { getStyles } from './styles';

export type WfoJsonCodeBlockProps = {
  data: object;
  isBasicStyle?: boolean;
};

/**
 * WfoJsonCodeBlock is used to render objects in JSON format
 * @param data
 * @param isBasicStyle Basic style is a minimalistic style of the code block. It has no paddings and line numbers
 * @constructor
 */
export const WfoJsonCodeBlock: FC<WfoJsonCodeBlockProps> = ({ data, isBasicStyle = false }) => {
  const { euiCodeBlockStyle, euiBasicCodeBlockStyle } = useWithOrchestratorTheme(getStyles);

  const json = JSON.stringify(data, null, 4);

  return (
    <EuiCodeBlock
      css={isBasicStyle ? euiBasicCodeBlockStyle : euiCodeBlockStyle}
      isCopyable={true}
      language="json"
      lineNumbers={!isBasicStyle}
    >
      {json}
    </EuiCodeBlock>
  );
};
