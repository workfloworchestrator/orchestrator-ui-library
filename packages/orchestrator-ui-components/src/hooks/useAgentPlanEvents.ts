import { useEffect, useState } from 'react';

import type { AgentSubscriber } from '@ag-ui/client';
// @ts-expect-error - v2 subpath exists but TypeScript moduleResolution doesn't recognize it
import { useAgent } from '@copilotkit/react-core/v2';

/** AG-UI custom event names emitted by the backend agent. */
enum AgentEvent {
  PLAN_CREATED = 'PLAN_CREATED',
  STEP_ACTIVE = 'AGENT_STEP_ACTIVE',
}

/** The backend step name used for the planning phase (not a real task). */
const PLANNER_STEP_NAME = 'Planner';

export type ToolCallState = {
  id: string;
  name: string;
  status: 'executing' | 'complete';
};

export type PlanStep = {
  step_name: string;
  reasoning: string | null;
  status: 'pending' | 'active' | 'completed';
  tool_calls: ToolCallState[];
};

export type PlanExecutionState = {
  planning: boolean;
  steps: PlanStep[];
};

const initialState: PlanExecutionState = {
  planning: false,
  steps: [],
};

const updateSteps = (
  steps: PlanStep[],
  predicate: (step: PlanStep) => boolean,
  updater: (step: PlanStep) => PlanStep,
): PlanStep[] => steps.map((step) => (predicate(step) ? updater(step) : step));

export function useAgentPlanEvents(agentId: string = 'query_agent'): PlanExecutionState {
  const { agent } = useAgent({ agentId });
  const [executionState, setExecutionState] = useState<PlanExecutionState>(initialState);

  useEffect(() => {
    if (!agent) {
      return;
    }

    const subscriber: AgentSubscriber = {
      onCustomEvent: (params) => {
        const event = params?.event;
        if (!event) return;

        if (event.name === AgentEvent.PLAN_CREATED) {
          const tasks = event.value as Array<{
            skillName: string;
            reasoning: string;
          }>;
          if (!Array.isArray(tasks)) return;

          setExecutionState({
            planning: false,
            steps: tasks.map((task) => ({
              step_name: task.skillName,
              reasoning: task.reasoning,
              status: 'pending' as const,
              tool_calls: [],
            })),
          });
          return;
        }

        if (event.name === AgentEvent.STEP_ACTIVE) {
          const stepName = event.value?.step;
          if (!stepName) return;

          if (stepName === PLANNER_STEP_NAME) {
            setExecutionState((prev) => ({
              ...prev,
              planning: true,
            }));
            return;
          }

          const reasoning = event.value?.reasoning ?? null;

          setExecutionState((prev) => {
            // Mark previous active step as completed
            const steps = updateSteps(
              prev.steps,
              (step) => step.status === 'active',
              (step) => ({ ...step, status: 'completed' as const }),
            );

            // If step already exists (from PLAN_CREATED), activate it
            const existingIndex = steps.findIndex((step) => step.step_name === stepName);
            if (existingIndex >= 0) {
              steps[existingIndex] = {
                ...steps[existingIndex],
                status: 'active',
                reasoning: reasoning ?? steps[existingIndex].reasoning,
              };
            } else {
              steps.push({
                step_name: stepName,
                reasoning,
                status: 'active',
                tool_calls: [],
              });
            }

            return { planning: false, steps };
          });
        }
      },

      onToolCallStartEvent: ({ event }) => {
        setExecutionState((prev) => {
          const currentStep = prev.steps.find((step) => step.status === 'active');
          if (!currentStep) return prev;

          return {
            ...prev,
            steps: updateSteps(
              prev.steps,
              (step) => step.step_name === currentStep.step_name,
              (step) => ({
                ...step,
                tool_calls: [
                  ...step.tool_calls,
                  {
                    id: event.toolCallId,
                    name: event.toolCallName,
                    status: 'executing' as const,
                  },
                ],
              }),
            ),
          };
        });
      },

      onToolCallEndEvent: ({ event }) => {
        setExecutionState((prev) => ({
          ...prev,
          steps: updateSteps(
            prev.steps,
            (step) => step.tool_calls.some((toolCall) => toolCall.id === event.toolCallId),
            (step) => ({
              ...step,
              tool_calls: step.tool_calls.map((toolCall) =>
                toolCall.id === event.toolCallId ? { ...toolCall, status: 'complete' as const } : toolCall,
              ),
            }),
          ),
        }));
      },

      onRunStartedEvent: () => {
        setExecutionState(initialState);
      },

      onRunFinishedEvent: () => {
        setExecutionState((prev) => ({
          planning: false,
          steps: updateSteps(
            prev.steps,
            (step) => step.status === 'active',
            (step) => ({ ...step, status: 'completed' as const }),
          ),
        }));
      },
    };

    const subscription = agent.subscribe(subscriber);

    return () => {
      subscription.unsubscribe();
    };
  }, [agent]);

  return executionState;
}
