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
import React from 'react';

import { connectField, filterDOMProps } from 'uniforms';

import { FieldProps } from '@/components';
import { useOrchestratorTheme } from '@/hooks';

export type LabelFieldProps = FieldProps<null, object, null, HTMLDivElement>;

// onChange not used on purpose
function Label({ id, value, label, ...props }: LabelFieldProps) {
    const { theme } = useOrchestratorTheme();

    return (
        <section {...filterDOMProps(props)}>
            <label
                css={{ color: theme.colors.text }}
                id={id}
                className={`euiFormLabel euiFormRow__label${
                    value ? '__large' : ''
                }`}
            >
                {value ? value : label}
            </label>
        </section>
    );
}

export const LabelField = connectField(Label, { kind: 'leaf' });
