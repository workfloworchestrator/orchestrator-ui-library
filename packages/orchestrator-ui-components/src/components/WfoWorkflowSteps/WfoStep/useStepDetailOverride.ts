import { useAppSelector } from '@/rtk/hooks';

export const useStepDetailOverride = () => {
  const overrideStepDetail = useAppSelector((state) => state.orchestratorComponentOverride?.stepDetail);

  return {
    overrideStepDetail,
  };
};
