import React, { FC, ReactNode } from 'react';

import styles from './WfoSkeleton.module.css';

export type WfoSkeletonProps = {
  /** Shows the placeholder lines instead of the children. */
  isLoading: boolean;
  /** Number of placeholder text lines. */
  lines?: number;
  /** Shown when loading is done. */
  children: ReactNode;
};

/** Grey placeholder lines while content loads. Replaces EuiSkeletonText. */
export const WfoSkeleton: FC<WfoSkeletonProps> = ({ isLoading, lines = 3, children }) =>
  isLoading ?
    <div aria-busy="true" className={styles.root}>
      {Array.from({ length: lines }, (_, lineIndex) => (
        <span key={lineIndex} className={styles.line} />
      ))}
    </div>
  : children;
