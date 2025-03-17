import React from 'react';

import type { PydanticFormControlledElement } from 'pydantic-forms';

import { EuiTextArea } from '@elastic/eui';

export const TextArea: PydanticFormControlledElement = ({
    pydanticFormField,
    onChange,
    value,
    disabled,
}) => {
    return (
        <EuiTextArea
            disabled={disabled}
            name={pydanticFormField.id}
            onChange={(event) => onChange(event.target.value)}
            value={value ?? ''}
            fullWidth
        />
    );
};
