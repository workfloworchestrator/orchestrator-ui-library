import React, { useId } from 'react';

import { useTranslations } from 'next-intl';

import { WfoEdgeTab } from '@/components/WfoWorkflowUserGuide/WfoEdgeTab';
import { WfoWorkflowGuideMarkdown } from '@/components/WfoWorkflowUserGuide/WfoWorkflowGuideExpandablePanel';
import { useWithOrchestratorTheme } from '@/hooks';

import { EDGE_TAB_WIDTH, getTuckedGuideStyles } from './styles';

// New layout only (start workflow + process detail). The current layout uses WfoWorkflowGuideExpandablePanel.
// To go back to the current layout, stop using this file; nothing else depends on it.

// React 18 passes unknown attributes through as strings; its types only know the React 19 boolean form
const inertWhen = (on: boolean) => (on ? ({ inert: '' } as object) : {});

const TUCKED_GUIDE_STRIP_WIDTH = EDGE_TAB_WIDTH;
export const TUCKED_GUIDE_MIN_WIDTH = 480; // open guide incl. strip: room for ~55 characters of guide text
export const TUCKED_GUIDE_OPEN_WIDTH = 'min(552px, 45vw)'; // for a column that grows when the guide opens

/*
 * Guide as a page tucked under the content panel: a strip sticks to the right edge of the panel (reachable by
 * moving straight right from any field), and the guide panel slides out from behind the panel.
 * The content never moves; the open guide fills the space right of it.
 *
 * Put it in its own grid column: the tab sits at the edge of the content next to it, in the middle of the screen.
 * The column is either fixed (the guide then fills it) or grows from the strip width to openWidth when the guide
 * opens (pass openWidth, the same value the column grows to).
 * Closed, the strip is that high. Open, the guide is one screen high and sticks while the page scrolls.
 * Set --wfo-guide-sticky-top on a parent when the page has its own sticky header.
 */
export const WfoTuckedGuide = ({
  workflowName,
  isOpen,
  onToggle,
  openWidth,
  stripWidth = TUCKED_GUIDE_STRIP_WIDTH,
  tabSize = 'tall',
  tabAttached = true,
}: {
  workflowName: string;
  isOpen: boolean;
  onToggle: () => void;
  openWidth?: string;
  /** Width of the strip (px). Use the same value for the grid column; a narrower strip takes less room from the content. */
  stripWidth?: number;
  /** tall: fills the free screen (big target). compact: a small tab in the middle (less visual weight). */
  tabSize?: 'tall' | 'compact';
  /** false: while closed the tab floats with a gap and round corners, for content that has no panel to attach to (include the gap in stripWidth). Open, it always touches the guide. */
  tabAttached?: boolean;
}) => {
  const t = useTranslations('workflowGuide');
  const { containerStyle, getSliderStyle, getGuideSectionStyle, getTabBoxStyle } =
    useWithOrchestratorTheme(getTuckedGuideStyles);
  const guideId = useId();

  return (
    <div css={containerStyle}>
      <div css={getSliderStyle({ isOpen, openWidth, stripWidth })}>
        <section id={guideId} aria-label={t('title')} {...inertWhen(!isOpen)} css={getGuideSectionStyle(isOpen)}>
          {/* Same guide panel as the current layout; mounted while closed so the slide shows content */}
          <WfoWorkflowGuideMarkdown workflowName={workflowName} isBigScreen />
        </section>
        {/*
          The tab sits in an invisible box that is as high as the panel (short panel) or the free screen (long page
          or open guide) and sticks, so the tab stays in view in the middle of the free screen. The tab fills this
          box minus a small gap, so it is as high as possible without looking like part of the panel.
          The box is a div, not the button: sticky inside a button is unreliable.
        */}
        <div css={getTabBoxStyle({ isOpen, stripWidth })}>
          <WfoEdgeTab
            // Not the "info" icon: the page title already has one for the workflow information link
            size={tabSize}
            attached={tabAttached || isOpen}
            icon={isOpen ? 'chevronSingleLeft' : 'documentation'}
            label={isOpen ? t('hide') : t('show')}
            onClick={onToggle}
            ariaExpanded={isOpen}
            ariaControls={guideId}
          />
        </div>
      </div>
    </div>
  );
};
