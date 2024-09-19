import React, { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FC } from 'react';

import { EuiInlineEditText } from '@elastic/eui';

import { useStartProcessMutation } from '@/rtk/endpoints/forms';
import type { Subscription } from '@/types';

interface WfoInlineNoteEditProps {
    value: Subscription['note'];
    subscriptionId?: Subscription['subscriptionId'];
    onlyShowOnHover?: boolean;
}

export const WfoInlineNoteEdit: FC<WfoInlineNoteEditProps> = ({
    value,
    subscriptionId,
    onlyShowOnHover = false,
}) => {
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

    const initialNote = useMemo(() => value || '', [value]);
    const [note, setNote] = useState<string>(initialNote);

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
            <EuiInlineEditText
                inputAriaLabel="Edit note"
                value={note}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setNote(e.target.value);
                }}
                onCancel={() => setNote(initialNote)}
                onSave={() => triggerNoteModifyWorkflow()}
                size={'s'}
                css={{
                    '.euiFlexItem:nth-of-type(2)': { justifyContent: 'center' },
                }}
                readModeProps={{
                    css: {
                        '.euiIcon': {
                            visibility: onlyShowOnHover ? 'hidden' : 'visible',
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
        </div>
    );
};
