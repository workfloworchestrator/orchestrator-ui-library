import { useTranslations } from 'next-intl';

import { useShowToastMessage } from '@/hooks';
import { useBulkProcessActionMutation } from '@/rtk/endpoints/processDetail';
import { getErrorDetail } from '@/rtk/utils';
import { ProcessBulkAction, ToastTypes } from '@/types';

import type { ProcessListItem } from './WfoProcessesList';

export type WfoBulkProcessAction = 'retry' | 'abort' | 'delete' | 'note';

const processBulkActions: Record<WfoBulkProcessAction, ProcessBulkAction> = {
  retry: 'resume',
  abort: 'abort',
  delete: 'delete',
  note: 'note',
};

export type UseBulkProcessActionProps = {
  action: WfoBulkProcessAction;
  translationNamespace: string;
  onActionDone: () => void;
};

export const useBulkProcessAction = ({ action, translationNamespace, onActionDone }: UseBulkProcessActionProps) => {
  const t = useTranslations(`${translationNamespace}.${action}`);
  const { showToastMessage } = useShowToastMessage();
  const [bulkProcessAction, { isLoading }] = useBulkProcessActionMutation();

  const runBulkProcessAction = async (processes: ProcessListItem[], note?: string | null): Promise<boolean> => {
    try {
      const { count, results } = await bulkProcessAction({
        action: processBulkActions[action],
        processIds: processes.map(({ processId }) => processId),
        note,
      }).unwrap();
      const failedCount = results.filter(({ success }) => !success).length;

      if (count > 0) {
        showToastMessage(ToastTypes.SUCCESS, t('successText', { count }), t('successTitle'));
        onActionDone();
      }
      if (failedCount > 0) {
        showToastMessage(ToastTypes.ERROR, t('failedText', { count: failedCount }), t('failedTitle'));
      }
      return count > 0;
    } catch (error) {
      showToastMessage(
        ToastTypes.ERROR,
        getErrorDetail(error, true) ?? t('failedText', { count: processes.length }),
        t('failedTitle'),
      );
      return false;
    }
  };

  return { runBulkProcessAction, isLoading };
};
