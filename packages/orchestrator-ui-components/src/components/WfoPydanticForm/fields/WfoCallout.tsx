import React from 'react';

import { PydanticFormElementProps } from 'pydantic-forms';

import { EuiCallOut } from '@elastic/eui';

const CALLOUT_COLORS = ['primary', 'success', 'warning', 'danger', 'accent'];

export const WfoCallout = ({ pydanticFormField }: PydanticFormElementProps) => {
    const { header, message, icon_type, message_type } =
        pydanticFormField.default;
    const color = CALLOUT_COLORS.includes(message_type)
        ? message_type
        : 'primary';

    return (
        <div data-testid={pydanticFormField.id} css={{ marginBottom: '2rem' }}>
            <EuiCallOut title={header} iconType={icon_type} color={color}>
                <p>{message}</p>
            </EuiCallOut>
        </div>
    );
};
