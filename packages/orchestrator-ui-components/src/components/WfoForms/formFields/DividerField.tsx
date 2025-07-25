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

import { connectField } from 'uniforms';

import { EuiHorizontalRule } from '@elastic/eui';

import { FieldProps } from '@/components';

export type DividerFieldProps = FieldProps<null, object, null, HTMLDivElement>;

function Divider({ id }: DividerFieldProps) {
    return <EuiHorizontalRule style={{ marginTop: '-30px' }} id={id} />;
}

export const DividerField = connectField(Divider, { kind: 'leaf' });
