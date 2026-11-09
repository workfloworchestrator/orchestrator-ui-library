import React from 'react';

import { WfoHighlightedText } from '@/components/WfoHighlightedText';
import type { MatchingField } from '@/types';

export const WfoMatchingFields = ({ matchingFields }: { matchingFields?: MatchingField[] | null }) => {
  if (!matchingFields || matchingFields.length === 0) return null;

  return (
    <ul>
      {matchingFields.map((field, index) => (
        <li key={index}>
          {field.path}: <WfoHighlightedText text={field.text} highlightIndices={field.highlightIndices} />
        </li>
      ))}
    </ul>
  );
};
