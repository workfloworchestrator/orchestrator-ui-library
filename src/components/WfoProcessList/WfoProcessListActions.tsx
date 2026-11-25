import React, { FC, useContext, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiButtonIcon, EuiContextMenuItem } from '@elastic/eui';

import { WfoPopover } from '@/components';
import { PolicyResource } from '@/configuration/policy-resources';
import { ConfirmationDialogContext } from '@/contexts';
import { useCheckEngineStatus, useOrchestratorTheme, usePolicy, useWithOrchestratorTheme } from '@/hooks';
import { WfoRefresh } from '@/icons';
import { WfoDotsHorizontal } from '@/icons/WfoDotsHorizontal';
import { useRetryProcessMutation } from '@/rtk/endpoints/processDetail';
import { ProcessRetryableStatuses } from '@/types';
import { listIncludesStatus } from '@/utils';

import type { ProcessListItem } from './WfoProcessesList';
import { getProcessActionStyles } from './styles';

interface WfoProcessListActionsProps {
  processListItem: ProcessListItem;
}

// One rule for "can this row be retried", shared by the row menu and the list (to hide an empty column)
export const useIsProcessRetryAllowed = () => {
  const { isAllowed } = usePolicy();

  return ({ lastStatus, userPermissions }: ProcessListItem) =>
    isAllowed(PolicyResource.PROCESS_RETRY)
    && userPermissions?.retryAllowed === true
    && listIncludesStatus(ProcessRetryableStatuses, lastStatus);
};

export const WfoProcessListActions: FC<WfoProcessListActionsProps> = ({ processListItem }) => {
  const t = useTranslations('processes.detail');
  const { theme } = useOrchestratorTheme();
  const { linkMenuItemStyle, iconStyle } = useWithOrchestratorTheme(getProcessActionStyles);
  const { showConfirmDialog } = useContext(ConfirmationDialogContext);
  const { isEngineRunningNow } = useCheckEngineStatus();
  const isProcessRetryAllowed = useIsProcessRetryAllowed();
  const [retryProcess] = useRetryProcessMutation();
  const [isPopoverOpen, setPopover] = useState<boolean>(false);

  const { processId, workflowName, isTask } = processListItem;

  if (!isProcessRetryAllowed(processListItem)) {
    return null;
  }

  const handleRetryClick = async () => {
    setPopover(false);

    if (!(await isEngineRunningNow())) {
      return;
    }

    showConfirmDialog({
      question: t(isTask ? 'retryTaskQuestion' : 'retryWorkflowQuestion', { workflowName }),
      onConfirm: () => retryProcess({ processId }),
    });
  };

  const button = (
    <EuiButtonIcon
      iconType={() => <WfoDotsHorizontal color={theme.colors.textDisabled} />}
      onClick={() => setPopover(!isPopoverOpen)}
      aria-label="Row context menu"
    />
  );

  const MenuItemsList = () => (
    <div css={linkMenuItemStyle} onClick={handleRetryClick}>
      <EuiContextMenuItem
        icon={
          <div css={iconStyle}>
            <WfoRefresh color={theme.colors.link} />
          </div>
        }
        css={{ whiteSpace: 'nowrap' }}
      >
        {t('retry')}
      </EuiContextMenuItem>
    </div>
  );

  return (
    <WfoPopover
      id={`processActionPopover-${processId}`}
      isLoading={false}
      button={button}
      PopoverContent={MenuItemsList}
      isPopoverOpen={isPopoverOpen}
      closePopover={() => setPopover(false)}
    />
  );
};
