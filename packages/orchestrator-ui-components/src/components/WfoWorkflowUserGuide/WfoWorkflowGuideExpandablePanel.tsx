import React, { ReactNode } from 'react';

import { useTranslations } from 'next-intl';

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiLoadingSpinner,
  EuiMarkdownFormat,
  EuiPanel,
  EuiText,
  useIsWithinBreakpoints,
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
  isBigScreen: boolean;
  noLeadingBorder?: boolean;
  sticky?: boolean;
  children: ReactNode;
}

const WfoWorkflowGuideToggleStrip = ({
  onToggle,
  ariaLabel,
  isBigScreen,
  noLeadingBorder,
  sticky,
  children,
}: WfoUserGuideToggleStripProps) => {
  const {
    fullHeightStyle,
    stickyStripContainerStyle,
    stripIconStyle,
    stickyPanelFillStyle,
    toggleStripContainerStyle,
    toggleStripContainerHorizontalStyle,
    stickyHorizontalStripContainerStyle,
    toggleStripPanelStyle,
    noLeftBorderStyle,
    noBottomBorderStyle,
  } = useWithOrchestratorTheme(getStyles);

  const containerStyle =
    isBigScreen ?
      sticky ? stickyStripContainerStyle
      : toggleStripContainerStyle
    : sticky ? stickyHorizontalStripContainerStyle
    : toggleStripContainerHorizontalStyle;

  return (
    <EuiFlexItem grow={false} onClick={onToggle} aria-label={ariaLabel} css={containerStyle}>
      <EuiPanel
        hasShadow={false}
        css={[
          toggleStripPanelStyle,
          sticky && stickyPanelFillStyle,
          noLeadingBorder && (isBigScreen ? noLeftBorderStyle : noBottomBorderStyle),
        ]}
      >
        {isBigScreen ?
          <div css={stripIconStyle}>{children}</div>
        : <EuiFlexGroup
            direction="row"
            alignItems="center"
            gutterSize="s"
            justifyContent="center"
            css={fullHeightStyle}
          >
            {children}
          </EuiFlexGroup>
        }
      </EuiPanel>
    </EuiFlexItem>
  );
};

const WfoWorkflowGuideMarkdown = ({ workflowName, isBigScreen }: { workflowName: string; isBigScreen: boolean }) => {
  const t = useTranslations('workflowGuide');
  const { guideBodyStyle, guidePanelStyle, guideStackedBodyStyle, guideStackedPanelStyle } =
    useWithOrchestratorTheme(getStyles);
  const { data, isLoading, isError } = useGetWorkflowGuideQuery({ workflowName });
  const content = data?.content ?? '';

  return (
    <div css={isBigScreen ? guideBodyStyle : guideStackedBodyStyle}>
      {(isLoading && <EuiLoadingSpinner size="m" />) || (
        <EuiPanel paddingSize="m" hasShadow css={isBigScreen ? guidePanelStyle : guideStackedPanelStyle}>
          {((isError || !content) && <EuiText color="subdued">{t('noGuideAvailable')}</EuiText>) || (
            <EuiMarkdownFormat>{content}</EuiMarkdownFormat>
          )}
        </EuiPanel>
      )}
    </div>
  );
};

export const WfoWorkflowGuideExpandablePanel = ({ workflowName, isExpanded, onToggle }: WfoWorkflowUserGuideProps) => {
  const t = useTranslations('workflowGuide');
  const { fullHeightStyle, guideExpandedItemStyle, guideExpandedFillStyle } = useWithOrchestratorTheme(getStyles);
  const isBigScreen = useIsWithinBreakpoints(['xl', 'xxl']);

  const OpenGuideButton = () => <EuiIcon type={'info'} size="xxl" color="primary" />;

  const CloseGuideButton = () => (
    <EuiFlexItem grow={false}>
      <EuiIcon type={isBigScreen ? 'arrowRight' : 'arrowUp'} size="xl" color="primary" />
    </EuiFlexItem>
  );

  if (!isExpanded) {
    return (
      <WfoWorkflowGuideToggleStrip onToggle={onToggle} ariaLabel={t('show')} isBigScreen={isBigScreen} sticky>
        <OpenGuideButton />
      </WfoWorkflowGuideToggleStrip>
    );
  }

  if (isBigScreen) {
    return (
      <EuiFlexItem grow={1} css={guideExpandedItemStyle}>
        <EuiFlexGroup gutterSize="none" css={[fullHeightStyle, guideExpandedFillStyle]}>
          <WfoWorkflowGuideMarkdown workflowName={workflowName} isBigScreen />
          <WfoWorkflowGuideToggleStrip onToggle={onToggle} ariaLabel={t('hide')} isBigScreen noLeadingBorder>
            <CloseGuideButton />
          </WfoWorkflowGuideToggleStrip>
        </EuiFlexGroup>
      </EuiFlexItem>
    );
  }

  return (
    <EuiFlexItem grow={false}>
      <EuiFlexGroup direction="column" gutterSize="none">
        <WfoWorkflowGuideToggleStrip
          onToggle={onToggle}
          ariaLabel={t('hide')}
          isBigScreen={isBigScreen}
          noLeadingBorder
        >
          <CloseGuideButton />
        </WfoWorkflowGuideToggleStrip>
        <WfoWorkflowGuideMarkdown workflowName={workflowName} isBigScreen />
      </EuiFlexGroup>
    </EuiFlexItem>
  );
};
