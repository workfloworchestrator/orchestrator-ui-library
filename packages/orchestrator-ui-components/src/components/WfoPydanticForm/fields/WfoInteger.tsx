import React from 'react';

import type { PydanticFormControlledElement } from 'pydantic-forms';

import { EuiFieldNumber } from '@elastic/eui';
import { css } from '@emotion/react';

import type { WfoTheme } from '@/hooks';
import { useWithOrchestratorTheme } from '@/hooks';

const getFormFieldsBaseStyle = ({ theme }: WfoTheme) => {
    const formFieldBaseStyle = css({
        backgroundColor: theme.colors.body,
        color: theme.colors.text,
        '&:focus': {
            backgroundColor: theme.colors.emptyShade,
        },
    });

    return {
        formFieldBaseStyle,
    };
};

export const WfoInteger: PydanticFormControlledElement = ({
    pydanticFormField,
    onChange,
    value,
    disabled,
}) => {
    const { formFieldBaseStyle } = useWithOrchestratorTheme(
        getFormFieldsBaseStyle,
    );

    return (
        <EuiFieldNumber
            data-testid={pydanticFormField.id}
            css={formFieldBaseStyle}
            name={pydanticFormField.id}
            onChange={(event) => onChange(parseInt(event.target.value))}
            value={value}
            disabled={disabled}
        />
    );
};
