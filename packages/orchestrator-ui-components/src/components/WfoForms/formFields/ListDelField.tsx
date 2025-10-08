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

import { useTranslations } from 'next-intl';
import { connectField, filterDOMProps, joinName, useField } from 'uniforms';

import { EuiIcon, EuiText } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

import { FieldProps } from './types';

export type ListDelFieldProps = FieldProps<
    null,
    { initialCount?: number; itemProps?: object; outerList?: boolean }
>;

// onChange prop not used on purpose
function ListDel({
    disabled,
    name,
    readOnly,
    id,
    outerList = false,
    ...props
}: ListDelFieldProps) {
    const { theme } = useOrchestratorTheme();
    const t = useTranslations('pydanticForms.backendTranslations');

    const nameParts = joinName(null, name);
    const nameIndex = +nameParts[nameParts.length - 1];
    const parentName = joinName(nameParts.slice(0, -1));
    const parent = useField<{ minCount?: number }, unknown[]>(
        parentName,
        {},
        { absoluteName: true },
    )[0];

    const parentValueCount = parent.value?.length ?? 0;

    // Make a row deletable only if its:
    const isDeletable: boolean =
        !disabled &&
        !readOnly &&
        (!parent.minCount || parentValueCount > parent.minCount);

    function onAction(event: React.KeyboardEvent | React.MouseEvent) {
        if (isDeletable && (!('key' in event) || event.key === 'Enter')) {
            const value = parent?.value!.slice();
            value.splice(nameIndex, 1);
            parent.onChange(value);
        }
    }

    return (
        <div
            {...filterDOMProps(props)}
            className="del-item"
            id={`${id}.remove`}
            onClick={onAction}
            onKeyDown={onAction}
            role="button"
            tabIndex={0}
        >
            <EuiIcon
                type="minus"
                size="xxl"
                color={
                    isDeletable ? theme.colors.danger : theme.colors.disabled
                }
            />
            <label>
                {outerList && <EuiText>{t(`${parentName}_del`)}</EuiText>}
            </label>
        </div>
    );
}

export const ListDelField = connectField(ListDel, {
    initialValue: false,
    kind: 'leaf',
});
