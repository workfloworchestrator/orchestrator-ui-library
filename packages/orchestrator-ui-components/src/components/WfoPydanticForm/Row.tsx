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
    required,
    children,
}) => {
    const { formRowStyle, errorStyle } = useWithOrchestratorTheme(
        getCommonFormFieldStyles,
    );

    return (
        <EuiFormRow
            css={formRowStyle}
            label={
                title ? (
                    <EuiText size="m">
                        <div css={error && errorStyle}>
                            {title} {required && '*'}
                        </div>
                    </EuiText>
                ) : undefined
            }
            labelAppend={<EuiText size="m">{description}</EuiText>}
            error={error}
            isInvalid={isInvalid}
            fullWidth
        >
            <>{children}</>
        </EuiFormRow>
    );
};
