import React, { CSSProperties, FC, ReactNode } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { joinClassNames } from '@/utils/joinClassNames';

import { SORTABLE_SETTLE_DURATION_MS, SORTABLE_SETTLE_EASING } from '../sortableMotion';
import styles from './WfoSortableItem.module.css';

export type WfoSortableItemProps = {
  /** Must be one of the `itemIds` of the parent `WfoSortableList`. */
  id: string;
  /** Accessible name and tooltip of the drag handle, for example "Reorder Failed tasks". */
  handleLabel: string;
  /**
   * inline: the handle sits left of the content and is always visible.
   * edge: the handle hangs half over the left edge of the content and shows on hover or focus.
   * It is centered on the item; set `--wfo-drag-handle-top` to center it on something else, for example a header.
   */
  handlePlacement?: 'inline' | 'edge';
  className?: string;
  children: ReactNode;
};

/** One reorderable item inside a `WfoSortableList`. It brings its own drag handle. */
export const WfoSortableItem: FC<WfoSortableItemProps> = ({
  id,
  handleLabel,
  handlePlacement = 'inline',
  className,
  children,
}) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id,
    transition: { duration: SORTABLE_SETTLE_DURATION_MS, easing: SORTABLE_SETTLE_EASING },
  });

  // The drag library gives a new position on every pointer move. This is the only inline style:
  // it hands those runtime values to the CSS module as variables.
  const motionVariables = {
    '--wfo-sortable-transform': CSS.Translate.toString(transform) ?? 'none',
    '--wfo-sortable-transition': transition ?? 'none',
  } as CSSProperties;

  return (
    <div
      ref={setNodeRef}
      data-sortable-id={id}
      data-handle-placement={handlePlacement}
      className={joinClassNames(styles.root, isDragging && styles.dragging, className)}
      style={motionVariables}
    >
      <button
        type="button"
        aria-label={handleLabel}
        title={handleLabel}
        {...attributes}
        {...listeners}
        ref={setActivatorNodeRef}
        className={styles.handle}
      >
        <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor" aria-hidden="true">
          {[3, 8, 13].flatMap((dotY) =>
            [2.5, 7.5].map((dotX) => <circle key={`${dotX}-${dotY}`} cx={dotX} cy={dotY} r="1.25" />),
          )}
        </svg>
      </button>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
