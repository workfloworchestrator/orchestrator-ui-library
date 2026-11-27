import { moveSortableItem } from './moveSortableItem';

describe('moveSortableItem', () => {
  it('moves an item to the position of the target item', () => {
    expect(moveSortableItem(['a', 'b', 'c', 'd'], 'd', 'a')).toEqual(['d', 'a', 'b', 'c']);
    expect(moveSortableItem(['a', 'b', 'c', 'd'], 'a', 'c')).toEqual(['b', 'c', 'a', 'd']);
  });

  it('returns the same list when an id is unknown or nothing moves', () => {
    const itemIds = ['a', 'b'];
    expect(moveSortableItem(itemIds, 'x', 'a')).toBe(itemIds);
    expect(moveSortableItem(itemIds, 'a', 'x')).toBe(itemIds);
    expect(moveSortableItem(itemIds, 'a', 'a')).toBe(itemIds);
  });
});
