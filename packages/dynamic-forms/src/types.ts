import React, { FormEventHandler } from 'react';
import { FieldValues, useForm } from 'react-hook-form';

import { z } from 'zod';

export type TDynamicFormFieldOptionsType = 'anyOf' | 'allOf';

export enum DfFieldFormats {
    DATE = 'date',
    HIDDEN = 'hidden',
    DATETIME = 'date-time',
    SKIP = 'skip',
    TIMESTAMP = 'timestamp',

    DEFAULT = 'text',
    DROPDOWN = 'dropdown',
    BOOLFIELD = 'boolfield',
    SELECT = 'select',
    MULTISELECT = 'multiselect',
    CHECKBOX = 'checkbox',
    RADIO = 'radio',
    SWITCH = 'switch',
    DATEPICKER = 'datepicker',
    NUMBER = 'number',
    LIST = 'list',
}

export enum DfFieldTypes {
    OPTGROUP = 'optGroup',
    SKIP = 'skip',
    LONG = 'long',
    HIDDEN = 'hidden',
    LABEL = 'label',
    SUMMARY = 'summary',
    ACCEPT = 'accept',
    NULL = 'null',

    DATE = 'date',
    DATETIME = 'date-time',
    OBJECT = 'object',
    STRING = 'string',
    ARRAY = 'array',
    BOOLEAN = 'boolean',
    NUMBER = 'number',
    TIMESTAMP = 'timestamp',
    LIST = 'list',
    DEFINED_LIST = 'defined-list',
    DEFINED_MULTI_LIST = 'defined-multi-list',
    TWO_OPTION_LIST = 'two-options-list',
}

export enum DFFieldReturnType {
    STRING = 'string',
    NUMBER = 'number',
    DATETIME = 'date-time',
}
export interface IValidationErrorDetails {
    detail: string;
    source: IDynamicFormApiValidationError[];
    mapped: {
        [fieldId: string]: {
            value: string;
            msg: string;
        };
    };
}

export interface IDynamicFormsContextProps {
    isLoading: boolean;
    isSending: boolean;
    isFullFilled: boolean;
    theReactHookForm: ReturnType<typeof useForm>;
    errorDetails?: IValidationErrorDetails;
    formData?: IDynamicForm;
    debugMode?: boolean;
    title?: string;
    sendLabel?: string;
    onCancel?: () => void;
    submitForm: FormEventHandler<HTMLFormElement>;
    resetForm: (e: MouseEvent) => void;
    successNotice?: React.ReactNode;
    headerComponent?: React.ReactNode;
    footerComponent?: React.ReactNode;
}

export type DynamicFormsMetaData = {
    [key: string | number]: DfFieldValue;
};

