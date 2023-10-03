import React, { Ref, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Step } from '../../../types';
import { WFOStepListHeader } from './WFOStepListHeader';
import { WFOStepsRawJson } from '../WFOStepsRawJson';
import { WFOStepList, WFOStepListRef } from '../WFOStepList';

export interface WFOWorkflowStepListProps {
    steps: Step[];
    startedAt: string;
}

export const WFOWorkflowStepList = React.forwardRef(
    (
        { steps = [], startedAt }: WFOWorkflowStepListProps,
        reference: Ref<WFOStepListRef>,
    ) => {
        const [showHiddenKeys, setShowHiddenKeys] = useState(false);
        const [showRaw, setShowRaw] = useState(false);

        const t = useTranslations('processes.steps');

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

        return (
            <>
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

                {showRaw ? (
                    <WFOStepsRawJson steps={steps} />
                ) : (
                    <WFOStepList
                        ref={reference}
                        steps={steps}
                        toggleStepDetailIsOpen={toggleStepDetailIsOpen}
                        stepDetailStates={stepDetailStates}
                        startedAt={startedAt}
                        showHiddenKeys={showHiddenKeys}
                    />
                )}
            </>
        );
    },
);

WFOWorkflowStepList.displayName = 'WFOWorkflowStepList';
