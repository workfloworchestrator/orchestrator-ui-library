import React from 'react';

import { PydanticFormElement } from 'pydantic-forms';

import { useOrchestratorTheme } from '@/hooks';

export const Label: PydanticFormElement = ({ pydanticFormField }) => {
    const { theme } = useOrchestratorTheme();

    return (
        <label
            css={{ color: theme.colors.text }}
            id={pydanticFormField.id}
            className={`euiFormLabel euiFormRow__label${
                pydanticFormField.default ? '__large' : ''
            }`}
        >
            {pydanticFormField.default}
        </label>
    );
};
