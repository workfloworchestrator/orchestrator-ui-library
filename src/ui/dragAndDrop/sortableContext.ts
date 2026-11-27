import { createContext, useContext } from 'react';

export type WfoSortableListState = {
  /** Id of the item being dragged, `null` at rest. */
  activeId: string | null;
  isDragActive: boolean;
};

export const WfoSortableListContext = createContext<WfoSortableListState | null>(null);

/** Drag state of the surrounding `WfoSortableList`, `null` outside one. For example: close open items while dragging. */
export const useWfoSortableList = () => useContext(WfoSortableListContext);
