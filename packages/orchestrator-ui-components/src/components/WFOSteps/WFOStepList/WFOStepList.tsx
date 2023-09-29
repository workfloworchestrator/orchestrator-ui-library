import React, { Ref, useImperativeHandle, useRef, useState } from 'react';
import {
    EuiButton,
    EuiCodeBlock,
    EuiFlexGroup,
    EuiForm,
    EuiFormRow,
    EuiPopover,
    EuiSwitch,
    EuiText,
} from '@elastic/eui';
import { useTranslations } from 'next-intl';
import { Step, StepStatus } from '../../../types';
import { WFOStep } from '../WFOStep';
import { getStyles } from '../getStyles';
import { useOrchestratorTheme } from '../../../hooks';
import { stateDelta } from '../../../utils';
import { WFOCode, WFOEyeFill } from '../../../icons';

export type WFOStepListRef = {
    scrollToStep: (stepId: string) => void;
};

export interface WFOStepListProps {
    steps: Step[];
    startedAt: string;
}

export const WFOStepList = React.forwardRef(
    (
        { steps = [], startedAt }: WFOStepListProps,
        reference: Ref<WFOStepListRef>,
    ) => {
        const { theme } = useOrchestratorTheme();
        const stepReferences = useRef(new Map<string, HTMLDivElement>());
        const [showHiddenKeys, setShowHiddenKeys] = useState(false);
        const [showRaw, setShowRaw] = useState(false);
        const [isViewOptionOpen, setIsViewOptionOpen] = useState(false);

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

        const onViewOptionClick = () =>
            setIsViewOptionOpen((isViewOptionOpen) => !isViewOptionOpen);
        const closeViewOption = () => setIsViewOptionOpen(false);

        const viewOptionButton = (
            <EuiButton
                onClick={onViewOptionClick}
                iconType={() => <WFOEyeFill color={theme.colors.link} />}
                iconSide="right"
                size="s"
            >
                {t('viewOptions')}
            </EuiButton>
        );

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
                            onClick={toggleAllDetailsIsOpen}
                        >
                            {Array.from(stepDetailStates).every((s) => s[1])
                                ? t('collapseAll')
                                : t('expandAll')}
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
                            iconType={() => (
                                <WFOCode color={theme.colors.link} />
                            )}
                        >
                            {t('showDelta')}
                        </EuiButton>
                        <EuiPopover
                            button={viewOptionButton}
                            isOpen={isViewOptionOpen}
                            closePopover={closeViewOption}
                            display="block"
                        >
                            <div>
                                <EuiForm component="form">
                                    <EuiFormRow>
                                        <EuiSwitch
                                            label="Hidden keys"
                                            checked={showHiddenKeys}
                                            onChange={(e) => {
                                                setShowHiddenKeys(
                                                    e.target.checked,
                                                );
                                                closeViewOption();
                                            }}
                                        />
                                    </EuiFormRow>
                                    <EuiFormRow>
                                        <EuiSwitch
                                            label="Raw JSON data"
                                            checked={showRaw}
                                            onChange={(e) => {
                                                setShowRaw(e.target.checked);
                                                closeViewOption();
                                            }}
                                        />
                                    </EuiFormRow>
                                </EuiForm>
                            </div>
                        </EuiPopover>
                    </EuiFlexGroup>
                </EuiFlexGroup>
                {showRaw && renderRaw()}
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

WFOStepList.displayName = 'WFOStepList';
