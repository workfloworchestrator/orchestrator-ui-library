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
import React, { useEffect, useState } from 'react';

import get from 'lodash/get';
import { useTranslations } from 'next-intl';
import { connectField, filterDOMProps, joinName, useForm } from 'uniforms';

import { EuiFieldText, EuiFormRow, EuiText } from '@elastic/eui';

import { useIsTaggedPort } from '@/hooks/deprecated/useIsTaggedPort';
import { useVlansByServicePortQuery } from '@/rtk/endpoints/formFields';

import { FieldProps } from '../types';
import { ServicePort } from './types';

function inValidVlan(vlan: string) {
    const value = vlan || '0';

    const stripped = value.toString().replace(/ /g, '');
    return (
        !/^\d{1,4}(?:-\d{1,4})?(?:,\d{1,4}(?:-\d{1,4})?)*$/.test(stripped) ||
        stripped.split(',').some(inValidRange)
    );
}

function inValidRange(range: string) {
    if (range.indexOf('-') > -1) {
        const ranges = range.split('-');
        return (
            ranges.some(inValidRange) ||
            parseInt(ranges[0], 10) >= parseInt(ranges[1], 10)
        );
    }
    return parseInt(range, 10) < 2 || parseInt(range, 10) > 4094;
}

function getAllNumbersForVlanRange(vlanRange?: string) {
    if (!vlanRange) {
        return [];
    }

    if (vlanRange !== '0' && inValidVlan(vlanRange)) {
        //semantically invalid so we don't validate against the already used ports
        return [];
    }

    return numbersFromGroupedArray(
        vlanRange
            .replace(/ /g, '')
            .split(',')
            .map((sl) => sl.split('-').map(Number)),
    );
}

function numbersFromGroupedArray(list: number[][]) {
    return list.reduce((acc, boundaries) => {
        const max = boundaries[boundaries.length - 1];
        const min = boundaries[0];
        return acc.concat(
            Array.from(new Array(max - min + 1), (x, i) => min + i),
        );
    }, []);
}

function groupedArrayFromNumbers(numbers: number[]) {
    numbers = [...numbers].sort((a, b) => a - b);

    // Group by properly incrementing numbers
    const groupedNumbers = numbers.reduce((r: number[][], n) => {
        let lastSubArray: number[] = r[r.length - 1];

        // Skip duplicates
        if (lastSubArray && lastSubArray[lastSubArray.length - 1] === n) {
            return r;
        }

        // If this is the first one or number is more than 1 difference make a new sub array
        if (!lastSubArray || lastSubArray[lastSubArray.length - 1] !== n - 1) {
            lastSubArray = [];
            r.push(lastSubArray);
        }

        lastSubArray.push(n);

        return r;
    }, []);

    return groupedNumbers.map((l) =>
        l[0] !== l[l.length - 1] ? [l[0], l[l.length - 1]] : [l[0]],
    );
}

function vlanRangeFromNumbers(list: number[]) {
    return groupedArrayFromNumbers(list)
        .map((sl) => sl.join('-'))
        .join(',');
}

export type VlanFieldProps = FieldProps<
    string,
    { subscriptionFieldName?: string; nsiVlansOnly?: boolean }
>;

export type VlanRange = [number, number];

