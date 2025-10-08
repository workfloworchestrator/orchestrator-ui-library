import React from 'react';

import type { PydanticFormControlledElement } from 'pydantic-forms';

import { EuiTextArea } from '@elastic/eui';

export const WfoTextArea: PydanticFormControlledElement = ({
    pydanticFormField,
    onChange,
    value,
    disabled,
}) => {
    return (
        <EuiTextArea
            data-testid={pydanticFormField.id}
            disabled={disabled}
            name={pydanticFormField.id}
            onChange={(event) => onChange(event.target.value)}
            value={value ?? ''}
            id={`input-${pydanticFormField.id}`}
            fullWidth
        />
    );
};
