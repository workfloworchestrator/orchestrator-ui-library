import React from 'react';

import type { RowRenderComponent } from 'pydantic-forms';

import { EuiFormRow, EuiText } from '@elastic/eui';

import { getCommonFormFieldStyles, getDataTestId } from '@/components';
import { useWithOrchestratorTheme } from '@/hooks';

export const Row: RowRenderComponent = ({
    title,
    description,
    error,
    isInvalid,
    required,
    children,
}) => {
    const { formRowStyle, errorStyle } = useWithOrchestratorTheme(
        getCommonFormFieldStyles,
    );

    const Label = () => {
        return title ? (
            <div css={error && errorStyle}>
                {title} {required && '*'}
            </div>
        ) : undefined;
    };

    return (
        <EuiFormRow
            data-testid={getDataTestId('pydantic-form-row', title)}
            css={formRowStyle}
            label={<Label />}
            labelAppend={<EuiText size="m">{description}</EuiText>}
            error={error}
            isInvalid={isInvalid}
            fullWidth
        >
            <>{children}</>
        </EuiFormRow>
    );
};
