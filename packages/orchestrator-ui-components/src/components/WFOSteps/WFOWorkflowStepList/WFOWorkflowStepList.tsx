import React, { Ref, useImperativeHandle, useRef, useState } from 'react';
import { EuiCodeBlock } from '@elastic/eui';
import { useTranslations } from 'next-intl';
import { Step, StepStatus } from '../../../types';
import { WFOStep } from '../WFOStep';
import { getStyles } from '../getStyles';
import { useOrchestratorTheme } from '../../../hooks';
import { stateDelta } from '../../../utils';
import { WFOStepListHeader } from './WFOStepListHeader';

export type WFOWorkflowStepListRef = {
    scrollToStep: (stepId: string) => void;
};

export interface WFOWorkflowStepListProps {
    steps: Step[];
    startedAt: string;
}

export const WFOWorkflowStepList = React.forwardRef(
    (
        { steps = [], startedAt }: WFOWorkflowStepListProps,
        reference: Ref<WFOWorkflowStepListRef>,
    ) => {
        const { theme } = useOrchestratorTheme();
        const stepReferences = useRef(new Map<string, HTMLDivElement>());
        const [showHiddenKeys, setShowHiddenKeys] = useState(false);
        const [showRaw, setShowRaw] = useState(false);

        const getReferenceCallbackForStepId =
            (stepId: string) => (node: HTMLDivElement | null) =>
                node
                    ? stepReferences.current.set(stepId, node)
                    : stepReferences.current.delete(stepId);

        useImperativeHandle(reference, () => ({
            scrollToStep: (stepId: string) =>
                stepReferences.current.get(stepId)?.scrollIntoView({
                    behavior: 'smooth',
                }),
        }));

        const t = useTranslations('processes.steps');
        let stepStartTime = startedAt;

        const allDetailsClosedState = new Map(
            steps.map((_, index) => [index, false]),
        );
        const allDetailsOpenedState = new Map(
            steps.map((_, index) => [index, true]),
        );

        const [stepDetailStates, setStepDetailStates] = useState<
            Map<number, boolean>
        >(new Map(allDetailsClosedState));

        const toggleAllDetailsIsOpen = () => {
            if (Array.from(stepDetailStates).every((s) => s[1])) {
                setStepDetailStates(new Map(allDetailsClosedState));
            } else {
                setStepDetailStates(new Map(allDetailsOpenedState));
            }
        };

        const toggleStepDetailIsOpen = (index: number) => {
            if (stepDetailStates.has(index)) {
                setStepDetailStates(
                    new Map(
                        stepDetailStates.set(
                            index,
                            !stepDetailStates.get(index),
                        ),
                    ),
                );
            }
        };

        const renderRaw = () => {
            const json = JSON.stringify(steps, null, 4);
            return (
                <div>
                    <EuiCodeBlock
                        isCopyable={true}
                        language={'json'}
                        lineNumbers={true}
                        overflowHeight={6000}
                    >
                        {json}
                    </EuiCodeBlock>
                </div>
            );
        };

        const { stepSpacerStyle } = getStyles(theme);

        return (
            <>
                {/* Steps header with control buttons */}
                <WFOStepListHeader
                    showHiddenKeys={showHiddenKeys}
                    showRaw={showRaw}
                    allDetailToggleText={
                        Array.from(stepDetailStates).every((s) => s[1])
                            ? t('collapseAll')
                            : t('expandAll')
                    }
                    onChangeShowHiddenKeys={setShowHiddenKeys}
                    onChangeShowRaw={setShowRaw}
                    onToggleAllDetailsIsOpen={toggleAllDetailsIsOpen}
                />
                {/* RAW JSON DATA */}
                {showRaw && renderRaw()}
                {/* STEP LIST */}
                {!showRaw && (
                    <>
                        {steps.map((step, index) => {
                            let previousState = {};
                            let delta = {};

                            if (index > 0) {
                                // Todo: decided if we want this here. A refactor would be nice, or move to global state.
                                //  V1 has a rather big case statement with business logic here
                                if (step.status === StepStatus.SUCCESS) {
                                    // Prepare a delta with the last successful step
                                    let previousIndex = index - 1;
                                    while (
                                        previousIndex > 0 &&
                                        (steps[previousIndex].status ===
                                            StepStatus.FAILED ||
                                            steps[previousIndex].status ===
                                                StepStatus.WAITING)
                                    ) {
                                        previousIndex--;
                                    }
                                    previousState = steps[previousIndex].state;
                                    delta = stateDelta(
                                        previousState,
                                        step.state,
                                    );
                                }

                                // if (step.status === StepStatus.PENDING) {
                                //     if (step.hasOwnProperty("form")) {
                                //         Object.keys(step.form.properties as {})
                                //             .sort()
                                //             .reduce<{ [index: string]: any }>((acc, field) => {
                                //                 acc[field] = "";
                                //                 return acc;
                                //             }, {});
                                //     }
                                // }

                                if (
                                    step.status === StepStatus.WAITING ||
                                    step.status === StepStatus.FAILED
                                ) {
                                    // Pass complete state as a waiting step has separate state
                                    delta = step.state;
                                }
                            } else {
                                // Todo: handle failed first step (seems to be special)
                                delta = step.state;
                            }

                            const stepComponent = (
                                <div key={`step-${index}`}>
                                    {index !== 0 && (
                                        <div css={stepSpacerStyle} />
                                    )}
                                    <WFOStep
                                        ref={getReferenceCallbackForStepId(
                                            step.stepId,
                                        )}
                                        stepDetailIsOpen={
                                            stepDetailStates.get(index) || false
                                        }
                                        toggleStepDetailIsOpen={
                                            toggleStepDetailIsOpen
                                        }
                                        step={step}
                                        delta={delta}
                                        stepIndex={index}
                                        startedAt={stepStartTime}
                                        showHiddenKeys={showHiddenKeys}
                                    />
                                </div>
                            );

                            if (index > 0) {
                                stepStartTime = step.executed;
                            }
                            return stepComponent;
                        })}
                    </>
                )}
            </>
        );
    },
);

WFOWorkflowStepList.displayName = 'WFOWorkflowStepList';
