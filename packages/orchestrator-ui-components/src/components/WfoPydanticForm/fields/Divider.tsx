import React from 'react';

import type { PydanticFormElement } from 'pydantic-forms';

import { EuiHorizontalRule } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

export const Divider: PydanticFormElement = ({ pydanticFormField }) => {
    const { theme } = useOrchestratorTheme();
    return (
        <EuiHorizontalRule
            style={{ marginTop: theme.base }}
            id={pydanticFormField.id}
        />
    );
};
