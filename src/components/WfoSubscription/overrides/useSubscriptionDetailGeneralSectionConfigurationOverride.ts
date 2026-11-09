import { useAppSelector } from '@/rtk/hooks';

export const useSubscriptionDetailGeneralSectionConfigurationOverride = () => {
  const overrideSections = useAppSelector(
    (state) => state.orchestratorComponentOverride?.subscriptionDetail?.generalSectionConfigurationOverride,
  );

  return {
    overrideSections,
  };
};
