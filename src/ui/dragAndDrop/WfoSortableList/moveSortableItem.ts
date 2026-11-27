import { arrayMove } from '@dnd-kit/sortable';

/** Moves the active item to the position of the item it was dropped on. Unknown ids keep the order. */
export const moveSortableItem = (itemIds: string[], activeId: string, overId: string): string[] => {
  const fromIndex = itemIds.indexOf(activeId);
  const toIndex = itemIds.indexOf(overId);
  return fromIndex < 0 || toIndex < 0 || fromIndex === toIndex ? itemIds : arrayMove(itemIds, fromIndex, toIndex);
};
