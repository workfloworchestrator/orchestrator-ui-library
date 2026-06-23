import React from 'react';

import { useWithOrchestratorTheme } from '@/hooks';
import type { MatchingField } from '@/types';

import { getWfoStructuredSearchTableStyles } from './styles';

interface WfoExpandingSearchRowProps {
  score?: number;
  perfectMatch?: number;
  matchingField?: MatchingField | null;
}

export const WfoExpandingSearchRow = ({ score, matchingField }: WfoExpandingSearchRowProps) => {
  const { expandingSearchRowStyles, expandingRowBodyStyles } = useWithOrchestratorTheme(
    getWfoStructuredSearchTableStyles,
  );

  if (!matchingField) return null;

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
