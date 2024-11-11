import React, { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FC } from 'react';

import { EuiInlineEditText } from '@elastic/eui';

import { WfoToolTip } from '@/components';
import { useOrchestratorTheme } from '@/hooks';
import { useStartProcessMutation } from '@/rtk/endpoints/forms';
import type { Subscription } from '@/types';

interface WfoInlineNoteEditProps {
    value: Subscription['note'];
    subscriptionId?: Subscription['subscriptionId'];
    onlyShowOnHover?: boolean;
    onNoteUpdate?: (note: string) => void;
}

export const WfoInlineNoteEdit: FC<WfoInlineNoteEditProps> = ({
    value,
    subscriptionId,
    onlyShowOnHover = false,
}) => {
    const { theme } = useOrchestratorTheme();
    const initialNote = useMemo(() => value || '', [value]);
    const [note, setNote] = useState<string>(initialNote);
    const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(true);

    const [startProcess] = useStartProcessMutation();
    const triggerNoteModifyWorkflow = () => {
        const noteModifyPayload = [
            { subscription_id: subscriptionId },
            { note },
        ];
        startProcess({
            workflowName: 'modify_note',
            userInputs: noteModifyPayload,
        });
    };

    const handleSave = () => {
        triggerNoteModifyWorkflow();
        setIsTooltipVisible(true);
    };

    const handleCancel = () => {
        setNote(initialNote);
        setIsTooltipVisible(true);
    };

    // This useEffect makes sure the note is updated when a new value property is passed in
    // for example by a parent component that is update through a websocket event
    useEffect(() => {
        setNote(initialNote);
    }, [initialNote]);

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
                css={{ visibility: isTooltipVisible ? 'visible' : 'hidden' }}
                tooltipContent={note}
            >
                <EuiInlineEditText
                    inputAriaLabel="Edit note"
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
                />
            </WfoToolTip>
        </div>
    );
};
