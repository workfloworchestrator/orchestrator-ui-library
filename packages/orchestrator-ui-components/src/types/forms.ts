import { JSONSchema6 } from 'json-schema';

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
    meta?: { hasNext?: boolean };
}

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

export interface FormUserPermissions {
    retryAllowed: boolean;
    abortAllowed: boolean;
    inputAllowed: boolean;
}
