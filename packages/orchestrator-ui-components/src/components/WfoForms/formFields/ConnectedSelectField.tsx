import React from 'react';

import { connectField } from 'uniforms';

import type { SelectFieldProps } from './SelectField';
import { UnconnectedSelectField } from './SelectField';

/*
 The selectField has a connected and unconnected version. When a SelectField is called from another field that
 is connected it can cause errors as described here: https://github.com/workfloworchestrator/orchestrator-ui-library/issues/681
 When called directly it will still need the props that the connectField function provides so it has a connected version as well.
*/
const ConnectedSelect = (props: SelectFieldProps) => {
    return <UnconnectedSelectField {...props} />;
};

export const ConnectedSelectField = connectField(ConnectedSelect, {
    kind: 'leaf',
});
