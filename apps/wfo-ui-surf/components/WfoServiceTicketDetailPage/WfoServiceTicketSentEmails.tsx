import React, { useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiAvatar,
    EuiPanel,
    EuiSpacer,
    EuiText,
    EuiTimeline,
} from '@elastic/eui';
import {
    StepListItem,
    WfoStepList,
} from '@orchestrator-ui/orchestrator-ui-components';

import { WfoEmailList } from '@/components/WfoEmailList/WfoEmailList';
import {
    EmailListItem,
    EmailLog,
    EmailStep,
    ServiceTicketLogType,
    ServiceTicketWithDetails,
} from '@/types';

interface WfoSubscriptionGeneralProps {
    serviceTicketDetail: ServiceTicketWithDetails;
}

const mapLogEntryToStep = (
    emailLog: EmailLog,
    serviceTicketDetail: ServiceTicketWithDetails,
): EmailStep => ({
    name: emailLog.name,
    status: emailLog.log_type,
    sentBy: emailLog.sentBy,
    executed: new Date(emailLog.entry_time).toISOString(),
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
        'cim.serviceTickets.detail.tabDetails.notificationLog',
    );

    // Add sentBy to email logs and UPDATE prefixes to update emails
    const data = serviceTicketDetail.email_logs.map(
        (sent_email, index, array) => {
            const match = serviceTicketDetail.logs.find(
                (log) => log.log_id === sent_email.log_id,
            );
            const updateCount = array
                .slice(index)
                .filter(
                    (email) => email.log_type === ServiceTicketLogType.UPDATE,
                ).length;
            return {
                ...sent_email,
                sentBy: match ? match.logged_by : null,
                name:
                    sent_email.log_type === ServiceTicketLogType.UPDATE
                        ? `UPDATE#${updateCount} - ${serviceTicketDetail.title_nl}`
                        : serviceTicketDetail.title_nl,
            };
        },
    );

    const steps = data
        .map((log) => mapLogEntryToStep(log, serviceTicketDetail))
        .sort((a, b) => {
            const timeA = new Date(a.executed).getTime();
            const timeB = new Date(b.executed).getTime();
            return timeA - timeB;
        });

    const initialStepListItems: EmailListItem[] = steps.map((step) => ({
        step,
        isExpanded: false,
    }));

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

    const handleExpandStepListItem = (stepListItem: EmailListItemw) =>
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
                onTriggerExpandStepListIetem={handleExpandStepListItem}
                isTask={false}
                processId={''}
            ></WfoEmailList>
        </>
    );
};
