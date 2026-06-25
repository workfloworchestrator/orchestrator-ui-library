import React, { ReactNode } from 'react';

import { useTranslations } from 'next-intl';

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiIcon,
  EuiLoadingSpinner,
  EuiMarkdownFormat,
  EuiPanel,
  EuiText,
  EuiTitle,
} from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';
import { useGetWorkflowGuideQuery } from '@/rtk';

import { getStyles } from './styles';

interface WfoWorkflowUserGuideProps {
  workflowName: string;
  isExpanded: boolean;
  onToggle: () => void;
}

interface WfoUserGuideToggleStripProps {
  onToggle: () => void;
  ariaLabel: string;
  noLeftBorder?: boolean;
  children: ReactNode;
}

// A thin, full-height clickable strip used to expand the guide (collapsed state) or collapse
// it (expanded state). The icon(s) it shows are passed as children.
const WfoWorkflowGuideToggleStrip = ({ onToggle, ariaLabel, noLeftBorder, children }: WfoUserGuideToggleStripProps) => {
  const { fullHeightStyle, toggleStripContainerStyle, toggleStripPanelStyle, noLeftBorderStyle } =
    useWithOrchestratorTheme(getStyles);

  return (
    <EuiFlexItem grow={false} onClick={onToggle} aria-label={ariaLabel} css={toggleStripContainerStyle}>
      <EuiPanel hasShadow={false} css={[toggleStripPanelStyle, noLeftBorder && noLeftBorderStyle]}>
        <EuiFlexGroup
          direction="column"
          alignItems="center"
          gutterSize="s"
          justifyContent="center"
          css={fullHeightStyle}
        >
          {children}
        </EuiFlexGroup>
      </EuiPanel>
    </EuiFlexItem>
  );
};

const WfoWorkflowGuideMarkdown = ({ workflowName }: { workflowName: string }) => {
  const t = useTranslations('workflowGuide');
  const { guideBodyStyle } = useWithOrchestratorTheme(getStyles);
  const { data, isLoading, isError } = useGetWorkflowGuideQuery({ workflowName });
  const content = data?.content ?? '';

  return (
    <div css={guideBodyStyle}>
      {(isLoading && <EuiLoadingSpinner size="m" />)
        || ((isError || !content) && <EuiText color="subdued">{t('noGuideAvailable')}</EuiText>) || (
          <EuiMarkdownFormat>{content}</EuiMarkdownFormat>
        )}
    </div>
  );
};

export const WfoWorkflowGuideExpandablePanel = ({ workflowName, isExpanded, onToggle }: WfoWorkflowUserGuideProps) => {
  const t = useTranslations('workflowGuide');
  const { fullHeightStyle, guidePanelStyle } = useWithOrchestratorTheme(getStyles);

  const OpenGuideButton = () => (
    <>
      <EuiFlexItem grow={false}>
        <EuiIcon type="arrowLeft" size="l" color="primary" />
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiIcon type="info" size="xl" color="primary" />
      </EuiFlexItem>
    </>
  );

  const CloseGuideButton = () => (
    <EuiFlexItem grow={false}>
      <EuiIcon type="arrowRight" size="l" color="primary" />
    </EuiFlexItem>
  );

  if (!isExpanded) {
    return (
      <WfoWorkflowGuideToggleStrip onToggle={onToggle} ariaLabel={t('show')}>
        <OpenGuideButton />
      </WfoWorkflowGuideToggleStrip>
    );
  }

  return (
    <EuiFlexItem grow={1}>
      <EuiFlexGroup gutterSize="none" css={fullHeightStyle}>
        <EuiPanel paddingSize="m" hasShadow css={guidePanelStyle}>
          <EuiTitle>
            <h3>{t('title', { workflowName })}</h3>
          </EuiTitle>
          <EuiHorizontalRule margin="s" />
          <WfoWorkflowGuideMarkdown workflowName={workflowName} />
        </EuiPanel>

        <WfoWorkflowGuideToggleStrip onToggle={onToggle} ariaLabel={t('hide')} noLeftBorder>
          <CloseGuideButton />
        </WfoWorkflowGuideToggleStrip>
      </EuiFlexGroup>
    </EuiFlexItem>
  );
};
