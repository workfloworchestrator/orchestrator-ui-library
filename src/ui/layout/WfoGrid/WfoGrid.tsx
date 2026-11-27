import React, {
  CSSProperties,
  Children,
  FC,
  ReactNode,
  RefObject,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { joinClassNames } from '@/utils/joinClassNames';

import { WfoSpace, toSpaceValue } from '../space';
import styles from './WfoGrid.module.css';

export type WfoGridProps = {
  /** The items. Each item is one cell. */
  children: ReactNode;
  /** Most columns at full width. Without it, as many columns as fit. A column is never narrower than `--wfo-size-grid-column-min-width`. */
  maxColumns?: number;
  /**
   * `rows`: items in the same row share its height.
   * `masonry`: each column stacks on its own, so a growing item (for example an open card) only pushes down the items
   * below it. Items still fill row by row: item 1 -> column 1, item 2 -> column 2, ...
   */
  layout?: 'rows' | 'masonry';
  /** Space between rows and columns, as a space token. */
  gap?: WfoSpace;
};

// Measure before the browser paints, so the columns do not jump. On the server there is nothing to measure.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** The column min width when the token is missing. Keep it the same as --wfo-size-grid-column-min-width. */
const FALLBACK_COLUMN_MIN_WIDTH = 320;

/** Fits as many columns as the width allows, up to `maxColumns`. Only masonry needs the count in JavaScript. */
const useMasonryColumnCount = (gridRef: RefObject<HTMLDivElement | null>, maxColumns = Infinity) => {
  const [columnCount, setColumnCount] = useState(Number.isFinite(maxColumns) ? maxColumns : 1);

  useIsomorphicLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || typeof ResizeObserver === 'undefined') return;

    const updateColumnCount = () => {
      const gridStyles = getComputedStyle(grid);
      const columnMinWidth =
        parseFloat(gridStyles.getPropertyValue('--wfo-size-grid-column-min-width')) || FALLBACK_COLUMN_MIN_WIDTH;
      const gap = parseFloat(gridStyles.columnGap) || 0;
      const fittingColumnCount = Math.floor((grid.clientWidth + gap) / (columnMinWidth + gap));
      setColumnCount(Math.min(maxColumns, Math.max(1, fittingColumnCount)));
    };

    updateColumnCount();
    const resizeObserver = new ResizeObserver(updateColumnCount);
    resizeObserver.observe(grid);
    return () => resizeObserver.disconnect();
  }, [gridRef, maxColumns]);

  return columnCount;
};

const haveSameValues = (firstNumbers: number[], secondNumbers: number[]) =>
  firstNumbers.length === secondNumbers.length
  && firstNumbers.every((number, index) => number === secondNumbers[index]);

/**
 * The height of each item, in rows of 1px, gap included. 0 for an item that shows nothing.
 * null until measured: then the grid lays out in plain rows.
 */
const useMasonryItemSpans = (gridRef: RefObject<HTMLDivElement | null>, itemCount: number) => {
  const [itemSpans, setItemSpans] = useState<number[] | null>(null);

  const measureItemSpans = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
    const measuredItemSpans = Array.from(grid.children, (gridItem) => {
      const itemHeight = gridItem.getBoundingClientRect().height;
      return itemHeight > 0 ? Math.ceil(itemHeight + gap) : 0;
    });
    setItemSpans((currentItemSpans) =>
      currentItemSpans && haveSameValues(currentItemSpans, measuredItemSpans) ? currentItemSpans : measuredItemSpans,
    );
  }, [gridRef]);

  // After every render: the order of the items may have changed. Nothing renders again when the spans stay the same.
  useIsomorphicLayoutEffect(measureItemSpans);

  // When an item changes height, for example a card that opens.
  useIsomorphicLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || typeof ResizeObserver === 'undefined') return;
    const resizeObserver = new ResizeObserver(measureItemSpans);
    Array.from(grid.children, (gridItem) => resizeObserver.observe(gridItem));
    return () => resizeObserver.disconnect();
  }, [gridRef, itemCount, measureItemSpans]);

  return itemSpans;
};

/**
 * The items stay in their own order in the DOM (row by row), so the Tab order and screen readers follow what you see.
 * Item n goes to column n % columnCount. Each item starts right below the item above it in its column.
 */
const MasonryGrid: FC<Omit<WfoGridProps, 'layout' | 'gap'> & { style: CSSProperties }> = ({
  children,
  maxColumns,
  style,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridItems = Children.toArray(children);
  const columnCount = useMasonryColumnCount(gridRef, maxColumns);
  const itemSpans = useMasonryItemSpans(gridRef, gridItems.length);

  const nextFreeRowByColumn = Array.from({ length: columnCount }, () => 1);
  const getItemPlacement = (itemIndex: number): CSSProperties => {
    const columnIndex = itemIndex % columnCount;
    if (!itemSpans) return { gridColumn: columnIndex + 1 };
    const itemSpan = itemSpans[itemIndex] ?? 0;
    const rowStart = nextFreeRowByColumn[columnIndex];
    nextFreeRowByColumn[columnIndex] += itemSpan;
    return { gridColumn: columnIndex + 1, gridRow: `${rowStart} / span ${Math.max(itemSpan, 1)}` };
  };

  return (
    <div
      ref={gridRef}
      className={joinClassNames(styles.masonry, itemSpans && styles.measured)}
      style={{ ...style, '--wfo-grid-column-count': columnCount } as CSSProperties}
    >
      {gridItems.map((gridItem, itemIndex) => (
        // A stable key: an item that moves to another column keeps its state and does not mount again.
        <div
          key={isValidElement(gridItem) ? gridItem.key : itemIndex}
          className={styles.item}
          style={getItemPlacement(itemIndex)}
        >
          {gridItem}
        </div>
      ))}
    </div>
  );
};

/** Responsive grid. The number of columns follows the available width; you only set a maximum. */
export const WfoGrid: FC<WfoGridProps> = ({ children, maxColumns, layout = 'rows', gap = 300 }) => {
  const gapStyle = { '--wfo-grid-gap': toSpaceValue(gap) } as CSSProperties;

  return layout === 'masonry' ?
      <MasonryGrid maxColumns={maxColumns} style={gapStyle}>
        {children}
      </MasonryGrid>
    : <div
        className={styles.rows}
        style={{ ...gapStyle, ...(maxColumns && { '--wfo-grid-max-columns': maxColumns }) } as CSSProperties}
      >
        {children}
      </div>;
};
