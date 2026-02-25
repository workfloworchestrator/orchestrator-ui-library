import { TimelineItem } from '@/components';
import { Process, ProcessStepsResult, StartProcessStep, StepStatus } from '@/types';

import { orchestratorApi } from '../api';

export const processStepsQuery = `
    query ProcessSteps($processName: String!) {
        workflows(filterBy: { field: "name", value: $processName }) {
            page {
                steps {
                    name
                    assignee
                }
            }
        }
    }
`;

const processStepApi = orchestratorApi.injectEndpoints({
  endpoints: (build) => ({
    getTimeLineItems: build.query<TimelineItem[], Process['workflowName']>({
      query: (processName) => ({
        document: processStepsQuery,
        variables: { processName },
      }),
      transformResponse: (response: ProcessStepsResult): TimelineItem[] => {
        const timeLineItems: TimelineItem[] = response.workflows.page[0].steps.map(({ name }: StartProcessStep) => {
          return {
            processStepStatus: StepStatus.PENDING,
            stepDetail: name,
          };
        });

        return timeLineItems;
      },
    }),
  }),
});

export const { useGetTimeLineItemsQuery } = processStepApi;
