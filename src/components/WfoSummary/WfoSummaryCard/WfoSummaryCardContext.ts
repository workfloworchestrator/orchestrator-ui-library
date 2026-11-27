import { createContext } from 'react';

export type WfoSummaryCardContextValue = {
  isExpanded: boolean;
  onExpandedChange: (isExpanded: boolean) => void;
  /** The card reports its title, so the drag handle and the screen reader messages can name it. */
  onTitleChange: (title: string) => void;
};

/** Set by WfoSummaryCards so the open cards are saved. Without it a card keeps its own open state. */
export const WfoSummaryCardContext = createContext<WfoSummaryCardContextValue | null>(null);
