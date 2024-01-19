import { useTranslations } from 'next-intl';

import { useShowToastMessage } from '@/hooks';
import { useGetEngineStatusQuery } from '@/rtk/endpoints';
import { EngineStatus, ToastTypes } from '@/types';

export const useCheckEngineStatus = () => {
    const { data, isLoading, refetch } = useGetEngineStatusQuery();
    const { engineStatus } = data || {};
    const tErrors = useTranslations('errors');
    const { showToastMessage } = useShowToastMessage();

    const isEngineRunningNow = async () => {
        await refetch();
        const isEngineRunning = engineStatus === EngineStatus.RUNNING;

        if (!isEngineRunning && !isLoading) {
            showToastMessage(
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
