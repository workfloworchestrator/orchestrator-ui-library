import { Ref } from 'react';

import { JSONSchema6 } from 'json-schema';
import { HTMLFieldProps } from 'uniforms';

import { HttpStatus } from '@/rtk';

export interface ValidationError {
    input_type: string;
    loc: (string | number)[];
    msg: string;
    type: string;
    ctx?: ValidationErrorContext;
}

export interface ValidationErrorContext {
    [index: string]: string;
}
export interface Form {
    stepUserInput?: JSONSchema6;
    hasNext?: boolean;
}

export type InputForm = JSONSchema6;
export interface FormNotCompleteResponse {
    form: InputForm;
    hasNext?: boolean;
}

export type FieldProps<
    Value,
    Extra = object,
    InputElementType = HTMLInputElement,
    ElementType = HTMLDivElement,
> = HTMLFieldProps<
    Value,
    ElementType,
    {
        inputRef?: Ref<InputElementType>;
        description?: string;
    } & Extra
>;

type ValidationErrorData = {
    detail: string;
    status: HttpStatus;
    title: string;
    traceback: string;
    type: string;
    validation_errors: [];
};

export type FormValidationError = {
    data: ValidationErrorData;
    status: HttpStatus;
};
