import { useTranslations } from 'next-intl';

import { useShowToastMessage } from '@/hooks';
import { useBulkProcessActionMutation } from '@/rtk/endpoints/processDetail';
import { getErrorDetail } from '@/rtk/utils';
import { ProcessBulkAction, ToastTypes } from '@/types';

import type { ProcessListItem } from './WfoProcessesList';

export const useBulkProcessAction = (action: ProcessBulkAction, onActionDone: () => void) => {
  const t = useTranslations(`tasks.bulkActions.${action}`);
  const { showToastMessage } = useShowToastMessage();
  const [bulkProcessAction, { isLoading }] = useBulkProcessActionMutation();

  const runBulkProcessAction = async (processes: ProcessListItem[], note?: string | null): Promise<boolean> => {
    try {
      const { count, results } = await bulkProcessAction({
        action,
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
