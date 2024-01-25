import { EmailLog, EmailStep, ServiceTicketLogType } from '@/types';

export const generateEmailName = (
    sentEmail: EmailLog,
    allUpdateEmails: EmailLog[],
    index: number,
) => {
    const subject = sentEmail.emails[0]?.subject ?? '';
    if (sentEmail.log_type === ServiceTicketLogType.UPDATE) {
        const updateIndex = allUpdateEmails.length - index;
        return `UPDATE#${updateIndex} - ${subject}`;
    }
    return subject;
};

export const mapLogEntryToStep = ({
    name,
    log_type,
    sentBy,
    entry_time,
    log_id,
    emails,
}: EmailLog): EmailStep => ({
    name: name,
    status: log_type as ServiceTicketLogType,
    sentBy: sentBy,
    executed: new Date(entry_time).toISOString(),
    stepId: log_id,
    emails: emails,
});
