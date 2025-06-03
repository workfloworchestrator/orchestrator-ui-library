import React from 'react';

import type { RowRenderComponent } from 'pydantic-forms';

import { EuiFormRow, EuiText } from '@elastic/eui';

import { getCommonFormFieldStyles } from '@/components/WfoForms/formFields/commonStyles';
import { useWithOrchestratorTheme } from '@/hooks';

export const Row: RowRenderComponent = ({
    title,
    description,
    error,
    isInvalid,
    children,
}) => {
    const { formRowStyle } = useWithOrchestratorTheme(getCommonFormFieldStyles);
    return (
        <EuiFormRow
            css={formRowStyle}
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
