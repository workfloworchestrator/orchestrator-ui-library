import React, { FC, ReactNode } from 'react';

import { joinClassNames } from '@/utils/joinClassNames';

import type { WfoStatusColor } from '../../statusColor';
import styles from './WfoIconTile.module.css';

export type WfoIconTileProps = {
  /** The color set: the tile is filled with its icon color. */
  color: WfoStatusColor;
  /** The glyph. It is drawn in the page background color on top of the tile color. */
  children: ReactNode;
};

/** A square colored tile with an icon. It shows the status of what is next to it. Screen readers skip it. */
export const WfoIconTile: FC<WfoIconTileProps> = ({ color, children }) => (
  <span aria-hidden="true" data-color={color} className={joinClassNames(styles.root, styles[color])}>
    {children}
  </span>
);