export type DfFormProvider = ({
    formKey,
    requestBody,
}: {
    formKey: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestBody: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) => Promise<Record<string, any>>;

export type DfLabelProvider = ({
    formKey,
    id,
}: {
    formKey: string;
    id?: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) => Promise<Record<string, any>>;

export type DfDataProvider = () => Promise<IDynamicFormsLabels>;

export type CustomValidationRuleFn = (
    fieldConfig: IDynamicFormField,
    theReactHookForm?: ReturnType<typeof useForm>,
) => Zod.ZodTypeAny | undefined;

export interface IDynamicFormsContextConfig {
    // use custom method to provide data for the form. This overwrites data fetched from labels endpoint
    dataProvider: DfDataProvider;

    // use custom method for providing labels and data
    labelProvider: DfLabelProvider;

    // use a custom method for providing the form definition
    formProvider: DfFormProvider;

    // Extend field definitions
    fieldDetailProvider?: IFieldDefinitionProvider;

    // be able to refresh the provided data
    dataProviderCacheKey?: number;

    // whenever a fieldvalue changes, do something
    onFieldChangeHandler?: onFieldChangeHandlerFn;

    // provide custom validation rules for fields
    customValidationRules?: CustomValidationRuleFn;

    // This is a temp solution for 2 different Backend implementations of pydantic forms
    // we will remove this once the backends both work the same
    // Portal backend has a hack that is a leftover from previous implementation
    // So for only that backend, we should not send the data as a array
    tmp_pydanticFormsOriginalImplementation?: boolean;
}

export interface IDynamicFormsContextInitialProps {
    formKey: string;
    formIdKey?: string;
    title?: string;
    sendLabel?: string;
    metaData?: DynamicFormsMetaData;
    successNotice?: React.ReactNode;
    onSuccess?: (fieldValues: FieldValues) => void;
    onCancel?: () => void;
    children: (props: IDynamicFormsContextProps) => React.ReactNode;
    headerComponent?: React.ReactNode;
    footerComponent?: React.ReactNode;

    config: IDynamicFormsContextConfig;
}

export interface IFieldDefinitionProvider {
    [fieldId: string]: Partial<IDynamicFormField>;
}

export type onFieldChangeHandlerFn = (
    field: {
        name?: string;
        type?: string;
        value: DfFieldValue;
    },
    theReactHookForm: ReturnType<typeof useForm>,
) => void;

export interface IDynamicFormApiResponseDefEnum {}

export interface TJsonSchemaRef {
    $ref: string;
}

export interface TDynamicFormFieldAnyOfDef {
    items?: TJsonSchemaRef;
    type: 'null' | 'array';
}

export type ListFieldType =
    | DfFieldTypes.STRING
    | DfFieldTypes.DATE
    | DfFieldTypes.NUMBER
    | DfFieldTypes.NULL;

export interface ITDynamicFormFieldAnyOfResolvedItems {
    enum: string[];
    title: string;
    type: ListFieldType;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
}

export interface TDynamicFormFieldAnyOfResolved {
    items?: ITDynamicFormFieldAnyOfResolvedItems;
    enum?: string[];
    format?: 'date' | 'date-time';
    type: ListFieldType;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
}

export interface IDynamicFormApiResponseProperty {
    type: DfFieldTypes;
    anyOf?: TDynamicFormFieldAnyOfDef[];
    default?: string | null;
    title: string;
}

export interface IDynamicFormApiResponsePropertyResolved {
    type: DfFieldTypes;

    anyOf?: TDynamicFormFieldAnyOfResolved[];
    oneOf?: TDynamicFormFieldAnyOfResolved[];
    allOf?: TDynamicFormFieldAnyOfResolved[];

    items?: ITDynamicFormFieldAnyOfResolvedItems;
    enum?: string[];

    default?: string | null;
    title: string;
    format: DfFieldFormats;

    uniforms?: {
        disabled: boolean;
    };

    // validation props
    maxLength?: number;
    minLength?: number;
    pattern?: string;
}

export interface IDynamicFormApiResponseBase {
    title: string;
    description: string;
    additionalProperties: boolean;
    type: 'object';
    required?: string[];
    $defs?: {
        [definitionId: string]: {
            enum: string[];
            title: string;
            type: DfFieldTypes;
        };
    };
}

export interface IDynamicFormApiResponse extends IDynamicFormApiResponseBase {
    properties: {
        [propId: string]: IDynamicFormApiResponseProperty;
    };
}

export interface IDynamicFormApiErrorResponse {
    detail?: string;
    status: number;
    form: IDynamicFormApiResponse;
    success?: boolean;
    validation_errors: IDynamicFormApiValidationError[];
}

export interface IDynamicFormApiValidationError {
    input: string;
    loc: string[];
    msg: string;
    type: string;
    url: string; //"https://errors.pydantic.dev/2.4/v/extra_forbidden"
}

export interface IDynamicFormApiRefResolved
    extends IDynamicFormApiResponseBase {
    properties: {
        [propId: string]: IDynamicFormApiResponsePropertyResolved;
    };
}

export interface IDynamicFormsLabels {
    [key: string]: string[] | number[] | string | number | null;
}

export interface IDynamicFormsLabelResponse {
    labels: IDynamicFormsLabels;
}

export interface IDynamicFormFieldValidation {
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    isNullable?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DfFieldValue = any;

export interface IDynamicFormFieldAttributes {
    disabled?: boolean;
}

export interface IDynamicFormField {
    id: string;
    title: string;
    description: string;
    type: DfFieldTypes;
    format: DfFieldFormats;
    options: string[];
    disabledOptions?: string[];
    default?: DfFieldValue;
    required: boolean;
    isEnumField: boolean;
    schemaField: IDynamicFormApiResponsePropertyResolved;
    validation: IDynamicFormFieldValidation;
    attributes: IDynamicFormFieldAttributes;
    validator?: FormZodValidationFn;
    FormElement?: FormElementComponent;
    matchedFieldResult?: DfFieldConfig;
}

export interface IDynamicFormFieldSection {
    id: string;
    title: string;
    fields: string[];
}

export enum IDynamicFormState {
    NEW = 'new',
    IN_PROGRESS = 'in-progress',
    FINISHED = 'finished',
}

export interface IDynamicForm {
    title: string;
    description: string;
    state: IDynamicFormState;
    fields: IDynamicFormField[];
    sections: IDynamicFormFieldSection[];
}

export type FormZodValidationFn = (field: IDynamicFormField) => z.ZodTypeAny;
export type FormElementComponent = (props: IDFInputFieldProps) => JSX.Element;

export interface FormComponent {
    Element: FormElementComponent;
    validator?: FormZodValidationFn;
}

export interface DfFieldConfig {
    id: string;
    Component: FormComponent;
    matcher?: (field: IDynamicFormField) => boolean;
    preventColRender?: boolean;
}

export type DfFieldsConfig = DfFieldConfig[];

export interface IDFInputFieldProps {
    field: IDynamicFormField;
}

export interface IDFZodValidationPresets {
    [type: string]: FormZodValidationFn;
}
