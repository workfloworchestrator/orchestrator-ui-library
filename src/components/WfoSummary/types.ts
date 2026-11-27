import { ReactNode } from 'react';

export type SummaryCardListItem = {
  title: string;
  value: ReactNode;
  url?: string;
};

export type SummaryCardButtonConfig = {
  name: string;
  url: string;
};
