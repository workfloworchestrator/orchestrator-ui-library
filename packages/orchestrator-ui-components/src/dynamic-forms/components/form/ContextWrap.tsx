/**
 * Dynamic Forms
 *
 * Main form wrap component
 *
 * This is the component that will be included when we want to use a form.
 * It initializes the context and calls the mainForm
 */
import React from 'react';

import RenderMainForm from '@/dynamic-forms/components/form/Form';
import DynamicFormsProvider from '@/dynamic-forms/core/dynamicFormContext';
import { IDynamicFormsContextInitialProps } from '@/dynamic-forms/types';

export const DynamicForm = (
    dynamicFormProps: Omit<IDynamicFormsContextInitialProps, 'children'>,
) => (
    <div e2e-id={`dynamicforms-${dynamicFormProps.workflowName}`}>
        <DynamicFormsProvider {...dynamicFormProps}>
            {RenderMainForm}
        </DynamicFormsProvider>
    </div>
);
