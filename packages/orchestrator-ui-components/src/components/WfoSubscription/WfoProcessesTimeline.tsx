import React from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiComment,
    EuiCommentList,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';

import {
    PATH_TASKS,
    PATH_WORKFLOWS,
    WfoLoading,
    WfoRadioDropdown,
    WfoRadioDropdownOption,
    sortProcessesByDate,
} from '@/components';
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
        labelCellStyle,
        cellGroupStyle,
        borderStyle,
        rowStyle,
    } = useWithOrchestratorTheme(getSubscriptionDetailStyles);
    const processUrl = subscriptionDetailProcess.isTask
        ? PATH_TASKS
        : PATH_WORKFLOWS;

    const rows = [
        {
            label: t('id'),
            content: (
                <a
                    href={`${processUrl}/${subscriptionDetailProcess.processId}`}
                >
                    {subscriptionDetailProcess.processId}
                </a>
            ),
        },
        {
            label: t('status'),
            content: (
                <div>
                    <WfoProcessStatusBadge
                        processStatus={subscriptionDetailProcess.lastStatus}
                    />
                </div>
            ),
        },
        {
            label: t('startedAt'),
            content: parseDateToLocaleDateTimeString(
                parseDate(subscriptionDetailProcess.startedAt),
            ),
        },
        {
            label: t('startedBy'),
            content: subscriptionDetailProcess.createdBy,
        },
    ];

    return (
        <div css={tableStyle}>
            {rows.map(({ label, content }, idx) => (
                <div key={idx} css={rowStyle}>
                    <div className="border" css={borderStyle}>
                        <EuiFlexGroup key={label} css={cellGroupStyle}>
                            <EuiFlexItem css={labelCellStyle} grow={2}>
                                {label}
                            </EuiFlexItem>
                            <EuiFlexItem grow={9}>{content}</EuiFlexItem>
                        </EuiFlexGroup>
                    </div>
                </div>
            ))}
        </div>
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
