import { areAllCardsExpanded, normalizeCardOrder, toggleAllCards } from './summaryCardOrder';

describe('normalizeCardOrder', () => {
  const cardIds = ['a', 'b', 'c'];
  it('uses default order without saved value', () => expect(normalizeCardOrder(undefined, cardIds)).toEqual(cardIds));
  it('keeps saved order', () => expect(normalizeCardOrder(['c', 'a', 'b'], cardIds)).toEqual(['c', 'a', 'b']));
  it('drops unknown and duplicate ids, appends new cards', () =>
    expect(normalizeCardOrder(['c', 'x', 'c'], cardIds)).toEqual(['c', 'a', 'b']));
  it('ignores invalid saved data', () => expect(normalizeCardOrder('nope', cardIds)).toEqual(cardIds));
});

describe('expand all', () => {
  it('expands all when some are collapsed', () => expect(toggleAllCards(['a', 'b'], ['a'])).toEqual(['a', 'b']));
  it('collapses all when all are expanded', () => {
    expect(areAllCardsExpanded(['a', 'b'], ['b', 'a'])).toBe(true);
    expect(toggleAllCards(['a', 'b'], ['a', 'b'])).toEqual([]);
  });
  it('is never "all expanded" without cards', () => expect(areAllCardsExpanded([], [])).toBe(false));
});
