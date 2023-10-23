import React from 'react';
import { EuiAvatar, EuiComment, EuiCommentList, EuiSpacer } from '@elastic/eui';
import { useTranslations } from 'next-intl';

import { useWithOrchestratorTheme } from '../../hooks';
import { WFOProcessStatusBadge } from '../WFOBadges';
import { SubscriptionDetailProcess } from '../../types';
import { WFOLoading } from '../WFOLoading';
import { PATH_PROCESSES } from '../WFOPageTemplate';
import { parseDateToLocaleDateTimeString, parseDate } from '../../utils';

import { getStyles } from './styles';

interface WfoProcessCardProps {
    subscriptionDetailProcess: SubscriptionDetailProcess;
}

const WfoProcessCard = ({ subscriptionDetailProcess }: WfoProcessCardProps) => {
    const t = useTranslations('subscriptions.detail.processDetail');
    const { tableStyle, contentCellStyle, headerCellStyle } =
        useWithOrchestratorTheme(getStyles);

    return (
        <div style={{ marginTop: 5 }}>
            <table css={tableStyle}>
                <tr>
                    <td css={headerCellStyle}>{t('id')}</td>
                    <td css={contentCellStyle}>
                        <a
                            href={`${PATH_PROCESSES}/${subscriptionDetailProcess.processId}`}
                        >
                            {subscriptionDetailProcess.processId}
                        </a>
                    </td>
                </tr>
                <tr>
                    <td css={headerCellStyle}>{t('status')}</td>
                    <td css={contentCellStyle}>
                        <WFOProcessStatusBadge
                            processStatus={subscriptionDetailProcess.lastStatus}
                        />
                    </td>
                </tr>
                <tr>
                    <td css={headerCellStyle}>{t('startedAt')}</td>
                    <td css={contentCellStyle}>
                        {parseDateToLocaleDateTimeString(
                            parseDate(subscriptionDetailProcess.startedAt),
                        )}
                    </td>
                </tr>
                <tr>
                    <td css={headerCellStyle}>{t('startedBy')}</td>
                    <td css={contentCellStyle}>
                        {subscriptionDetailProcess.createdBy}
                    </td>
                </tr>
            </table>
        </div>
    );
};

interface WfoRenderSubscriptionProcess {
    subscriptionDetailProcess: SubscriptionDetailProcess;
}
const WfoRenderSubscriptionProcess = ({
    subscriptionDetailProcess,
}: WfoRenderSubscriptionProcess) => (
    <EuiComment
        username={subscriptionDetailProcess.workflowTarget ?? ''}
        timelineAvatarAriaLabel={subscriptionDetailProcess.workflowName}
        timelineAvatar={<EuiAvatar name="C" />}
    >
        <WfoProcessCard subscriptionDetailProcess={subscriptionDetailProcess} />
    </EuiComment>
);

interface WfoProcessesTimelineProps {
    subscriptionDetailProcesses: SubscriptionDetailProcess[];
}

export const WfoProcessesTimeline = ({
    subscriptionDetailProcesses,
}: WfoProcessesTimelineProps) => {
    return (
        <>
            <EuiSpacer size={'m'} />
            {!subscriptionDetailProcesses && <WFOLoading />}
            <EuiCommentList aria-label="Processes">
                {subscriptionDetailProcesses && (
                    <EuiCommentList aria-label="Processes">
                        {subscriptionDetailProcesses.map(
                            (subscriptionDetailProcess, index) => (
                                <WfoRenderSubscriptionProcess
                                    key={index}
                                    subscriptionDetailProcess={
                                        subscriptionDetailProcess
                                    }
                                />
                            ),
                        )}
                    </EuiCommentList>
                )}
            </EuiCommentList>
        </>
    );
};
