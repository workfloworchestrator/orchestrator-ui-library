import React from 'react';
import type { CombinatorSelectorProps } from 'react-querybuilder';

import { getWfoStructuredSearchTableStyles } from '@/components/WfoTable/WfoStructuredSearchTable/styles';
import { useWithOrchestratorTheme } from '@/hooks';

import { WfoCombinatorSelector } from './WfoCombinatorSelector';

export const WfoInlineCombinator = (props: CombinatorSelectorProps) => {
  const { inlineCombinatorStyles } = useWithOrchestratorTheme(getWfoStructuredSearchTableStyles);

  return (
    <div css={inlineCombinatorStyles}>
      <WfoCombinatorSelector {...props} />
    </div>
  );
};
