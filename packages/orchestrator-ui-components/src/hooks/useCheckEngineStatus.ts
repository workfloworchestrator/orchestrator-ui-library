import { useTranslations } from 'next-intl';

import { ToastTypes } from '@/contexts';
import { useToastMessage } from '@/hooks/useToastMessage';
import { useGetEngineStatusQuery } from '@/rtk/endpoints';
import { EngineStatus } from '@/types';

export const useCheckEngineStatus = () => {
    const { data, isLoading, refetch } = useGetEngineStatusQuery();
    const { engineStatus } = data || {};
    const tErrors = useTranslations('errors');
    const toastMessage = useToastMessage();

    const isEngineRunningNow = async () => {
        await refetch();
        const isEngineRunning = engineStatus === EngineStatus.RUNNING;

        if (!isEngineRunning && !isLoading) {
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
