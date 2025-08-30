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
import ReactSelect from 'react-select';

import get from 'lodash/get';
import { useTranslations } from 'next-intl';
import {
    connectField,
    filterDOMProps,
    joinName,
    useField,
    useForm,
} from 'uniforms';

import {
    EuiButtonIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiFormRow,
    EuiText,
} from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';
import { useGetSurfSubscriptionDropdownOptions } from '@/hooks/deprecated/useGetSurfSubcriptionDropdownOptions';
import type { Option } from '@/types';

import { getSelectFieldStyles } from '../SelectField/styles';
import { FieldProps } from '../types';
import { subscriptionFieldStyling } from './SubscriptionFieldStyling';

declare module 'uniforms' {
    interface FilterDOMProps {
        excludedSubscriptionIds: never;
        customerId: never;
        customerKey: never;
        visiblePortMode: never;
        bandwidth: never;
        bandwidthKey: never;
        tags: never;
        statuses: never;
    }
}
filterDOMProps.register(
    'excludedSubscriptionIds',
    'customerId',
    'customerKey',
    'visiblePortMode',
    'bandwidth',
    'bandwidthKey',
    'tags',
    'statuses',
);

export type SubscriptionFieldProps = FieldProps<
    string,
    {
        productIds?: string[];
        excludedSubscriptionIds?: string[];
        customerId?: string;
        customerKey?: string;
        visiblePortMode?: string;
        bandwidth?: number;
        bandwidthKey?: string;
        tags?: string[]; // There is an assumption that using tags means you want port subscriptions
        statuses?: string[];
    }
>;

function toPortModes(visiblePortMode: string): string[] {
    if (visiblePortMode === 'all') {
        return [];
    }

    if (visiblePortMode === 'normal') {
        return ['tagged', 'untagged'];
    }

    return [visiblePortMode];
}

function SubscriptionFieldDefinition({
    disabled,
    id,
    label,
    description,
    name,
    onChange,
    readOnly,
    value,
    error,
    showInlineError,
    errorMessage,
    className = '',
    productIds = [],
    excludedSubscriptionIds = [],
    customerId,
    customerKey,
    visiblePortMode = 'all',
    bandwidth,
    bandwidthKey,
    tags,
    statuses,
    ...props
}: SubscriptionFieldProps) {
    const t = useTranslations('pydanticForms');
    // React select allows callbacks to supply style for innercomponents: https://react-select.com/styles#inner-components
    const { reactSelectInnerComponentStyles } =
        useWithOrchestratorTheme(getSelectFieldStyles);

    const nameArray = joinName(null, name);
    let parentName = joinName(nameArray.slice(0, -1));

    // We cant call useField conditionally so we call it for ourself if there is no parent
    if (parentName === '') {
        parentName = name;
    }

    const parent = useField(parentName, {}, { absoluteName: true })[0];

    const { model, schema } = useForm();

    const bandWithFromField = bandwidthKey
        ? get(model, bandwidthKey!) || schema.getInitialValue(bandwidthKey, {})
        : undefined;

    const usedBandwidth = bandwidth || bandWithFromField;

    // Get value from org field if customerKey is set.
    const usedCustomerId = customerKey
        ? get(model, customerKey, 'nonExistingOrgToFilterEverything')
        : customerId;

    const getFilteredOptions = (optionsInput: Option[]): Option[] => {
        // Remnant of the old logic in which much more filtering happened clientside, which is now done
        // server-side by setting the required URL parameters.

        // The 'uniqueItems' filter below should exclude options already chosen in other SubscriptionFields in the same parent Array.
        // Although this partly relies on uniforms magic which will be reworked/replaced with pydantic-forms.
        if (
            parentName !== name &&
            parent.fieldType === Array &&
            // @ts-expect-error Parent field can have the uniqueItems boolean property but this is not part of JSONSchema6 type
            // TODO: Figure out why this is so
            parent.uniqueItems
        ) {
            const allValues: string[] = get(model, parentName, []);
            const chosenValues = allValues.filter(
                (_item, index) =>
                    index.toString() !== nameArray[nameArray.length - 1],
            );

            return optionsInput.filter((option) =>
                chosenValues.includes(option.value),
            );
        } else {
            return optionsInput;
        }
    };

    const excludeSubscriptionIds = excludedSubscriptionIds;
    const portModes = toPortModes(visiblePortMode);
    const {
        refetch,
        options: unfilteredOptions,
        isFetching,
    } = useGetSurfSubscriptionDropdownOptions(
        tags,
        statuses,
        productIds,
        excludeSubscriptionIds,
        usedCustomerId,
        portModes,
        usedBandwidth,
    );

    const options = getFilteredOptions(unfilteredOptions);

    const selectedValue = options.find(
        (option: Option) => option.value === value,
    );

    const isDisabled = disabled || readOnly || isFetching;

    return (
        <EuiFlexItem css={subscriptionFieldStyling} grow={1}>
            <section
                {...filterDOMProps(props)}
                className={`${className} subscription-field${
                    disabled ? '-disabled' : ''
                }`}
            >
                <EuiFormRow
                    label={label}
                    labelAppend={<EuiText size="m">{description}</EuiText>}
                    error={showInlineError ? errorMessage : false}
                    isInvalid={error}
                    id={id}
                    fullWidth
                >
                    <div>
                        {!disabled && (
                            <EuiFlexGroup
                                alignItems={'center'}
                                gutterSize={'none'}
                                responsive={false}
                            >
                                <EuiButtonIcon
                                    className="reload-subscriptions-icon-button"
                                    id={`refresh-icon-${id}`}
                                    iconType="refresh"
                                    iconSize="l"
                                    disabled={isDisabled}
                                    onClick={() => {
                                        if (isDisabled) {
                                            refetch();
                                        }
                                    }}
                                />
                            </EuiFlexGroup>
                        )}
                        <ReactSelect<Option, false>
                            id={id}
                            inputId={`${id}.search`}
                            name={name}
                            onChange={(option) => {
                                onChange(option?.value);
                            }}
                            options={options}
                            value={selectedValue}
                            isSearchable={true}
                            isClearable={false}
                            placeholder={
                                isFetching
                                    ? t('widgets.subscription.loading')
                                    : t('widgets.subscription.placeholder')
                            }
                            isDisabled={isDisabled}
                            styles={reactSelectInnerComponentStyles}
                            className="subscription-field-select"
                        />
                    </div>
                </EuiFormRow>
            </section>
        </EuiFlexItem>
    );
}

export const SubscriptionField = connectField(SubscriptionFieldDefinition, {
    kind: 'leaf',
});
