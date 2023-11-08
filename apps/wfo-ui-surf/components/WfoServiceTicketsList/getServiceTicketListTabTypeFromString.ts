import { WfoServiceTicketListTabType } from '../../types';

export const getServiceTicketListTabTypeFromString = (
    tabId?: string,
): WfoServiceTicketListTabType | undefined => {
    if (!tabId) {
        return undefined;
    }

    switch (tabId.toUpperCase()) {
        case WfoServiceTicketListTabType.ACTIVE.toString():
            return WfoServiceTicketListTabType.ACTIVE;
        case WfoServiceTicketListTabType.COMPLETED.toString():
            return WfoServiceTicketListTabType.COMPLETED;

        default:
            return undefined;
    }
};
