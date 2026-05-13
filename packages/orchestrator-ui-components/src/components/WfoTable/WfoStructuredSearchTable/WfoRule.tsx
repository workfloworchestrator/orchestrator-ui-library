import React from 'react';
import type { RuleProps } from 'react-querybuilder';
import { Rule } from 'react-querybuilder';

import { getWfoStructuredSearchTableStyles } from '@/components/WfoTable/WfoStructuredSearchTable/styles';
import { useWithOrchestratorTheme } from '@/hooks';

export const WfoRule = (props: RuleProps) => {
  const { ruleContainerStyles } = useWithOrchestratorTheme(getWfoStructuredSearchTableStyles);

  return (
    <div css={ruleContainerStyles}>
      <Rule {...props} />
    </div>
  );
};
