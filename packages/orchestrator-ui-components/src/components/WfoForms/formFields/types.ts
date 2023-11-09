/*
 * Copyright 2019-2023 SURF.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { Ref } from 'react';
import { HTMLFieldProps } from 'uniforms';

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

export interface ContactPerson {
    name: string;
    email: string;
}

export interface ImsNode {
    id: number;
    name: string;
    status: string;
}

export interface Option<Value = string> {
    value: Value;
    label: string;
}

export interface ServicePort {
    subscription_id?: string;
    vlan?: string;
    bandwidth?: number;
    nonremovable?: boolean;
    modifiable?: boolean;
}
