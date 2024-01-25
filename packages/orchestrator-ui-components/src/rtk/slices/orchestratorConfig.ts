import { createSlice } from '@reduxjs/toolkit';
import type { Slice } from '@reduxjs/toolkit';

import type { OrchestratorConfig } from '@/types';

type OrchestratorConfigSlice = Slice<OrchestratorConfig>;

export const getOrchestratorConfigSlice = (
    config: OrchestratorConfig,
): OrchestratorConfigSlice => {
    return createSlice({
        name: 'orchestrator',
        initialState: config,
        reducers: {},
    });
};
