import React from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiComment,
    EuiCommentList,
    EuiFlexGroup,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';

import { WfoLoading, WfoRadioDropdownOption } from '@/components';
import { PATH_TASKS, PATH_WORKFLOWS } from '@/components';
import { WfoRadioDropdown, sortProcessesByDate } from '@/components';
import { useWithOrchestratorTheme } from '@/hooks';
import { SortOrder, SubscriptionDetailProcess } from '@/types';
import {
    parseDate,
    parseDateToLocaleDateTimeString,
    upperCaseFirstChar,
} from '@/utils';

import { WfoProcessStatusBadge } from '../WfoBadges';
import { WfoTargetTypeIcon } from './WfoTargetTypeIcon';
import { getSubscriptionDetailStyles } from './styles';

interface WfoProcessCardProps {
    subscriptionDetailProcess: SubscriptionDetailProcess;
}

const WfoProcessCard = ({ subscriptionDetailProcess }: WfoProcessCardProps) => {
    const t = useTranslations('subscriptions.detail.processDetail');
    const {
        tableStyle,
        contentCellStyle,
        headerCellStyle,
        emptyCellStyle,
        lastContentCellStyle,
        lastHeaderCellStyle,
    } = useWithOrchestratorTheme(getSubscriptionDetailStyles);
    const processUrl = subscriptionDetailProcess.isTask
        ? PATH_TASKS
        : PATH_WORKFLOWS;

    return (
        <>
            <table css={tableStyle}>
                <tbody>
                    <tr>
                        <td css={emptyCellStyle}></td>
                        <td css={headerCellStyle}>{t('id')}</td>
                        <td css={contentCellStyle}>
                            <a
                                href={`${processUrl}/${subscriptionDetailProcess.processId}`}
                            >
                                {subscriptionDetailProcess.processId}
                            </a>
                        </td>
                        <td css={emptyCellStyle}></td>
                    </tr>
                    <tr>
                        <td css={emptyCellStyle}></td>
                        <td css={headerCellStyle}>{t('status')}</td>
                        <td css={contentCellStyle}>
                            <WfoProcessStatusBadge
                                processStatus={
                                    subscriptionDetailProcess.lastStatus
                                }
                            />
                        </td>
                        <td css={emptyCellStyle}></td>
                    </tr>
                    <tr>
                        <td css={emptyCellStyle}></td>
                        <td css={headerCellStyle}>{t('startedAt')}</td>
                        <td css={contentCellStyle}>
                            {parseDateToLocaleDateTimeString(
                                parseDate(subscriptionDetailProcess.startedAt),
                            )}
                        </td>
                        <td css={emptyCellStyle}></td>
                    </tr>
                    <tr>
                        <td css={emptyCellStyle}></td>
                        <td css={lastHeaderCellStyle}>{t('startedBy')}</td>
                        <td css={lastContentCellStyle}>
                            {subscriptionDetailProcess.createdBy}
                        </td>
                        <td css={emptyCellStyle}></td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

interface WfoRenderSubscriptionProcess {
    subscriptionDetailProcess: SubscriptionDetailProcess;
}
const WfoRenderSubscriptionProcess = ({
    subscriptionDetailProcess,
}: WfoRenderSubscriptionProcess) => {
    const { timeLineStyle, workflowTargetStyle } = useWithOrchestratorTheme(
        getSubscriptionDetailStyles,
    );

    return (
        <EuiComment
            username={subscriptionDetailProcess.workflowTarget ?? ''}
            timelineAvatarAriaLabel={subscriptionDetailProcess.workflowName}
            timelineAvatar={
                <WfoTargetTypeIcon
                    target={subscriptionDetailProcess.workflowTarget}
                />
            }
        >
            <EuiFlexGroup
                alignItems="center"
                gutterSize="s"
                css={timeLineStyle}
            >
                <EuiText css={workflowTargetStyle}>
                    {upperCaseFirstChar(
                        subscriptionDetailProcess.workflowTarget,
                    )}
                </EuiText>
                <EuiText>-</EuiText>
                <EuiText>{subscriptionDetailProcess.workflowName}</EuiText>
            </EuiFlexGroup>

            <WfoProcessCard
                subscriptionDetailProcess={subscriptionDetailProcess}
            />
        </EuiComment>
    );
};

interface WfoProcessesTimelineProps {
    subscriptionDetailProcesses: SubscriptionDetailProcess[];
}

export const WfoProcessesTimeline = ({
    subscriptionDetailProcesses,
}: WfoProcessesTimelineProps) => {
    const t = useTranslations('subscriptions.detail.workflowsTab');
    const options: WfoRadioDropdownOption<SortOrder>[] = [
        {
            label: t('startWithOldestLabel'),
            id: 'radioButtonOldest',
            value: SortOrder.ASC,
        },
        {
            label: t('startWithNewestLabel'),
            id: 'radioButtonNewest',
            value: SortOrder.DESC,
        },
    ];

    const [selectedOption, setSelectedOption] = React.useState(options[0]);

    const handleOnSelectOption = (
        option: WfoRadioDropdownOption<SortOrder>,
    ) => {
        setSelectedOption(option);
    };

    const sortedProcesses = sortProcessesByDate(
        subscriptionDetailProcesses,
        selectedOption.value,
    );

    return (
        <>
            <EuiSpacer size={'m'} />
            {!subscriptionDetailProcesses && <WfoLoading />}
            <WfoRadioDropdown
                options={options}
                onUpdateOption={handleOnSelectOption}
                selectedOption={selectedOption}
            />
            {sortedProcesses && (
                <EuiCommentList aria-label="Processes">
                    {sortedProcesses
                        .filter((process) => !process.isTask)
                        .map((subscriptionDetailProcess, index) => (
                            <WfoRenderSubscriptionProcess
                                key={index}
                                subscriptionDetailProcess={
                                    subscriptionDetailProcess
                                }
                            />
                        ))}
                </EuiCommentList>
            )}
        </>
    );
};
