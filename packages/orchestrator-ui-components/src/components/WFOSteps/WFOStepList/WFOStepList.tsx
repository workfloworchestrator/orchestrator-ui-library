import React from 'react';
import { EuiFlexGroup, EuiButton, EuiText } from '@elastic/eui';
import { useTranslations } from 'next-intl';
import { Step } from '../../../types';
import { WFOStep } from '../WFOStep/WFOStep';
import { getStyles } from '../getStyles';
import { useOrchestratorTheme } from '../../../hooks';

export interface WFOStepListProps {
    steps: Step[];
}

export const WFOStepList = ({ steps }: WFOStepListProps) => {
    const { theme } = useOrchestratorTheme();
    const t = useTranslations('processes.steps');
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
                        onClick={() => alert('TODO: Implement expand all')}
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
                {steps.map((step, index) => (
                    <>
                        {index !== 0 && <div css={stepSpacerStyle}></div>}
                        <WFOStep step={step} key={index} />
                    </>
                ))}
            </>
        </>
    );
};
