import React, { FC } from 'react';

import { EuiFlexItem } from '@elastic/eui';

import { WfoKeyValueTable } from '@/components';
import type { WfoKeyValueTableDataType } from '@/components';
import { useWithOrchestratorTheme } from '@/hooks';
import type { StepState } from '@/types';

import { getStyles } from './styles';

export type WfoTableCodeBlockProps = {
  stepState: StepState;
};

export const WfoTableCodeBlock: FC<WfoTableCodeBlockProps> = ({ stepState: data }) => {
  const { tableCodeBlockMarginStyle } = useWithOrchestratorTheme(getStyles);

  const keyValues: WfoKeyValueTableDataType[] = Object.entries(data).map((entry) => {
    const key = entry[0];
    const value = entry[1] as string;

    return {
      key,
      value,
      textToCopy: value,
    };
  });

  return (
    <EuiFlexItem css={tableCodeBlockMarginStyle}>
      <WfoKeyValueTable keyValues={keyValues} showCopyToClipboardIcon={true} />
    </EuiFlexItem>
  );
};
