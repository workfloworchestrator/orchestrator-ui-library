import { JSONSchema6 } from 'json-schema';
import { Ref } from 'react';
import { HTMLFieldProps } from 'uniforms';

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

export interface FavoriteSubscriptionStorage {
    subscription_id: string;
    customName: string;
}

export interface ServicePortFilterItem {
    subscription_id: string;
    port_name: string;
    ims_circuit_id: number;
    description: string;
    nso_service_id: string;
    port_speed: number;
    port_mode: string;
    start_date: number;
    status: string;
    product_name: string;
    product_tag: string;
}
