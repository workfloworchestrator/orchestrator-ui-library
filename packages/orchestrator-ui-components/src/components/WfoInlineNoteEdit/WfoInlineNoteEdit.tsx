import React, { useEffect, useState } from 'react';
import type { ChangeEvent, FC } from 'react';

import { EuiInlineEditText } from '@elastic/eui';

import { WfoToolTip } from '@/components';
import { useOrchestratorTheme } from '@/hooks';
import { useStartProcessMutation } from '@/rtk/endpoints/forms';
import type { Subscription } from '@/types';
import { useGetSubscriptionListQuery, useUpdateSubscriptionNoteLocallyMutation } from '@/rtk';

interface WfoInlineNoteEditProps {
    value: Subscription['note'];
    subscriptionId: Subscription['subscriptionId'];
    onlyShowOnHover?: boolean;
    graphqlQueryVariables: Record<string, unknown>;
}

// This is an invisible character that is used to get the component re-rendering correctly
const INVISIBLE_CHARACTER = '‎';

export const WfoInlineNoteEdit: FC<WfoInlineNoteEditProps> = ({
    // value,
    subscriptionId,
    onlyShowOnHover = false,
    graphqlQueryVariables,
}) => {
    const { theme } = useOrchestratorTheme();
    const {subscriptionItem} = useGetSubscriptionListQuery(
        graphqlQueryVariables,{
            selectFromResult: (result) => ({subscriptionItem: result?.data?.subscriptions.find((sub) => sub.subscriptionId === subscriptionId)}),
        }
    );

    console.log("WfoInlineEditData: ", subscriptionItem);
    const noteFromData = subscriptionItem?.note?.trim() ? subscriptionItem.note : INVISIBLE_CHARACTER;
    const [note, setNote] = useState<string>(noteFromData);
    const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(true);

    const [startProcess] = useStartProcessMutation();
    const [updateSub] = useUpdateSubscriptionNoteLocallyMutation();

    // const store = useStore();
    // const cachedQueies = store.getState().orchestratorApi.queries;
    // console.log("Cached Queries: ", cachedQueies);

    const triggerNoteModifyWorkflow = () => {
        const noteModifyPayload = [
            { subscription_id: subscriptionId },
            { note: (note === INVISIBLE_CHARACTER) ? "" : note },
        ];
        startProcess({
            workflowName: 'modify_note',
            userInputs: noteModifyPayload,
        });

        updateSub({ subscriptionId: subscriptionId, graphQlQueryVariables: graphqlQueryVariables, note: note });
        // console.log("Updated,", updated);
    };

    const handleSave = () => {
        triggerNoteModifyWorkflow();
        setIsTooltipVisible(true);
    };

    const handleCancel = () => {
        setNote(noteFromData);
        setIsTooltipVisible(true);
    };

    // This useEffect makes sure the note is updated when a new value property is passed in
    // for example by a parent component that is update through a websocket event
    useEffect(() => {
        setNote(noteFromData);
    }, [noteFromData]);

    return (
        <div
            css={{
                width: '100%',
                ':hover': {
                    '.euiIcon': {
                        visibility: 'visible',
                    },
                },
            }}
        >
            <WfoToolTip
                css={{ visibility: isTooltipVisible && note !== INVISIBLE_CHARACTER ? 'visible' : 'hidden' }}
                tooltipContent={note}
            >
                <span><EuiInlineEditText
                    inputAriaLabel='Edit note'
                    value={note}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setNote(e.target.value);
                    }}
                    onCancel={handleCancel}
                    onSave={handleSave}
                    size={'s'}
                    css={{
                        width: theme.base * 16,
                        '.euiFlexItem:nth-of-type(2)': {
                            justifyContent: 'center',
                        },
                        '.euiButtonEmpty__content': {
                            justifyContent: 'left',
                        },
                    }}
                    readModeProps={{
                        onClick: () => setIsTooltipVisible(false),
                        title: '',
                        css: {
                            minWidth: '100%',
                            '.euiIcon': {
                                visibility: onlyShowOnHover
                                    ? 'hidden'
                                    : 'visible',
                            },
                        },
                    }}
                    editModeProps={{
                        saveButtonProps: {
                            color: 'primary',
                            size: 'xs',
                        },
                        cancelButtonProps: {
                            color: 'danger',
                            size: 'xs',
                        },
                        inputProps: {
                            css: {
                                justifyContent: 'left',
                                height: '32px',
                                paddingLeft: '4px',
                                margin: '0',
                                width: '98%',
                            },
                        },
                        formRowProps: {
                            css: {
                                padding: 0,
                                margin: 0,
                                height: '32px',
                                '.euiFormRow__fieldWrapper': {
                                    minHeight: '32px',
                                    height: '32px',
                                    padding: 0,
                                    margin: 0,
                                },
                            },
                        },
                    }}
                /></span>
            </WfoToolTip>
        </div>
    );
};
