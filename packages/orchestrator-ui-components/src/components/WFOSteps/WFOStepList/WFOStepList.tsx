import React, { useRef, useState } from 'react';
import { EuiButton, EuiFlexGroup, EuiText } from '@elastic/eui';
import { useTranslations } from 'next-intl';
import { Step, StepStatus } from '../../../types';
import { WFOStep } from '../WFOStep';
import { getStyles } from '../getStyles';
import { useOrchestratorTheme } from '../../../hooks';
import { stateDelta } from '../../../utils';
import { WFOCode, WFOEyeFill } from '../../../icons';

export interface WFOStepListProps {
    steps: Step[];
    startedAt: string;
}

export const WFOStepList = ({ steps = [], startedAt }: WFOStepListProps) => {
    const { theme } = useOrchestratorTheme();
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

    const openAllDetails = () =>
        setStepDetailStates(new Map(allDetailsOpenedState));

    const toggleStepDetailIsOpen = (index: number) => {
        if (stepDetailStates.has(index)) {
            setStepDetailStates(
                new Map(
                    stepDetailStates.set(index, !stepDetailStates.get(index)),
                ),
            );
        }
    };

    const testStepsWithRefs = steps.map((step, index) => {
        return {
            ...step,
            ref: useRef<HTMLDivElement>(null),
        };
    });
    console.log(testStepsWithRefs);
    const testRenderedSteps = testStepsWithRefs.map((step, index) => {
        return (
            <WFOStep
                key={index}
                ref={step.ref}
                stepDetailIsOpen={stepDetailStates.get(index) || false}
                toggleStepDetailIsOpen={toggleStepDetailIsOpen}
                step={step}
                delta={{ delta: 'nothing' }}
                stepIndex={index}
                startedAt={stepStartTime}
            />
        );
    });

    const {
        stepSpacerStyle,
        stepListHeaderStyle,
        stepListContentStyle,
        stepListContentBoldTextStyle,
        stepListContentAnchorStyle,
        stepListOptionsContainerStyle,
    } = getStyles(theme);

    return (
        <>
            <EuiFlexGroup css={stepListHeaderStyle}>
                <EuiFlexGroup css={stepListContentStyle}>
                    <EuiText css={stepListContentBoldTextStyle}>
                        {t('steps')}
                    </EuiText>
                    <EuiText
                        css={stepListContentAnchorStyle}
                        onClick={openAllDetails}
                    >
                        {t('expandAll')}
                    </EuiText>
                </EuiFlexGroup>
                <EuiFlexGroup
                    justifyContent="flexEnd"
                    direction="row"
                    css={stepListOptionsContainerStyle}
                    gutterSize="s"
                >
                    <EuiButton
                        onClick={(
                            e: React.MouseEvent<
                                HTMLButtonElement | HTMLElement,
                                MouseEvent
                            >,
                        ) => {
                            e.preventDefault();
                            alert('TODO: Implement Show delta');
                        }}
                        iconSide="right"
                        size="s"
                        iconType={() => <WFOCode color={theme.colors.link} />}
                    >
                        {t('showDelta')}
                    </EuiButton>
                    <EuiButton
                        onClick={(
                            e: React.MouseEvent<
                                HTMLButtonElement | HTMLElement,
                                MouseEvent
                            >,
                        ) => {
                            e.preventDefault();
                            alert('TODO: Implement View options');
                        }}
                        iconType={() => (
                            <WFOEyeFill color={theme.colors.link} />
                        )}
                        iconSide="right"
                        size="s"
                    >
                        {t('viewOptions')}
                    </EuiButton>
                </EuiFlexGroup>
            </EuiFlexGroup>
            <>
                {testStepsWithRefs.map((step, index) => {
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
                            delta = stateDelta(previousState, step.state);
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
                            {index !== 0 && <div css={stepSpacerStyle} />}
                            <WFOStep
                                ref={step.ref}
                                stepDetailIsOpen={
                                    stepDetailStates.get(index) || false
                                }
                                toggleStepDetailIsOpen={toggleStepDetailIsOpen}
                                step={step}
                                delta={delta}
                                stepIndex={index}
                                startedAt={stepStartTime}
                            />
                        </div>
                    );

                    if (index > 0) {
                        stepStartTime = step.executed;
                    }
                    return stepComponent;
                })}
            </>
            {/*<h1>Some Test -- Dont forget to remove</h1>*/}
            {/*<EuiButton*/}
            {/*    onClick={() =>*/}
            {/*        testStepsWithRefs[10].ref.current?.scrollIntoView({*/}
            {/*            behavior: 'smooth',*/}
            {/*        })*/}
            {/*    }*/}
            {/*></EuiButton>*/}
            {/*<>{testRenderedSteps}</>*/}
        </>
    );
};
