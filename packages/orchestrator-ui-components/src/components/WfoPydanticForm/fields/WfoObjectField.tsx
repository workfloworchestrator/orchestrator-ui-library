import React from 'react';
import {
    getPydanticFormComponents,
    PydanticFormElementProps,
    RenderFields, usePydanticFormContext,
} from 'pydantic-forms';
import { EuiFlexGroup } from '@elastic/eui';
import { getWfoObjectFieldStyles } from '../fields/styles';

export const WfoObjectField = ({pydanticFormField}: PydanticFormElementProps) => {
    const { config } = usePydanticFormContext();
    const {wfoObjectFieldStyles} = getWfoObjectFieldStyles()
    const components = getPydanticFormComponents(
        pydanticFormField.properties || {},
        config?.componentMatcher,
    );

    return <EuiFlexGroup css={wfoObjectFieldStyles}>
        <RenderFields pydanticFormComponents={components} />
    </EuiFlexGroup>
}
