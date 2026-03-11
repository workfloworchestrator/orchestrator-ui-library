import React from 'react';

import type { Filter } from '@/types';

interface WfoFilterBuilderProps {
  filter?: Filter;
  onUpdateFilter: (filter: Filter) => void;
}

export const WfoFilterBuilder = ({ filter, onUpdateFilter }: WfoFilterBuilderProps) => {
  console.log(filter, onUpdateFilter);
  return <div>FILTERBUILDER</div>;
};
