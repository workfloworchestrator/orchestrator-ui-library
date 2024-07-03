/**
 * React hook form controller
 */
import React from 'react';
import {
    Controller,
    ControllerFieldState,
    ControllerRenderProps,
    FieldValues,
    UseFormStateReturn,
} from 'react-hook-form';

import { useDynamicFormsContext } from '@/core/dynamicFormContext';
import { IDFInputFieldProps, IDynamicFormField } from '@/types';

type FieldComponent = (
    dfFieldConfig: IDynamicFormField,
) => ({
    field,
    fieldState,
    formState,
}: {
    field: ControllerRenderProps<FieldValues, string>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<FieldValues>;
}) => React.ReactElement;

export const DFFieldController = (FieldComponent: FieldComponent) => {
    return function DFFieldControllerWrap({ field }: IDFInputFieldProps) {
        const { theReactHookForm } = useDynamicFormsContext();

        return (
            <Controller
                name={field.id}
                control={theReactHookForm.control}
                render={FieldComponent(field)}
            />
        );
    };
};