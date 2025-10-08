import { useContext } from 'react';

import { WfoErrorMonitoringContext } from '@/contexts';

export const useWfoErrorMonitoring = () =>
    useContext(WfoErrorMonitoringContext);
