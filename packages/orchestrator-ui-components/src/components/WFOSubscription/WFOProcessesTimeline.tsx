import React, { FC } from 'react';
import { EuiAvatar, EuiComment, EuiCommentList, EuiSpacer } from '@elastic/eui';

import { WFOProcessStatusBadge } from '../WFOBadges';
import { SubscriptionProcess, useSubscriptionProcesses } from '../../hooks';
import { WFOLoading } from '../WFOLoading';

/** TODO: Adding a useTranslations hook here leads to an hooks error. https://github.com/workfloworchestrator/orchestrator-ui/issues/177 */
const Card = (processInfo: SubscriptionProcess) => (
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
                        href={`https://orchestrator.dev.automation.surf.net/processes/${processInfo.process.pid}`}
                    >
                        {processInfo.pid}
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
                        processStatus={processInfo.process.last_status}
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
                    2-11-2021 13:47:43 - Duration: 00:00:024
                </td>
            </tr>
            <tr>
                <td valign={'top'} style={{ padding: 10 }}>
                    <b>Started by</b>
                </td>
                <td style={{ padding: 10 }}>
                    {processInfo.process.created_by}
                </td>
            </tr>
        </table>
    </div>
);

const RenderProcess = (processInfo: SubscriptionProcess) => (
    <EuiComment
        username={processInfo.workflow_target ?? ''}
        timelineAvatarAriaLabel={processInfo.process.workflow}
        timelineAvatar={<EuiAvatar name="C" />}
    >
        {Card(processInfo)}
    </EuiComment>
);

export type ProcessesTimelineProps = {
    subscriptionId: string;
};

export const ProcessesTimeline: FC<ProcessesTimelineProps> = ({
    subscriptionId,
}) => {
    const { data: subscriptionProcesses } =
        useSubscriptionProcesses(subscriptionId);

    return (
        <>
            <EuiSpacer size={'m'} />
            {!subscriptionProcesses && <WFOLoading />}
            <EuiCommentList aria-label="Processes">
                {subscriptionProcesses && (
                    <EuiCommentList aria-label="Processes">
                        {subscriptionProcesses.map((i) => RenderProcess(i))}
                    </EuiCommentList>
                )}
            </EuiCommentList>
        </>
    );
};
