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
  const { expandingSearchRowStyles, expandingRowBodyStyles, hideExpandedRowStyle, dotStyles } =
    useWithOrchestratorTheme(getWfoStructuredSearchTableStyles);

  if (!matchingFields || matchingFields.length === 0) return null;

  // Note: The row is shown on hover by the row above is as configured in the table component expandableRow config
  return (
    <tr css={hideExpandedRowStyle}>
      <td colSpan={999} css={expandingSearchRowStyles}>
        <div css={expandingRowBodyStyles}>
          {matchingFields.map((field) => {
            return (
              <div>
                {field.path}: {field.text} <span css={dotStyles}>•</span>
              </div>
            );
          })}

          {score && <div>confidence: {`${(score * 100).toFixed(1)}%`}</div>}
        </div>
      </td>
    </tr>
  );
};
