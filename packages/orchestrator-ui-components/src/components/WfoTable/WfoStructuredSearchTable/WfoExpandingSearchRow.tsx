import React from 'react';

import { useWithOrchestratorTheme } from '@/hooks';
import type { MatchingField } from '@/types';

import { getWfoStructuredSearchTableStyles } from './styles';

interface WfoExpandingSearchRowProps {
  score?: number;
  perfectMatch?: number;
  matchingFields?: MatchingField[] | null;
}

export const WfoExpandingSearchRow = ({ score, matchingFields }: WfoExpandingSearchRowProps) => {
  const { expandingSearchRowStyles, expandingRowBodyStyles } = useWithOrchestratorTheme(
    getWfoStructuredSearchTableStyles,
  );

  if (!matchingFields) return null;

  const matchingField = matchingFields[0];
  const { path, text } = matchingField;

  return (
    <tr>
      <td colSpan={999} css={expandingSearchRowStyles}>
        <div css={expandingRowBodyStyles}>
          <div>
            <span>{path}</span> {text}
          </div>
          <span>•</span>
          <div>
            <span>score</span> {score !== undefined && `${(score * 100).toFixed(1)}%`}
          </div>
        </div>
      </td>
    </tr>
  );
};
