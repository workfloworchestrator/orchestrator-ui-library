/**
 * Dynamic Forms
 *
 * Main input wrap component
 *
 * This handles the validated / error state of the element as well as the label
 * This component should wrap every field, at the field component level
 *
 * @Uses FormField - Rijkshuisstijl
 */
import React from 'react';
import { useCallback } from 'react';

import { EuiButtonIcon, EuiFormRow, EuiText } from '@elastic/eui';

import { useDynamicFormsContext } from '@/dynamic-forms/core';
import { IDynamicFormField } from '@/dynamic-forms/types';

interface IDfFieldWrapProps {
    field: IDynamicFormField;
    children: React.ReactNode;
}

function DfFieldWrap({ field, children }: IDfFieldWrapProps) {
    const { theReactHookForm, errorDetails, debugMode } =
        useDynamicFormsContext();
    const fieldState = theReactHookForm.getFieldState(field.id);

    const errorMsg =
        errorDetails?.mapped?.[field.id]?.msg ?? fieldState.error?.message;
    const isInvalid = errorMsg ?? fieldState.invalid;

    const debugTrigger = useCallback(() => {
        // eslint-disable-next-line no-console
        console.log(field);
    }, [field]);

    return (
        <EuiFormRow
            labelAppend={<EuiText size="m">{field.description}</EuiText>}
            error={errorMsg as string}
            id={field.id}
            fullWidth
            label={field.title}
            title={field.description}
            isInvalid={!!isInvalid}
        >
            <div className="d-flex">
                <div className="w-100">{children}</div>

                {debugMode && (
                    <EuiButtonIcon
                        iconType="glasses"
                        aria-label="glasses"
                        className="ml-3"
                        onClick={debugTrigger}
                    />
                )}
            </div>
        </EuiFormRow>
    );
}

export default DfFieldWrap;
