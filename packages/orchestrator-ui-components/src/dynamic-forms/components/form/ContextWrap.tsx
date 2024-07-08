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

import {
    DynamicFormsMetaData,
    IDynamicFormsContextInitialProps,
} from '../../types';

export interface DynamicFormProps
    extends Omit<IDynamicFormsContextInitialProps, 'formKey' | 'children'> {
    id: string;
    meta?: DynamicFormsMetaData;
}

export const DynamicForm = ({
    id,
    meta,
    ...contextProps
}: DynamicFormProps) => (
    <div e2e-id={`dynamicforms-${id}`}>
        <DynamicFormsProvider {...contextProps} formKey={id} metaData={meta}>
            {RenderMainForm}
        </DynamicFormsProvider>
    </div>
);
