import React, { FC, ReactNode, useId, useState, useSyncExternalStore } from 'react';

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { Announcements, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { WfoSortableListContext } from '../sortableContext';
import { SORTABLE_SETTLE_DURATION_MS, SORTABLE_SETTLE_EASING } from '../sortableMotion';
import styles from './WfoSortableList.module.css';
import { moveSortableItem } from './moveSortableItem';

/** What screen readers hear while an item is dragged. Use the visible names of the items, not their ids. */
export type WfoSortableListAnnouncements = {
  onPickUp: (itemId: string) => string;
  onMoveOver: (itemId: string, overItemId: string) => string;
  onDrop: (itemId: string, overItemId: string) => string;
  onCancel: (itemId: string) => string;
};

export type WfoSortableListProps = {
  /** Ids of all items, in the current order. Each id needs one `WfoSortableItem`. */
  itemIds: string[];
  /** Called after a drop, with all ids in their new order. */
  onReorder: (reorderedItemIds: string[]) => void;
  /** The lifted copy that follows the pointer while dragging. */
  renderOverlay: (activeId: string) => ReactNode;
  /** Screen reader help text for the drag handles. */
  instructions: string;
  /** Translated screen reader messages while dragging. Without it, they are in English and use the ids. */
  announcements?: WfoSortableListAnnouncements;
  /** Any layout, for example a `WfoGrid`, with one `WfoSortableItem` per id. */
  children: ReactNode;
};

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const getReducedMotionQuery = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' ?
    window.matchMedia(REDUCED_MOTION_QUERY)
  : null;
const subscribeToReducedMotion = (onChange: () => void) => {
  const reducedMotionQuery = getReducedMotionQuery();
  reducedMotionQuery?.addEventListener('change', onChange);
  return () => reducedMotionQuery?.removeEventListener('change', onChange);
};
const usePrefersReducedMotion = () =>
  useSyncExternalStore(
    subscribeToReducedMotion,
    () => getReducedMotionQuery()?.matches ?? false,
    () => false,
  );

const toDndAnnouncements = (announcements: WfoSortableListAnnouncements): Announcements => ({
  onDragStart: ({ active }) => announcements.onPickUp(String(active.id)),
  onDragOver: ({ active, over }) => (over ? announcements.onMoveOver(String(active.id), String(over.id)) : undefined),
  onDragEnd: ({ active, over }) =>
    over ? announcements.onDrop(String(active.id), String(over.id)) : announcements.onCancel(String(active.id)),
  onDragCancel: ({ active }) => announcements.onCancel(String(active.id)),
});

/**
 * Makes items reorderable with an iOS-like feel: the dragged item lifts, the others glide aside.
 * It adds no layout of its own. It wraps the drag library, so no other code imports it.
 */
export const WfoSortableList: FC<WfoSortableListProps> = ({
  itemIds,
  onReorder,
  renderOverlay,
  instructions,
  announcements,
  children,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  // Same id on server and client. Without it, dnd-kit counts ids per module and the server HTML does not match.
  const dndContextId = useId();

  // The handle starts a drag. A small distance keeps plain clicks working.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => setActiveId(String(active.id));
  const handleDragCancel = () => setActiveId(null);
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (over && active.id !== over.id) onReorder(moveSortableItem(itemIds, String(active.id), String(over.id)));
  };

  return (
    <WfoSortableListContext.Provider value={{ activeId, isDragActive: activeId !== null }}>
      <DndContext
        id={dndContextId}
        sensors={sensors}
        collisionDetection={closestCenter}
        // Items can change size while dragging (for example when open items close). Measure again.
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        accessibility={{
          screenReaderInstructions: { draggable: instructions },
          ...(announcements && { announcements: toDndAnnouncements(announcements) }),
        }}
      >
        <SortableContext items={itemIds} strategy={rectSortingStrategy}>
          {children}
        </SortableContext>
        <DragOverlay
          dropAnimation={
            prefersReducedMotion ? null : { duration: SORTABLE_SETTLE_DURATION_MS, easing: SORTABLE_SETTLE_EASING }
          }
        >
          {activeId ?
            // A copy of the dragged item: screen readers and the keyboard skip it.
            <div className={styles.overlay} aria-hidden="true" inert>
              {renderOverlay(activeId)}
            </div>
          : null}
        </DragOverlay>
      </DndContext>
    </WfoSortableListContext.Provider>
  );
};
