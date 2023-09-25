import React from 'react';

import { useOrchestratorTheme } from '../../hooks';
import { TimelineItem } from '../../components';
import { WFOProcessDetail } from '../processes/WFOProcessDetail';
import { ProcessDetail, ProcessStatus, StepStatus } from '../../types';

interface WFOStartWorkflowPageProps {
    workflowName: string;
}

export const WFOStartWorkflowPage = ({
    workflowName,
}: WFOStartWorkflowPageProps) => {
    const { theme } = useOrchestratorTheme();
    console.log(theme);
    console.log(workflowName);

    const processDetail: Partial<ProcessDetail> = {
        lastStatus: ProcessStatus.CREATE,
        lastStep: StepStatus.FORM,
        workflowName: workflowName,
        createdBy: '-',
    };

    const isFetching = false;

    const fakeTimeLineItems: TimelineItem[] = [
        {
            processStepStatus: StepStatus.FORM,
        },
        {
            processStepStatus: StepStatus.PENDING,
        },
        {
            processStepStatus: StepStatus.PENDING,
        },
        {
            processStepStatus: StepStatus.PENDING,
        },
        {
            processStepStatus: StepStatus.PENDING,
        },
    ];

    return (
        <WFOProcessDetail
            pageTitle={workflowName}
            productNames={''}
            buttonsAreDisabled={true}
            isFetching={isFetching}
            processDetail={processDetail}
            timelineItems={fakeTimeLineItems}
        >
            FORMWIZARDRY!: {workflowName}
        </WFOProcessDetail>
    );
};
