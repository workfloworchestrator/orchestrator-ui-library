import React, { CSSProperties, FC, ReactNode } from 'react';

import { joinClassNames } from '@/utils/joinClassNames';

import { WfoSpace, toSpaceValue } from '../space';
import styles from './WfoPanel.module.css';

export type WfoPanelProps = {
  /** The content of the panel. */
  children: ReactNode;
  /** Space inside the panel, as a space token. 0 when the content sets its own padding, for example a card with a full-width header. */
  padding?: WfoSpace;
  className?: string;
};

/** A bordered surface that groups content. Replaces EuiPanel. */
export const WfoPanel: FC<WfoPanelProps> = ({ children, padding = 200, className }) => (
  <div
    className={joinClassNames(styles.root, className)}
    style={{ '--wfo-panel-padding': toSpaceValue(padding) } as CSSProperties}
  >
    {children}
  </div>
);
