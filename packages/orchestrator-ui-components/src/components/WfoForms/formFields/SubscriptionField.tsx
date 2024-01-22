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

import { useOrchestratorTheme } from '../../../hooks';
import { useGetSubscriptionDropdownOptions } from '../../../hooks/surf/useGetSubscriptionDropdownOptions';
import { SubscriptionDropdownOption } from '../../../types';
import { subscriptionFieldStyling } from './SubscriptionFieldStyling';
import { getReactSelectInnerComponentStyles } from './reactSelectStyles';
import { PortMode, ProductTag } from './surf/types';
import { FieldProps, Option } from './types';
import { getPortMode } from './utils';

declare module 'uniforms' {
    interface FilterDOMProps {
        excludedSubscriptionIds: never;
        organisationId: never;
        organisationKey: never;
        visiblePortMode: never;
        bandwidth: never;
        bandwidthKey: never;
        tags: never;
        statuses: never;
    }
}
filterDOMProps.register(
    'productIds',
    'excludedSubscriptionIds',
    'organisationId',
    'organisationKey',
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
        organisationId?: string;
        organisationKey?: string;
        visiblePortMode?: string;
        bandwidth?: number;
        bandwidthKey?: string;
        tags?: string[]; // There is an assumption that using tags means you want port subscriptions
        statuses?: string[];
    }
>;

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
    organisationId,
    organisationKey,
    visiblePortMode = 'all',
    bandwidth,
    bandwidthKey,
    tags,
    statuses,
    ...props
}: SubscriptionFieldProps) {
    const t = useTranslations('pydanticForms');
    const { theme } = useOrchestratorTheme();
    // React select allows callbacks to supply style for innercomponents: https://react-select.com/styles#inner-components
    const reactSelectInnerComponentStyles =
        getReactSelectInnerComponentStyles(theme);

    const { refetch, subscriptions, isFetching } =
        useGetSubscriptionDropdownOptions(tags, statuses);

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

    // Get value from org field if organisationKey is set.
    const usedOrganisationId = organisationKey
        ? get(model, organisationKey, 'nonExistingOrgToFilterEverything')
        : organisationId;

    const makeLabel = (subscription: SubscriptionDropdownOption) => {
        const description =
            subscription.description ||
            t('widgets.subscription.missingDescription');
        const subscriptionSubstring = subscription.subscriptionId.substring(
            0,
            8,
        );

        if (['Node'].includes(subscription.product.tag)) {
            const description =
                subscription.description ||
                t('widgets.subscription.missingDescription');
            return `${subscription.subscriptionId.substring(
                0,
                8,
            )} ${description.trim()}`;
        } else if (
            [
                ProductTag.SP,
                ProductTag.SPNL,
                ProductTag.AGGSP,
                ProductTag.AGGSPNL,
                ProductTag.MSC,
                ProductTag.MSCNL,
                ProductTag.IRBSP,
            ].includes(subscription.product.tag as ProductTag)
        ) {
            const portMode = getPortMode(subscription.productBlockInstances);
            return `${subscriptionSubstring} ${portMode?.toUpperCase()} ${description.trim()} ${
                subscription.customer?.fullname
            }`;
        } else {
            return description.trim();
        }
    };

    // Filter by product, needed because getSubscriptions might return more than we want
    const getSubscriptionOptions = (): Option[] => {
        const filteredSubscriptions = subscriptions?.filter((subscription) => {
            // NOTE: useBandWith, productIds and tags need to be checked in this order as per the V1 logic

            // If a bandwidth filter is supplied it needs to be applied to the subscription product
            if (usedBandwidth) {
                const portSpeedInput = subscription.fixedInputs.find(
                    (fixedInput) => fixedInput.field === 'port_speed',
                );
                if (
                    portSpeedInput &&
                    parseInt(portSpeedInput.value.toString(), 10) <
                        parseInt(usedBandwidth.toString(), 10)
                ) {
                    return false;
                }
            }

            // If specific productIds are provided the subscriptions needs to have one of those
            if (
                !usedBandwidth &&
                productIds &&
                productIds.length > 0 &&
                !productIds.includes(subscription.product.productId)
            ) {
                return false;
            }

            if (
                !usedBandwidth &&
                !productIds &&
                tags &&
                tags?.length > 0 &&
                !tags.includes(subscription.product.tag)
            ) {
                return false;
            }

            // If specific subscriptionIds are excluded the subscription can't be one ot those
            if (
                excludedSubscriptionIds &&
                excludedSubscriptionIds.length > 0 &&
                excludedSubscriptionIds.includes(subscription.subscriptionId)
            ) {
                return false;
            }

            // If a Port mode filter is applied we need to filter on that
            if (visiblePortMode !== 'all') {
                const portMode = getPortMode(
                    subscription.productBlockInstances,
                );
                // For normal mode filter out all subscriptions that don't have tagged or untagged ports
                if (
                    visiblePortMode === 'normal' &&
                    ![PortMode.TAGGED, PortMode.UNTAGGED, undefined].includes(
                        portMode,
                    )
                ) {
                    return false;
                } else if (
                    portMode !== visiblePortMode &&
                    visiblePortMode !== 'normal'
                ) {
                    return false;
                }
            }

            // If a customer/organisation filter is applied we need to filter on that
            if (
                usedOrganisationId &&
                subscription.customer?.identifier !== usedOrganisationId
            ) {
                return false;
            }

            if (parentName !== name) {
                if (
                    parent.fieldType === Array &&
                    // @ts-expect-error Parent field can have the uniqueItems boolean property but this is not part of JSONSchema6 type
                    // TODO: Figure out why this is so
                    parent.uniqueItems
                ) {
                    const allValues: string[] = get(model, parentName, []);
                    const chosenValues = allValues.filter(
                        (_item, index) =>
                            index.toString() !==
                            nameArray[nameArray.length - 1],
                    );
                    if (!chosenValues.includes(subscription.subscriptionId)) {
                        return false;
                    }
                }
            }

            return true;
        });

        return filteredSubscriptions
            ? filteredSubscriptions.map((subscription) => ({
                  label: makeLabel(subscription),
                  value: subscription.subscriptionId,
              }))
            : [];
    };

    const options = getSubscriptionOptions();

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
                                    aria-label={`reload-${label}`}
                                    iconType="refresh"
                                    iconSize="l"
                                    disabled={isDisabled}
                                    onClick={() => {
                                        !isDisabled ? refetch() : null;
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
                            value={isDisabled ? null : selectedValue}
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
