import React from 'react';

import type { MatchingField } from '@/types';

interface WfoExpandingSearchRowProps {
  score?: number;
  perfectMatch?: number;
  matchingField?: MatchingField | null;
}

export const WfoExpandingSearchRow = ({ score, perfectMatch, matchingField }: WfoExpandingSearchRowProps) => {
  console.log(score, perfectMatch, matchingField);
  return (
    <div>
      {score} - {perfectMatch}
    </div>
  );
};
