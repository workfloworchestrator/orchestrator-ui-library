import React from 'react';

import { PydanticFormElement } from 'pydantic-forms';

import { useOrchestratorTheme } from '@/hooks';

export const WfoLabel: PydanticFormElement = ({ pydanticFormField }) => {
    const { theme } = useOrchestratorTheme();

    return (
        <div data-testid={pydanticFormField.id}>
            <label
                css={{
                    color: theme.colors.textParagraph,
                    display: 'block',
                }}
                id={pydanticFormField.id}
            >
                {pydanticFormField.default || pydanticFormField.title}
            </label>
        </div>
    );
};