function Vlan({
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
    subscriptionFieldName = 'subscription_id',
    nsiVlansOnly = false,
    ...props
}: VlanFieldProps) {
    const t = useTranslations('pydanticForms');

    const { model, schema } = useForm();
    const initialValue = schema.getInitialValue(name, {});
    const nameArray = joinName(null, name);
    const selfName = nameArray.slice(-1);
    const subscriptionIdFieldName = joinName(
        nameArray.slice(0, -1),
        subscriptionFieldName,
    );
    const completeListFieldName = joinName(nameArray.slice(0, -2));
    const subscriptionId = get(model, subscriptionIdFieldName);
    const [isFetched, portIsTagged] = useIsTaggedPort(subscriptionId);

    const completeList: ServicePort[] = get(model, completeListFieldName) || [];
    const extraUsedVlans = completeList
        .filter(
            (_item, index) => index.toString() !== nameArray.slice(-2, -1)[0],
        )
        .filter((item) => get(item, subscriptionFieldName) === subscriptionId)
        .map((item) => get(item, selfName))
        .join(',');

    useEffect(() => {
        if (subscriptionId && isFetched && !portIsTagged && value !== '0') {
            onChange('0');
        } else if (
            !disabled &&
            ((!subscriptionId && value !== '') ||
                (subscriptionId && portIsTagged && value === '0'))
        ) {
            onChange('');
        }
        // Adding the missing dependencies to the dependency array leads to an infinite loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onChange, subscriptionId, isFetched, portIsTagged]);

    const [usedVlansInIms, setUsedVlansInIms] = useState<VlanRange[]>([]);
    const [missingInIms, setMissingInIms] = useState(false);
    const {
        data,
        isFetching: isLoading,
        error: fetchError,
    } = useVlansByServicePortQuery(
        { subscriptionId, nsiVlansOnly },
        {
            skip: !subscriptionId,
        },
    );

    useEffect(() => {
        if (data) {
            setUsedVlansInIms(data);
            setMissingInIms(false);
        }
        if (fetchError) {
            console.error(fetchError);
            setMissingInIms(true);
            setUsedVlansInIms([]);
        }
    }, [data, fetchError]);

    // Filter currently used vlans because they are probably from the current subscription
    const currentVlans = getAllNumbersForVlanRange(initialValue);
    const usedVlans = numbersFromGroupedArray(usedVlansInIms).filter(
        (n) => !currentVlans.includes(n),
    );
    const allUsedVlans = usedVlans
        .concat(getAllNumbersForVlanRange(extraUsedVlans))
        .sort();
    const validFormat = !value || value === '0' || !inValidVlan(value);
    // Don't validate if disabled (untagged shows as disable but needs validation)
    const vlansInUse =
        validFormat && !disabled
            ? getAllNumbersForVlanRange(value).filter((num) =>
                  allUsedVlans.includes(num),
              )
            : [];

    const placeholder = isLoading
        ? t('widgets.vlan.loadingIms')
        : subscriptionId
        ? t('widgets.vlan.placeholder')
        : t('widgets.vlan.placeholderNoServicePort');

    const errorMessageExtra = missingInIms
        ? t('widgets.vlan.missingInIms')
        : !validFormat
        ? t('widgets.vlan.invalidVlan')
        : vlansInUse.length
        ? vlansInUse.length >= 1 && vlansInUse[0] === 0
            ? t('widgets.vlan.untaggedPortInUse')
            : t('widgets.vlan.vlansInUseError', {
                  vlans: vlanRangeFromNumbers(vlansInUse),
              })
        : undefined;

    let message = '';
    if (!isLoading && subscriptionId) {
        if (portIsTagged && nsiVlansOnly) {
            const initialUsedVlans = schema
                .getInitialValue('service_ports', {})
                .map((sp: { vlan: string }) => sp.vlan);
            const currentUsedVlans = initialUsedVlans.filter(
                (vlan: string) => vlan !== value && vlan !== extraUsedVlans,
            );

            const allAvailableVlans = [
                ...usedVlans.filter(
                    (number) =>
                        !getAllNumbersForVlanRange(extraUsedVlans).includes(
                            number,
                        ),
                ),
                ...currentUsedVlans,
            ].sort();

            message = !allAvailableVlans.length
                ? t('widgets.vlan.nsiNoPortsAvailable')
                : t('widgets.vlan.nsiVlansAvailable', {
                      vlans: vlanRangeFromNumbers(allAvailableVlans),
                  });
        } else if (portIsTagged) {
            message = !allUsedVlans.length
                ? t('widgets.vlan.allPortsAvailable')
                : t('widgets.vlan.vlansInUse', {
                      vlans: vlanRangeFromNumbers(allUsedVlans),
                  });
        } else {
            message = t('widgets.vlan.taggedOnly');
        }
    }

    return (
        <section {...filterDOMProps(props)}>
            <EuiFormRow
                label={label}
                labelAppend={<EuiText size="m">{description}</EuiText>}
                error={
                    (error || errorMessageExtra) && showInlineError
                        ? errorMessage || errorMessageExtra
                        : false
                }
                isInvalid={error}
                helpText={message}
                id={id}
                fullWidth
            >
                <EuiFieldText
                    isLoading={isLoading}
                    fullWidth
                    disabled={!subscriptionId || disabled || !portIsTagged}
                    name={name}
                    isInvalid={error}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    type="text"
                    value={value ?? ''}
                />
            </EuiFormRow>
        </section>
    );
}

export const VlanField = connectField(Vlan, { kind: 'leaf' });
