import React, { FC } from 'react';

import styles from './WfoSpinner.module.css';

export type WfoSpinnerProps = {
  /** Read by screen readers, for example "Updating". */
  label: string;
};

/** Small busy indicator. It is as big as the text around it (1em). Replaces EuiLoadingSpinner. */
export const WfoSpinner: FC<WfoSpinnerProps> = ({ label }) => (
  <span role="status" aria-label={label} className={styles.root} />
);
