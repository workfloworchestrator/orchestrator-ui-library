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
    const { theReactHookForm } = useDynamicFormsContext();

    return <input type="hidden" {...theReactHookForm.register(field.id)} />;
}

const DFHiddenField: FormComponent = {
    Element: DFHiddenFieldWrap,
    validator: () => z.string(),
};

export default DFHiddenField;
