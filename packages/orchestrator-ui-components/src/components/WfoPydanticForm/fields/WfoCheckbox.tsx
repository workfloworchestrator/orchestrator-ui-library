import React from 'react';

import type { PydanticFormControlledElement } from 'pydantic-forms';

import { EuiCheckbox } from '@elastic/eui';

export const WfoCheckbox: PydanticFormControlledElement = ({
    pydanticFormField,
    onChange,
    value,
    disabled,
}) => {
    return (
        <EuiCheckbox
            data-testid={pydanticFormField.id}
            checked={value || false}
            disabled={disabled}
            id={pydanticFormField.id}
            label={pydanticFormField.title || <div>&nbsp;</div>}
            onChange={() => !disabled && onChange(!value)}
        />
    );
};
