import React from 'react';

import _ from 'lodash';
import type { PydanticFormControlledElement } from 'pydantic-forms';
import { getFormFieldIdWithPath } from 'pydantic-forms';

import { EuiFieldNumber } from '@elastic/eui';
import { css } from '@emotion/react';

import type { UseOrchestratorThemeProps } from '@/hooks';
import { useWithOrchestratorTheme } from '@/hooks';

const getFormFieldsBaseStyle = ({ theme }: UseOrchestratorThemeProps) => {
    const formFieldBaseStyle = css({
        backgroundColor: theme.colors.backgroundBasePlain,
        color: theme.colors.textParagraph,
        '&:focus': {
            backgroundColor: theme.colors.backgroundBaseNeutral,
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

    // If the field is part of an array the value is passed in as an object with the field name as key
    // this is imposed by react-hook-form. We try to detect this and extract the actual value
    const fieldName = getFormFieldIdWithPath(pydanticFormField.id);
    const fieldValue =
        _.isObject(value) && _.has(value, fieldName)
            ? _.get(value, fieldName)
            : value;

    return (
        <EuiFieldNumber
            data-testid={pydanticFormField.id}
            css={formFieldBaseStyle}
            name={pydanticFormField.id}
            onChange={(event) =>
                onChange(
                    event.target.value ? parseInt(event.target.value) : null,
                )
            }
            value={fieldValue}
            disabled={disabled}
        />
    );
};
