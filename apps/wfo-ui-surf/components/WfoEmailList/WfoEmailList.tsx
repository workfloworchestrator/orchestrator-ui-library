import React, { Ref, useImperativeHandle, useRef } from 'react';

import { EuiSpacer, EuiText } from '@elastic/eui';
import { upperCaseFirstChar } from '@orchestrator-ui/orchestrator-ui-components';

import { WfoEmailStep } from '@/components/WfoEmailList/WfoEmailStep';
import { WfoSendEmailButton } from '@/components/WfoEmailList/WfoSendEmailButton';
import { EmailListItem } from '@/types';

export type WfoStepListRef = {
    scrollToStep: (stepId: string) => void;
};

export type WfoEmailListProps = {
    stepListItems: EmailListItem[];
    showHiddenKeys: boolean;
    onToggleExpandStepListItem: (EmailListItem: EmailListItem) => void;
    onTriggerExpandStepListItem: (EmailListItem: EmailListItem) => void;
};

type EmailGroup = {
    [key: string]: EmailListItem[];
};

export const WfoEmailList = React.forwardRef(
    (
        {
            stepListItems,
            showHiddenKeys,
            onToggleExpandStepListItem,
            onTriggerExpandStepListItem,
        }: WfoEmailListProps,
        reference: Ref<WfoStepListRef>,
    ) => {
        const stepReferences = useRef(new Map<string, HTMLDivElement>());

        useImperativeHandle(reference, () => ({
            scrollToStep: async (stepId: string) => {
                // Applied a promise construction to wait for the browser to expand the step before scrolling
                try {
                    await new Promise((resolve, reject) => {
                        const foundStepListItem = stepListItems.find((value) =>
                            'stepId' in value.step
                                ? value.step.stepId === stepId
                                : false,
                        );

                        if (!foundStepListItem) {
                            return reject(undefined);
                        }

                        return resolve(
                            onTriggerExpandStepListItem(foundStepListItem),
                        );
                    });
                    stepReferences.current.get(stepId)?.scrollIntoView({
                        behavior: 'smooth',
                    });
                } catch {
                    console.error(
                        'Error scrolling to step with stepId ',
                        stepId,
                    );
                }
            },
        }));

        const getReferenceCallbackForStepId =
            (stepId: string) => (node: HTMLDivElement | null) =>
                node
                    ? stepReferences.current.set(stepId, node)
                    : stepReferences.current.delete(stepId);

        const groupedStepListItems = stepListItems.reduce(
            (grouped: EmailGroup, emailListItem) => {
                const status = emailListItem.step.status;
                const groupIndex = status ? status.toUpperCase() : '';

                if (!grouped[groupIndex]) {
                    grouped[groupIndex] = [];
                }

                grouped[groupIndex].push(emailListItem);

                return grouped;
            },
            {},
        );

        return (
            <>
                {Object.entries(groupedStepListItems).map(([key, value]) => {
                    return (
                        <div key={`step-${key}`}>
                            <EuiText>
                                <b>{upperCaseFirstChar(key)}</b>
                            </EuiText>
                            <EuiSpacer size="s" />
                            {value.map(
                                (emailListItem: EmailListItem, index) =>
                                    !emailListItem.isButton && (
                                        <div key={`step-${index}`}>
                                            <WfoEmailStep
                                                ref={getReferenceCallbackForStepId(
                                                    'stepId' in
                                                        emailListItem.step
                                                        ? emailListItem.step
                                                              .stepId
                                                        : '',
                                                )}
                                                onToggleStepDetail={() =>
                                                    onToggleExpandStepListItem(
                                                        emailListItem,
                                                    )
                                                }
                                                emailListItem={emailListItem}
                                                showHiddenKeys={showHiddenKeys}
                                            />
                                            <EuiSpacer />
                                        </div>
                                    ),
                            )}
                            {value.map(
                                (emailListItem: EmailListItem, index: number) =>
                                    emailListItem.isButton && (
                                        <WfoSendEmailButton
                                            key={`button-${index}`}
                                            emailListItem={emailListItem}
                                        />
                                    ),
                            )}
                            <EuiSpacer size="xxl" />
                        </div>
                    );
                })}
            </>
        );
    },
);
WfoEmailList.displayName = 'WfoEmailList';
