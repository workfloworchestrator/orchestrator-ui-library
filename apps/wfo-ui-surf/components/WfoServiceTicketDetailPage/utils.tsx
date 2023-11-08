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

// export const getFieldFromProductBlockInstanceValues = (
//     instanceValues: FieldValue[],
//     field: string,
// ): string | number => {
//     const nameValue = instanceValues.find(
//         (instanceValue) => instanceValue.field === field,
//     );
//     return nameValue ? nameValue.value : '';
// };
//
// export const getProductBlockTitle = (
//     instanceValues: FieldValue[],
// ): string | number => {
//     const title = getFieldFromProductBlockInstanceValues(
//         instanceValues,
//         'title',
//     );
//
//     if (!title) {
//         return getFieldFromProductBlockInstanceValues(instanceValues, 'name');
//     }
//
//     return title && typeof title === 'string' && title.length > MAX_LABEL_LENGTH
//         ? `${title.substring(0, MAX_LABEL_LENGTH)}...`
//         : title;
// };
//
// export const flattenArrayProps = (
//     action: SubscriptionAction,
// ): TranslationValues => {
//     const flatObject: TranslationValues = {};
//     for (const [key, value] of Object.entries(action)) {
//         if (Array.isArray(value)) {
//             flatObject[key] = value.join(', ');
//         } else {
//             flatObject[key] = value;
//         }
//     }
//     return action ? flatObject : {};
// };
//
// export const getWorkflowTargetColor = (
//     workflowTarget: WorkflowTarget,
//     theme: EuiThemeComputed,
// ) => {
//     // Data returned from graphql can't always be depended on to be lowercase
//     switch (workflowTarget.toLocaleLowerCase()) {
//         case WorkflowTarget.CREATE:
//             return theme.colors.successText;
//         case WorkflowTarget.MODIFY:
//             return theme.colors.primaryText;
//         case WorkflowTarget.SYSTEM:
//             return theme.colors.warning;
//         case WorkflowTarget.TERMINATE:
//             return theme.colors.danger;
//     }
//
//     return theme.colors.body;
// };
