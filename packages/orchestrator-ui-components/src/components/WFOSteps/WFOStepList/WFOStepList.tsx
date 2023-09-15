import React, { useState } from 'react';
import { EuiFlexGroup, EuiButton, EuiText } from '@elastic/eui';
import { useTranslations } from 'next-intl';
import { Step } from '../../../types';
import { WFOStep } from '../WFOStep/WFOStep';
import { getStyles } from '../getStyles';
import { useOrchestratorTheme } from '../../../hooks';

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

    const {
        stepSpacerStyle,
        stepListHeaderStyle,
        stepListContentStyle,
        stepListContentBoldTextStyle,
        stepListContentAnchorStyle,
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
                    css={{ flexGrow: 0 }}
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
                        iconType="visVega"
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
                        iconType="eye"
                        iconSide="right"
                        size="s"
                    >
                        {t('viewOptions')}
                    </EuiButton>
                </EuiFlexGroup>
            </EuiFlexGroup>
            <>
                {steps.map((step, index) => {
                    const stepComponent = (
                        <div key={`step-${index}`}>
                            {index !== 0 && <div css={stepSpacerStyle} />}
                            <WFOStep
                                stepDetailIsOpen={
                                    stepDetailStates.get(index) || false
                                }
                                toggleStepDetailIsOpen={toggleStepDetailIsOpen}
                                step={step}
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
        </>
    );
};
