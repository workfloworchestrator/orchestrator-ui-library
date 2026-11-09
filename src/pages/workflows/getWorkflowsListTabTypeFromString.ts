import { WfoWorkflowsListTabType } from './tabConfig';

export const getWorkflowsListTabTypeFromString = (tabId?: string): WfoWorkflowsListTabType | undefined => {
  if (!tabId) {
    return undefined;
  }

  switch (tabId.toUpperCase()) {
    case WfoWorkflowsListTabType.ACTIVE.toString():
      return WfoWorkflowsListTabType.ACTIVE;
    case WfoWorkflowsListTabType.COMPLETED.toString():
      return WfoWorkflowsListTabType.COMPLETED;

    default:
      return undefined;
  }
};
