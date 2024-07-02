/**
 * Dynamic Forms
 *
 * A hidden input component
 */
import React from 'react';

import { z } from 'zod';

import { useDynamicFormsContext } from '@/core';
import { FormComponent, IDFInputFieldProps } from '@/types';

function DFHiddenFieldWrap({ field }: IDFInputFieldProps) {
    const { rhf } = useDynamicFormsContext();

    return <input type="hidden" {...rhf.register(field.id)} />;
}

const DFHiddenField: FormComponent = {
    Element: DFHiddenFieldWrap,
    validator: () => z.string(),
};

export default DFHiddenField;
