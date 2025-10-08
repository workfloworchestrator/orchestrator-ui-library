import { createSlice } from '@reduxjs/toolkit';
import type { Slice } from '@reduxjs/toolkit';

import type { OrchestratorConfig } from '@/types';

import { RootState } from '../store';

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

export const selectOrchestratorConfig = (state: RootState) =>
    state.orchestratorConfig;
