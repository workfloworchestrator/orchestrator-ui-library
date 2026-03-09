import { WfoTasksListTabType } from './tabConfig';

export const getTasksListTabTypeFromString = (tabId?: string): WfoTasksListTabType | undefined => {
  if (!tabId) {
    return undefined;
  }

  switch (tabId.toUpperCase()) {
    case WfoTasksListTabType.ACTIVE.toString():
      return WfoTasksListTabType.ACTIVE;
    case WfoTasksListTabType.COMPLETED.toString():
      return WfoTasksListTabType.COMPLETED;

    default:
      return undefined;
  }
};
