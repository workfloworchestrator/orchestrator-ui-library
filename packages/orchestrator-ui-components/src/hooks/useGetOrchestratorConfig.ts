import { useSelector } from 'react-redux';

import { selectOrchestratorConfig } from '@/rtk/slices/orchestratorConfig';
import { OrchestratorConfig } from '@/types';

export const useGetOrchestratorConfig = (): OrchestratorConfig => {
    return useSelector(selectOrchestratorConfig);
};
