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

import cloneDeep from 'lodash/cloneDeep';
import { useTranslations } from 'next-intl';
import { connectField, filterDOMProps, joinName, useField } from 'uniforms';

import { EuiIcon, EuiText } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

import { FieldProps } from './types';

export type ListAddFieldProps = FieldProps<
    string,
    { initialCount?: number; outerList?: boolean }
>;

// onChange not used on purpose
function ListAdd({
    disabled,
    initialCount,
    name,
    readOnly,
    value,
    outerList = false,
    ...props
}: ListAddFieldProps) {
    const { theme } = useOrchestratorTheme();
    const t = useTranslations('pydanticForms.backendTranslations');

    const nameParts = joinName(null, name);
    const parentName = joinName(nameParts.slice(0, -1));
    const parent = useField<
        { initialCount?: number; maxCount?: number },
        unknown[]
    >(parentName, { initialCount }, { absoluteName: true })[0];
    const parentValueCount = parent.value?.length ?? 0;
    const limitNotReached =
        !disabled && (!parent.maxCount || parent.maxCount > parentValueCount);
    const count = 1 + Math.max((initialCount ?? 0) - parentValueCount, 0);

    function onAction(event: React.KeyboardEvent | React.MouseEvent) {
        if (
            limitNotReached &&
            !readOnly &&
            (!('key' in event) || event.key === 'Enter')
        ) {
            const newRowsValue = Array(count).fill(cloneDeep(value));
            parent.onChange(parent.value!.concat(newRowsValue));
        }
    }

    return (
        <div
            className="add-item"
            {...filterDOMProps(props)}
            onClick={onAction}
            onKeyDown={onAction}
            role="button"
            tabIndex={0}
        >
            <EuiIcon
                type="plus"
                size="xxl"
                color={
                    !limitNotReached || disabled
                        ? theme.colors.disabled
                        : theme.colors.success
                }
            />
            <label>
                {outerList && <EuiText>{t(`${parentName}_add`)}</EuiText>}
            </label>
        </div>
    );
}

export const ListAddField = connectField(ListAdd, {
    initialValue: false,
    kind: 'leaf',
});
