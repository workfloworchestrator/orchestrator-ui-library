import React from 'react';

import { keyframes } from '@emotion/react';

const SIZE = 14;
const STROKE_WIDTH = 2;
const CENTER = SIZE / 2;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const sweep = keyframes({
  from: { strokeDashoffset: CIRCUMFERENCE },
  to: { strokeDashoffset: 0 },
});

interface WfoDebounceCountdownProps {
  durationMs: number;
}

/**
 * Ring that fills over `durationMs`, showing how long is left before the pending search runs.
 * Render it with a key that changes per scheduled run, so the sweep restarts from empty every
 * time an edit pushes the debounce back.
 */
export const WfoDebounceCountdown = ({ durationMs }: WfoDebounceCountdownProps) => (
  <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true" css={{ flex: 'none' }}>
    <circle
      cx={CENTER}
      cy={CENTER}
      r={RADIUS}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      opacity={0.3}
    />
    <circle
      cx={CENTER}
      cy={CENTER}
      r={RADIUS}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
      strokeDasharray={CIRCUMFERENCE}
      // Start the sweep at 12 o'clock instead of 3 o'clock.
      transform={`rotate(-90 ${CENTER} ${CENTER})`}
      css={{
        strokeDashoffset: CIRCUMFERENCE,
        animation: `${sweep} ${durationMs}ms linear forwards`,
        // A ring that jumps straight to full is still an honest "a search is queued" marker.
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
          strokeDashoffset: 0,
        },
      }}
    />
  </svg>
);
