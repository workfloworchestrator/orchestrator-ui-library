import React from 'react';

import {
    PydanticFormElementProps,
    RenderFields,
    getPydanticFormComponents,
    usePydanticFormContext,
} from 'pydantic-forms';

import { EuiFlexGroup } from '@elastic/eui';

import { getWfoObjectFieldStyles } from './getWfoObjectFieldStyles';

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
        <EuiFlexGroup css={wfoObjectFieldStyles}>
            <RenderFields pydanticFormComponents={components} />
        </EuiFlexGroup>
    );
};
