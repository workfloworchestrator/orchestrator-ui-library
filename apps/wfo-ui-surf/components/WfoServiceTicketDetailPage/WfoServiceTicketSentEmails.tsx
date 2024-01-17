import React, { useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiSpacer, EuiText } from '@elastic/eui';

import { WfoEmailList } from '@/components/WfoEmailList/WfoEmailList';
import {
    EmailListItem,
    EmailLog,
    EmailStep,
    ServiceTicketLogType,
    ServiceTicketProcessState,
    ServiceTicketWithDetails,
} from '@/types';

interface WfoSubscriptionGeneralProps {
    serviceTicketDetail: ServiceTicketWithDetails;
}

const mapLogEntryToStep = (emailLog: EmailLog): EmailStep => ({
    name: emailLog.name,
    status: emailLog.log_type as ServiceTicketLogType,
    sentBy: emailLog.sentBy,
    executed: new Date(emailLog.entry_time).toISOString(),
    stepId: emailLog.log_id,
    emails: emailLog.emails,
});

export const WfoServiceTicketSentEmails = ({
    serviceTicketDetail,
}: WfoSubscriptionGeneralProps) => {
    const t = useTranslations(
        'cim.serviceTickets.detail.tabDetails.sentEmails',
    );

    const generateEmailName = (
        sentEmail: EmailLog,
        allUpdateEmails: EmailLog[],
        index: number,
    ) => {
        const subject = sentEmail.emails[0]?.subject ?? '';
        if (sentEmail.log_type === ServiceTicketLogType.UPDATE) {
            const updateIndex = allUpdateEmails.length - index;
            return `UPDATE#${updateIndex} - ${subject}`;
        } else {
            return subject;
        }
    };

    const data = serviceTicketDetail.email_logs
        .sort((a, b) => {
            const timeA = new Date(a.entry_time).getTime();
            const timeB = new Date(b.entry_time).getTime();
            return timeA - timeB;
        })
        .map((sentEmail, index, array) => {
            const sentBy =
                serviceTicketDetail.logs.find(
                    (log) => log.log_id === sentEmail.log_id,
                )?.logged_by || '';

            const allUpdateEmails = array.filter(
                (email) => email.log_type === ServiceTicketLogType.UPDATE,
            );
            const slicedUpdateEmails = allUpdateEmails.slice(index);

            return {
                ...sentEmail,
                sentBy: sentBy,
                name: generateEmailName(
                    sentEmail,
                    allUpdateEmails,
                    slicedUpdateEmails.length,
                ),
            };
        });

    const steps = data.map((log) => mapLogEntryToStep(log));

    const sendEmailButtons: EmailStep[] = [];
    const sendEmailButton: EmailStep = {
        executed: '',
        name: '',
        sentBy: '',
        emails: [],
        status: null,
        stepId: '',
    };

    if (
        serviceTicketDetail.process_state ===
        ServiceTicketProcessState.OPEN_ACCEPTED
    ) {
        sendEmailButtons.push({
            ...sendEmailButton,
            status: ServiceTicketLogType.OPEN,
        });
    }

    if (
        serviceTicketDetail.process_state === ServiceTicketProcessState.OPEN ||
        serviceTicketDetail.process_state === ServiceTicketProcessState.UPDATED
    ) {
        sendEmailButtons.push(
            {
                ...sendEmailButton,
                status: ServiceTicketLogType.UPDATE,
            },
            {
                ...sendEmailButton,
                status: ServiceTicketLogType.CLOSE,
            },
        );
    }

    const initialStepListItems: EmailListItem[] = [
        ...steps.map((step) => ({
            step,
            isExpanded: false,
            isButton: false,
        })),
        ...sendEmailButtons.map((stepButton) => ({
            step: stepButton,
            isExpanded: false,
            isButton: true,
        })),
    ];

    const [stepListItems, setStepListItems] = useState(initialStepListItems);

    const updateStepListItem = (
        stepListItemToUpdate: EmailListItem,
        updateFunction: (stepListItem: EmailListItem) => EmailListItem,
    ) =>
        setStepListItems(
            stepListItems.map((stepListItem) =>
                stepListItem === stepListItemToUpdate
                    ? updateFunction(stepListItem)
                    : stepListItem,
            ),
        );

    const toggleExpandedStateStepListItem = (stepListItem: EmailListItem) =>
        updateStepListItem(stepListItem, (item) => ({
            ...item,
            isExpanded: !item.isExpanded,
        }));

    const handleExpandStepListItem = (stepListItem: EmailListItem) =>
        updateStepListItem(stepListItem, (item) => ({
            ...item,
            isExpanded: true,
        }));

    return (
        <>
            <EuiSpacer />
            <WfoEmailList
                stepListItems={stepListItems}
                onToggleExpandStepListItem={toggleExpandedStateStepListItem}
                onTriggerExpandStepListItem={handleExpandStepListItem}
            ></WfoEmailList>
            {stepListItems.length === 0 && (
                <EuiText color="subdued">
                    {t('noEmailsAvailableForThisServiceTicket')}
                </EuiText>
            )}
        </>
    );
};
