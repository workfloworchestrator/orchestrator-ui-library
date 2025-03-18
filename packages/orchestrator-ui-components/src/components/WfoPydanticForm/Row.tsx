import React from 'react';

import type { RowRenderer } from 'pydantic-forms';

import { EuiFormRow, EuiText } from '@elastic/eui';

import { getCommonFormFieldStyles } from '@/components/WfoForms/formFields/commonStyles';
import { useWithOrchestratorTheme } from '@/hooks';

export const Row: RowRenderer = ({
    title,
    description,
    error,
    isInvalid,
    children,
}) => {
    const { formRowStyle } = useWithOrchestratorTheme(getCommonFormFieldStyles);
    return (
        <EuiFormRow
            css={{
                '.euiFormRow__labelWrapper': {
                    display: 'flex',
                    flexDirection: 'column',
                },
                ...formRowStyle,
            }}
            label={title}
            labelAppend={<EuiText size="m">{description}</EuiText>}
            error={error}
            isInvalid={isInvalid}
            fullWidth
        >
            <div>{children}</div>
        </EuiFormRow>
    );
};
