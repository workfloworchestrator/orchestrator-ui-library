import React, { useContext } from 'react';

import { useTranslations } from 'next-intl';

import { EuiButton } from '@elastic/eui';

import { PolicyResource } from '@/configuration/policy-resources';
import { ConfirmationDialogContext } from '@/contexts';
import { useCheckEngineStatus, usePolicy, useShowToastMessage } from '@/hooks';
import { WfoRefresh } from '@/icons';
import { useBulkProcessActionMutation } from '@/rtk/endpoints/processDetail';
import { getErrorDetail } from '@/rtk/utils';
import { ToastTypes } from '@/types';

import type { ProcessListItem } from './WfoProcessesList';
import { isProcessRetryable } from './utils';

export type WfoRetrySelectedTasksButtonProps = {
  selectedTasks: ProcessListItem[];
  onRetryStarted: () => void;
};

export const WfoRetrySelectedTasksButton = ({ selectedTasks, onRetryStarted }: WfoRetrySelectedTasksButtonProps) => {
  const t = useTranslations('tasks.page');
  const { isAllowed } = usePolicy();
  const { showConfirmDialog } = useContext(ConfirmationDialogContext);
  const { isEngineRunningNow } = useCheckEngineStatus();
  const { showToastMessage } = useShowToastMessage();
  const [bulkProcessAction] = useBulkProcessActionMutation();

  if (!isAllowed(PolicyResource.PROCESS_RETRY)) {
    return null;
  }

  const retryableTasks = selectedTasks.filter(isProcessRetryable);
  const skippedTaskCount = selectedTasks.length - retryableTasks.length;

  const retryTasks = async () => {
    try {
      const { count } = await bulkProcessAction({
        action: 'resume',
        processIds: retryableTasks.map(({ processId }) => processId),
      }).unwrap();
      showToastMessage(ToastTypes.SUCCESS, t('retrySelectedStartedText', { count }), t('retrySelectedStartedTitle'));
      onRetryStarted();
    } catch (error) {
      showToastMessage(
        ToastTypes.ERROR,
        getErrorDetail(error) ?? t('retrySelectedFailedText', { count: retryableTasks.length }),
        t('retrySelectedFailedTitle'),
      );
    }
  };

  const handleRetrySelectedClick = async () => {
    if (!(await isEngineRunningNow())) {
      return;
    }

    showConfirmDialog({
      question: t('retrySelectedQuestion', { count: retryableTasks.length }),
      subQuestion: skippedTaskCount > 0 ? t('retrySelectedSkipped', { count: skippedTaskCount }) : undefined,
      onConfirm: () => retryTasks(),
    });
  };

  return (
    <EuiButton
      size="s"
      iconType={() => <WfoRefresh width={16} height={16} color="currentColor" />}
      isDisabled={retryableTasks.length === 0}
      onClick={handleRetrySelectedClick}
    >
      {t('retrySelected')}
    </EuiButton>
  );
};
