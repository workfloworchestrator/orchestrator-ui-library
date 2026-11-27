/** Keeps saved ids that still exist, drops duplicates, appends new cards at the end. Order is row by row. */
export const normalizeCardOrder = (savedCardIds: unknown, cardIds: readonly string[]): string[] => {
  const knownCardIds =
    Array.isArray(savedCardIds) ?
      savedCardIds.filter((cardId): cardId is string => typeof cardId === 'string' && cardIds.includes(cardId))
    : [];
  const uniqueCardIds = [...new Set(knownCardIds)];
  return [...uniqueCardIds, ...cardIds.filter((cardId) => !uniqueCardIds.includes(cardId))];
};

export const areAllCardsExpanded = (cardIds: readonly string[], expandedCardIds: readonly string[]): boolean =>
  cardIds.length > 0 && cardIds.every((cardId) => expandedCardIds.includes(cardId));

export const toggleAllCards = (cardIds: readonly string[], expandedCardIds: readonly string[]): string[] =>
  areAllCardsExpanded(cardIds, expandedCardIds) ? [] : [...cardIds];
