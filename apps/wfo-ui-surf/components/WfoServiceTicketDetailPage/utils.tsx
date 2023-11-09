import React from 'react';
import { EuiIcon } from '@elastic/eui';

// const MAX_LABEL_LENGTH = 45;

export enum ServiceTicketTabIds {
    GENERAL_TAB = 'general-id',
    NOTIFICATION_LOG = 'notification-log-id',
    SENT_EMAILS = 'sent-emails-id',
}

export const tabs = [
    {
        id: ServiceTicketTabIds.GENERAL_TAB,
        translationKey: 'tabs.general',
        prepend: <EuiIcon type="devToolsApp" />,
        append: <></>,
    },
    {
        id: ServiceTicketTabIds.NOTIFICATION_LOG,
        translationKey: 'tabs.notificationLog',
        prepend: <EuiIcon type="bell" />,
    },
    {
        id: ServiceTicketTabIds.SENT_EMAILS,
        translationKey: 'tabs.sentEmails',
        prepend: <EuiIcon type="email" />,
    },
];
