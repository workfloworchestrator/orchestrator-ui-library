import React from 'react';

import {
    PydanticFormElementProps,
    RenderFields,
    getPydanticFormComponents,
    usePydanticFormContext,
} from 'pydantic-forms';

import { EuiFlexGroup } from '@elastic/eui';

import { getWfoObjectFieldStyles } from './styles';

export const WfoObjectField = ({
    pydanticFormField,
}: PydanticFormElementProps) => {
    const { config } = usePydanticFormContext();
    const { wfoObjectFieldStyles } = getWfoObjectFieldStyles();
    const components = getPydanticFormComponents(
        pydanticFormField.properties || {},
        config?.componentMatcherExtender,
    );

    return (
        <EuiFlexGroup
            data-testid={pydanticFormField.id}
            css={wfoObjectFieldStyles}
        >
            <RenderFields
                pydanticFormComponents={components}
                idPrefix={pydanticFormField.id}
            />
        </EuiFlexGroup>
    );
};
