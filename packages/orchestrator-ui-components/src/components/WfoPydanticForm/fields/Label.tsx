import React from 'react';

import { PydanticFormElement } from 'pydantic-forms';

import { useOrchestratorTheme } from '@/hooks';

export const Label: PydanticFormElement = ({ pydanticFormField }) => {
    const { theme } = useOrchestratorTheme();

    return (
        <div>
            <label
                css={{
                    color: theme.colors.text,
                    display: 'block',
                }}
                id={pydanticFormField.id}
            >
                {pydanticFormField.title}
            </label>
        </div>
    );
};
