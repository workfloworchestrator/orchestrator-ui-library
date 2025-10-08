import { useAppSelector } from '@/rtk/hooks';

export const useStartPageSummaryCardConfigurationOverride = () => {
    const overrideSummaryCards = useAppSelector(
        (state) =>
            state.orchestratorComponentOverride?.startPage
                ?.summaryCardConfigurationOverride,
    );

    return {
        overrideSummaryCards,
    };
};
