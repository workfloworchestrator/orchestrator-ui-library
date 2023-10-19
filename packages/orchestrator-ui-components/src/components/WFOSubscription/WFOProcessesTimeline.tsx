import React from 'react';
import { EuiAvatar, EuiComment, EuiCommentList, EuiSpacer } from '@elastic/eui';

import { WFOProcessStatusBadge } from '../WFOBadges';
import { SubscriptionDetailProcess } from '../../types';
import { WFOLoading } from '../WFOLoading';
import { PATH_PROCESSES } from '../WFOPageTemplate';
import { parseDateToLocaleDateTimeString, parseDate } from '../../utils';

const Card = (subscriptionDetailProcess: SubscriptionDetailProcess) => (
    <div style={{ marginTop: 5 }}>
        <table width="100%" bgcolor={'#F1F5F9'}>
            <tr>
                <td
                    valign={'top'}
                    style={{
                        width: 250,
                        padding: 10,
                        borderBottom: 'solid 1px #ddd',
                    }}
                >
                    <b>ID</b>
                </td>
                <td style={{ padding: 10, borderBottom: 'solid 1px #ddd' }}>
                    <a
                        href={`${PATH_PROCESSES}/${subscriptionDetailProcess.processId}`}
                    >
                        {subscriptionDetailProcess.processId}
                    </a>
                </td>
            </tr>
            <tr>
                <td
                    valign={'top'}
                    style={{ padding: 10, borderBottom: 'solid 1px #ddd' }}
                >
                    <b>Status</b>
                </td>
                <td style={{ padding: 10, borderBottom: 'solid 1px #ddd' }}>
                    <WFOProcessStatusBadge
                        processStatus={subscriptionDetailProcess.lastStatus}
                    />
                </td>
            </tr>
            <tr>
                <td
                    valign={'top'}
                    style={{ padding: 10, borderBottom: 'solid 1px #ddd' }}
                >
                    <b>Started at</b>
                </td>
                <td style={{ padding: 10, borderBottom: 'solid 1px #ddd' }}>
                    {parseDateToLocaleDateTimeString(
                        parseDate(subscriptionDetailProcess.startedAt),
                    )}
                </td>
            </tr>
            <tr>
                <td valign={'top'} style={{ padding: 10 }}>
                    <b>Started by</b>
                </td>
                <td style={{ padding: 10 }}>
                    {subscriptionDetailProcess.createdBy}
                </td>
            </tr>
        </table>
    </div>
);

const RenderProcess = (
    subscriptionDetailProcess: SubscriptionDetailProcess,
) => (
    <EuiComment
        username={subscriptionDetailProcess.workflowTarget ?? ''}
        timelineAvatarAriaLabel={subscriptionDetailProcess.workflowName}
        timelineAvatar={<EuiAvatar name="C" />}
    >
        {Card(subscriptionDetailProcess)}
    </EuiComment>
);

type ProcessesTimelineProps = {
    subscriptionDetailProcesses: SubscriptionDetailProcess[];
};

export const ProcessesTimeline = ({
    subscriptionDetailProcesses,
}: ProcessesTimelineProps) => {
    return (
        <>
            <EuiSpacer size={'m'} />
            {!subscriptionDetailProcesses && <WFOLoading />}
            <EuiCommentList aria-label="Processes">
                {subscriptionDetailProcesses && (
                    <EuiCommentList aria-label="Processes">
                        {subscriptionDetailProcesses.map(
                            (subscriptionDetailProcess) =>
                                RenderProcess(subscriptionDetailProcess),
                        )}
                    </EuiCommentList>
                )}
            </EuiCommentList>
        </>
    );
};
