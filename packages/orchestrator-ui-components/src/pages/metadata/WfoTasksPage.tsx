import React from 'react';

import { METADATA_TASKS_TABLE_LOCAL_STORAGE_KEY } from '@/components';

import { WfoWorkflowDefinitionsList } from './WfoWorkflowDefinitionsList';

export const WfoTasksPage = () => (
  <WfoWorkflowDefinitionsList isTask={true} localStorageKey={METADATA_TASKS_TABLE_LOCAL_STORAGE_KEY} />
);
