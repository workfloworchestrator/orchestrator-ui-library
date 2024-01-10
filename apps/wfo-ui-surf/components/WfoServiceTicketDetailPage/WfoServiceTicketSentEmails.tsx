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
    state: {
        parameter1: 'example',
        parameter2: 56,
        parameter3: false,
    },
    stateDelta: {
        parameter1: 'example',
    },
});

export const WfoServiceTicketSentEmails = ({
    serviceTicketDetail,
}: WfoSubscriptionGeneralProps) => {
    const t = useTranslations(
        'cim.serviceTickets.detail.tabDetails.sentEmails',
    );

    // Add sentBy to email logs and UPDATE prefixes to update emails
    const data = serviceTicketDetail.email_logs
        .sort((a, b) => {
            const timeA = new Date(a.entry_time).getTime();
            const timeB = new Date(b.entry_time).getTime();
            return timeA - timeB;
        })
        .map((sent_email, index, array) => {
            const match = serviceTicketDetail.logs.find(
                (log) => log.log_id === sent_email.log_id,
            );
            const allUpdateEmails = array.filter(
                (email) => email.log_type === ServiceTicketLogType.UPDATE,
            );
            const slicedUpdateEmails = allUpdateEmails.slice(index);

            return {
                ...sent_email,
                sentBy: match ? match.logged_by : '',
                name:
                    sent_email.log_type === ServiceTicketLogType.UPDATE
                        ? `UPDATE#${
                              allUpdateEmails.length - slicedUpdateEmails.length
                          } - ${
                              sent_email.emails[0]
                                  ? sent_email.emails[0].subject
                                  : ''
                          }`
                        : sent_email.emails[0]
                          ? sent_email.emails[0].subject
                          : '',
            };
        });

    const steps = data.map((log) => mapLogEntryToStep(log));

    const sendEmailStepButtons: EmailStep[] = [];
    const emailStepButton: EmailStep = {
        executed: '',
        name: '',
        sentBy: '',
        state: {},
        stateDelta: {},
        status: null,
        stepId: '',
    };

    if (
        serviceTicketDetail.process_state ===
        ServiceTicketProcessState.OPEN_ACCEPTED
    ) {
        sendEmailStepButtons.push({
            ...emailStepButton,
            status: ServiceTicketLogType.OPEN,
        });
    }

    if (
        serviceTicketDetail.process_state === ServiceTicketProcessState.OPEN ||
        serviceTicketDetail.process_state === ServiceTicketProcessState.UPDATED
    ) {
        sendEmailStepButtons.push({
            ...emailStepButton,
            status: ServiceTicketLogType.UPDATE,
        });
    }

    if (
        serviceTicketDetail.process_state === ServiceTicketProcessState.OPEN ||
        serviceTicketDetail.process_state === ServiceTicketProcessState.UPDATED
    ) {
        sendEmailStepButtons.push({
            ...emailStepButton,
            status: ServiceTicketLogType.CLOSE,
        });
    }

    const initialStepListItems: EmailListItem[] = [
        ...steps.map((step) => ({
            step,
            isExpanded: false,
            isButton: false,
        })),
        ...sendEmailStepButtons.map((stepButton) => ({
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
                showHiddenKeys={false}
                startedAt={''}
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
