import React, { useEffect, useState } from 'react';
import type { ChangeEvent, FC } from 'react';

import { EuiInlineEditText } from '@elastic/eui';

import { WfoToolTip } from '@/components';
import { useOrchestratorTheme } from '@/hooks';
import { INVISIBLE_CHARACTER } from '@/utils';

interface WfoInlineEditProps {
    value: string;
    onlyShowOnHover?: boolean;
    onSave?: (note: string) => void;
}

export const WfoInlineEdit: FC<WfoInlineEditProps> = ({
    value,
    onlyShowOnHover = false,
    onSave = () => {},
}) => {
    const { theme } = useOrchestratorTheme();
    const [note, setValue] = useState<string>(value);
    const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(true);

    const handleSave = () => {
        onSave(note);
        setIsTooltipVisible(true);
    };

    const handleCancel = () => {
        setValue(value);
        setIsTooltipVisible(true);
    };

    // This useEffect makes sure the note is updated when a new value property is passed in
    // for example by a parent component that is update through a websocket event
    useEffect(() => {
        setValue(value);
    }, [value]);

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
                css={{
                    visibility:
                        isTooltipVisible && note !== INVISIBLE_CHARACTER
                            ? 'visible'
                            : 'hidden',
                }}
                tooltipContent={note}
            >
                <span>
                    <EuiInlineEditText
                        inputAriaLabel="Edit field"
                        value={note}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setValue(e.target.value);
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
                </span>
            </WfoToolTip>
        </div>
    );
};
