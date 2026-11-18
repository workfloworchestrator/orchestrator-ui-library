import React, { useContext } from 'react';

import { useTranslations } from 'next-intl';

import { EuiButton, EuiButtonProps } from '@elastic/eui';

import { PolicyResource } from '@/configuration/policy-resources';
import { ConfirmationDialogContext } from '@/contexts';
import { useCheckEngineStatus, usePolicy } from '@/hooks';
import { WfoRefresh, WfoXCircleFill } from '@/icons';
import { ProcessBulkAction } from '@/types';

import type { ProcessListItem } from './WfoProcessesList';
import { useBulkProcessAction } from './useBulkProcessAction';
import { isProcessAbortable, isProcessDeletable, isProcessRetryable } from './utils';

export type WfoConfirmedBulkProcessAction = Exclude<ProcessBulkAction, 'note'>;

type BulkProcessActionConfig = {
  policyResource: PolicyResource;
  canApplyTo: (process: ProcessListItem) => boolean;
  needsRunningEngine: boolean;
  iconType: EuiButtonProps['iconType'];
  color?: EuiButtonProps['color'];
};

const bulkProcessActionConfigs: Record<WfoConfirmedBulkProcessAction, BulkProcessActionConfig> = {
  resume: {
    policyResource: PolicyResource.PROCESS_RETRY,
    canApplyTo: isProcessRetryable,
    needsRunningEngine: true,
    iconType: () => <WfoRefresh width={16} height={16} color="currentColor" />,
  },
  abort: {
    policyResource: PolicyResource.PROCESS_ABORT,
    canApplyTo: isProcessAbortable,
    needsRunningEngine: true,
    iconType: () => <WfoXCircleFill width={16} height={16} color="currentColor" />,
    color: 'danger',
  },
  delete: {
    policyResource: PolicyResource.PROCESS_DELETE,
    canApplyTo: isProcessDeletable,
    needsRunningEngine: false,
    iconType: 'trash',
    color: 'danger',
  },
};

export type WfoBulkProcessActionButtonProps = {
  action: WfoConfirmedBulkProcessAction;
  selectedProcesses: ProcessListItem[];
  onActionDone: () => void;
};

export const WfoBulkProcessActionButton = ({
  action,
  selectedProcesses,
  onActionDone,
}: WfoBulkProcessActionButtonProps) => {
  const t = useTranslations(`tasks.bulkActions.${action}`);
  const { isAllowed } = usePolicy();
  const { showConfirmDialog } = useContext(ConfirmationDialogContext);
  const { isEngineRunningNow } = useCheckEngineStatus();
  const { runBulkProcessAction, isLoading } = useBulkProcessAction(action, onActionDone);
  const { policyResource, canApplyTo, needsRunningEngine, iconType, color } = bulkProcessActionConfigs[action];

  if (!isAllowed(policyResource)) {
    return null;
  }

  const applicableProcesses = selectedProcesses.filter(canApplyTo);
  const skippedProcessCount = selectedProcesses.length - applicableProcesses.length;

  const handleClick = async () => {
    if (needsRunningEngine && !(await isEngineRunningNow())) {
      return;
    }

    showConfirmDialog({
      question: t('question', { count: applicableProcesses.length }),
      subQuestion: skippedProcessCount > 0 ? t('skipped', { count: skippedProcessCount }) : undefined,
      confirmButtonText: t('button'),
      onConfirm: () => runBulkProcessAction(applicableProcesses),
    });
  };

  return (
    <EuiButton
      size="s"
      color={color}
      iconType={iconType}
      isLoading={isLoading}
      isDisabled={applicableProcesses.length === 0}
      onClick={handleClick}
    >
      {t('button')}
    </EuiButton>
  );
};
