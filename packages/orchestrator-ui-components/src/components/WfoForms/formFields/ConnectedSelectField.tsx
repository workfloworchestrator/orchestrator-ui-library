import React from 'react';

import { connectField } from 'uniforms';

import type { SelectFieldProps } from './SelectField';
import { SelectField } from './SelectField';

const ConnectedSelect = (props: SelectFieldProps) => {
    return <SelectField {...props} />;
};

export const ConnectedSelectField = connectField(ConnectedSelect, {
    kind: 'leaf',
});
