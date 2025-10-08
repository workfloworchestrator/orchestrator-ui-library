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
import React, { Children, cloneElement, isValidElement } from 'react';

import range from 'lodash/range';
import { connectField, filterDOMProps, joinName, useField } from 'uniforms';

import { EuiFlexItem, EuiFormRow, EuiText } from '@elastic/eui';

import { getCommonFormFieldStyles } from '@/components/WfoForms/formFields/commonStyles';
import { useWithOrchestratorTheme } from '@/hooks';

import { ListAddField } from './ListAddField';
import { ListItemField } from './ListItemField';
import { listFieldStyling } from './listFieldStyling';
import { FieldProps } from './types';

declare module 'uniforms' {
    interface FilterDOMProps {
        items: never;
        uniqueItems: never;
        outerList: never;
    }
}
filterDOMProps.register('minCount');
filterDOMProps.register('maxCount');
filterDOMProps.register('items');
filterDOMProps.register('uniqueItems');
filterDOMProps.register('outerList');

export type ListFieldProps = FieldProps<
    unknown[],
    { initialCount?: number; itemProps?: object; uniqueItems?: boolean },
    null,
    HTMLUListElement
>;

function List({
    disabled,
    children = <ListItemField name="$" disabled={disabled} outerList={false} />,
    initialCount = 1,
    itemProps,
    label,
    description,
    name,
    value,
    error,
    showInlineError,
    errorMessage,
    ...props
}: ListFieldProps) {
    const { formRowStyle } = useWithOrchestratorTheme(getCommonFormFieldStyles);

    const child = useField(joinName(name, '$'), {}, { absoluteName: true })[0];
    const hasListAsChild = child.fieldType === Array;

    return (
        <EuiFlexItem css={listFieldStyling}>
            <section
                {...filterDOMProps(props)}
                className={`list-field${hasListAsChild ? ' outer-list' : ''}`}
            >
                <EuiFormRow
                    css={formRowStyle}
                    label={label}
                    labelAppend={<EuiText size="m">{description}</EuiText>}
                    error={showInlineError ? errorMessage : false}
                    isInvalid={error}
                    id={`formrow-${name}`}
                    fullWidth
                >
                    <></>
                </EuiFormRow>
                <ul>
                    {range(Math.max(value?.length ?? 0, initialCount ?? 0)).map(
                        (itemIndex) =>
                            Children.map(children, (child, childIndex) =>
                                isValidElement(child)
                                    ? cloneElement(child, {
                                          key: `${itemIndex}-${childIndex}`,
                                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                          // @ts-ignore
                                          name: child.props.name?.replace(
                                              '$',
                                              itemIndex.toString(),
                                          ),
                                          outerList: hasListAsChild,
                                          ...itemProps,
                                      })
                                    : child,
                            ),
                    )}
                    <ListAddField
                        initialCount={initialCount}
                        name="$"
                        disabled={disabled}
                        outerList={hasListAsChild}
                    />
                </ul>
            </section>
        </EuiFlexItem>
    );
}

export const ListField = connectField(List);
