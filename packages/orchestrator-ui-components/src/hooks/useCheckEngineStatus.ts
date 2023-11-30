import { useTranslations } from 'next-intl';

import { ToastTypes } from '@/contexts';
import { useEngineStatusQuery } from '@/hooks/useEngineStatusQuery';
import { useToastMessage } from '@/hooks/useToastMessage';

export const useCheckEngineStatus = () => {
    const tErrors = useTranslations('errors');
    const toastMessage = useToastMessage();
    const { refetch } = useEngineStatusQuery();

    const isEngineRunningNow = async () => {
        const result = await refetch();
        const isEngineRunning = result.data?.global_status === 'RUNNING';

        if (!isEngineRunning) {
            toastMessage.addToast(
                ToastTypes.ERROR,
                tErrors('notAllowedWhenEngineIsNotRunningMessage'),
                tErrors('notAllowedWhenEngineIsNotRunningTitle'),
            );
        }

        return isEngineRunning;
    };

    return {
        isEngineRunningNow,
    };
};
