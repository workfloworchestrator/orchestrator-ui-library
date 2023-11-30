import { WfoWorkflowListTabType } from './tabConfig';

export const getWorkflowListTabTypeFromString = (
    tabId?: string,
): WfoWorkflowListTabType | undefined => {
    if (!tabId) {
        return undefined;
    }

    switch (tabId.toUpperCase()) {
        case WfoWorkflowListTabType.ACTIVE.toString():
            return WfoWorkflowListTabType.ACTIVE;
        case WfoWorkflowListTabType.COMPLETED.toString():
            return WfoWorkflowListTabType.COMPLETED;

        default:
            return undefined;
    }
};
