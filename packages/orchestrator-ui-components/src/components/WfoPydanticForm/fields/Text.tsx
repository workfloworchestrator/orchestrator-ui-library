import React from 'react';

import type { PydanticFormControlledElement } from 'pydantic-forms';

import { EuiFieldText } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';
import { getFormFieldsBaseStyle } from '@/theme';

export const Text: PydanticFormControlledElement = ({
    onChange,
    value,
    disabled,
}) => {
    const { formFieldBaseStyle } = useWithOrchestratorTheme(
        getFormFieldsBaseStyle,
    );

    return (
        <EuiFieldText
            css={formFieldBaseStyle}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            value={value ?? ''}
            fullWidth
        />
    );
};
