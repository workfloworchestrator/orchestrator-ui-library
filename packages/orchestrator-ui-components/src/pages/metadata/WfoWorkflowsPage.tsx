import React from 'react';

import { METADATA_WORKFLOWS_TABLE_LOCAL_STORAGE_KEY } from '@/components';

import { WfoWorkflowDefinitionsList } from './WfoWorkflowDefinitionsList';

export const WfoWorkflowsPage = () => (
  <WfoWorkflowDefinitionsList isTask={false} localStorageKey={METADATA_WORKFLOWS_TABLE_LOCAL_STORAGE_KEY} />
);
