import React from 'react';

import type { MatchingField } from '@/types';

import { WfoHighlightedText } from '../WfoSearchPage';

export const WfoMatchingFields = ({ matchingFields }: { matchingFields?: MatchingField[] | null }) => {
  if (!matchingFields || matchingFields.length === 0) return null;

  return (
    <ul>
      {matchingFields.map((field, index) => (
        <li key={index}>
          {field.path}: <WfoHighlightedText text={field.text} highlight_indices={field.highlight_indices} />
        </li>
      ))}
    </ul>
  );
};
