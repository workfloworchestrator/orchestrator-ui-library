import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiButtonIcon, EuiLoadingSpinner, EuiPanel, EuiPopover } from '@elastic/eui';

import { ProcessListItem, WfoToolTip } from '@/components';
import WfoDiff, { getSubscriptionDiffTexts } from '@/components/WfoDiff/WfoDiff';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoCode } from '@/icons';
import { useGetRawProcessDetailQuery } from '@/rtk/endpoints/processDetail';
import { WorkflowTarget } from '@/types';

import { getWfoProcessListDeltaPopoverStyles } from './styles';

interface WfoProcessListDeltaPopoverProps {
  processListItem: ProcessListItem;
}

export const WfoProcessListDeltaPopover: FC<WfoProcessListDeltaPopoverProps> = ({ processListItem }) => {
  const { theme } = useOrchestratorTheme();
  const { popoverPanelStyle, deltaContentPanelStyle, loadingSpinnerStyle } = useWithOrchestratorTheme(
    getWfoProcessListDeltaPopoverStyles,
  );
  const t = useTranslations('processes.steps');
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const { processId, workflowTarget } = processListItem;

  const { data, isFetching } = useGetRawProcessDetailQuery({ processId }, { skip: !isPopoverOpen });

  if (workflowTarget !== WorkflowTarget.MODIFY) {
    return null;
  }

  const { oldText, newText } = getSubscriptionDiffTexts(data);

  const iconButton = (
    <EuiButtonIcon
      iconType={() => <WfoCode color={theme.colors.textDisabled} />}
      onClick={() => setPopoverOpen(!isPopoverOpen)}
      aria-label={t('showDelta')}
      isLoading={isFetching}
    />
  );

  const button = isPopoverOpen ? iconButton : <WfoToolTip tooltipContent={t('showDelta')}>{iconButton}</WfoToolTip>;

  const SubscriptionDeltaContent = () => <WfoDiff oldText={oldText} newText={newText} syntax="javascript" />;

  return (
    <EuiPopover
      id={`delta-${processId}`}
      button={button}
      isOpen={isPopoverOpen}
      closePopover={() => setPopoverOpen((isPopoverOpen) => !isPopoverOpen)}
      panelPaddingSize="s"
      hasArrow
      ownFocus
      repositionOnScroll
      panelStyle={popoverPanelStyle}
    >
      <EuiPanel color="transparent" paddingSize="s" css={deltaContentPanelStyle}>
        {isFetching ?
          <div css={loadingSpinnerStyle}>
            <EuiLoadingSpinner size="xl" />
          </div>
        : <SubscriptionDeltaContent />}
      </EuiPanel>
    </EuiPopover>
  );
};
