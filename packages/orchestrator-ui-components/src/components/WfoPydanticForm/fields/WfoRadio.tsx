import React from 'react';

import type { PydanticFormControlledElement } from 'pydantic-forms';

import { EuiRadioGroup } from '@elastic/eui';

export const WfoRadio: PydanticFormControlledElement = ({
    pydanticFormField,
    onChange,
    value,
    disabled,
}) => {
    const radioOptions = pydanticFormField.options?.map((option) => ({
        id: option.value,
        label: option.label,
    }));

    return (
        <EuiRadioGroup
            data-testid={pydanticFormField.id}
            options={radioOptions || []}
            idSelected={value}
            onChange={(id) => onChange(id)}
            name={pydanticFormField.id}
            disabled={disabled}
        />
    );
};
