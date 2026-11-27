import React, { Children, FC, ReactNode, useId } from 'react';

import { WfoSkeleton } from '../../feedback/WfoSkeleton';
import styles from './WfoList.module.css';

export type WfoListProps = {
  /** Shown above the list. It also names the list for screen readers. */
  title?: ReactNode;
  /** Shown when there are no items, for example "No items". */
  emptyText: ReactNode;
  /** Shows placeholder lines instead of the items. */
  isLoading?: boolean;
  /** `WfoListItem`s. */
  children?: ReactNode;
};

/** A short list of items with a line between them, for example the latest workflows. */
export const WfoList: FC<WfoListProps> = ({ title, emptyText, isLoading = false, children }) => {
  const titleId = useId();
  const hasItems = Children.toArray(children).length > 0;

  return (
    <div className={styles.root}>
      {title && (
        <div id={titleId} className={styles.title}>
          {title}
        </div>
      )}
      <WfoSkeleton isLoading={isLoading}>
        {hasItems ?
          <ul aria-labelledby={title ? titleId : undefined} className={styles.list}>
            {children}
          </ul>
        : <p className={styles.secondary}>{emptyText}</p>}
      </WfoSkeleton>
    </div>
  );
};

export type WfoListItemProps = {
  /** The main text, for example a `WfoLink`. */
  children: ReactNode;
  /** Smaller grey text below the main text, for example a date. */
  description?: ReactNode;
};

export const WfoListItem: FC<WfoListItemProps> = ({ children, description }) => (
  <li className={styles.item}>
    {children}
    {description && <div className={styles.secondary}>{description}</div>}
  </li>
);
