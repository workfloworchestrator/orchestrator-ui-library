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

import { EuiFieldText, EuiFormRow, EuiText } from '@elastic/eui';
import { SubscriptionsContext } from 'components/subscriptionContext';
import { getPortMode } from 'lib/uniforms-surfnet/src/SubscriptionField';
import { FieldProps } from 'lib/uniforms-surfnet/src/types';
import get from 'lodash/get';
import React, { useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { connectField, filterDOMProps, joinName, useForm } from 'uniforms';
import ApplicationContext from 'utils/ApplicationContext';
import { ServicePort } from 'utils/types';
import { inValidVlan } from 'validations/UserInput';

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
    let grouped_numbers = numbers.reduce((r: number[][], n) => {
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

    return grouped_numbers.map((l) =>
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

function Vlan({
    disabled,
    id,
    inputRef,
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
    const intl = useIntl();
    const { model, schema } = useForm();
    const initialValue = schema.getInitialValue(name, {});
    const { products, customApiClient } = useContext(ApplicationContext);
    const { getSubscription } = useContext(SubscriptionsContext);
    const nameArray = joinName(null, name);
    const selfName = nameArray.slice(-1);
    const subscriptionIdFieldName = joinName(
        nameArray.slice(0, -1),
        subscriptionFieldName,
    );
    const completeListFieldName = joinName(nameArray.slice(0, -2));
    const subscriptionId = get(model, subscriptionIdFieldName);
    const completeList: ServicePort[] = get(model, completeListFieldName) || [];
    const extraUsedVlans = completeList
        .filter(
            (_item, index) => index.toString() !== nameArray.slice(-2, -1)[0],
        )
        .filter((item) => get(item, subscriptionFieldName) === subscriptionId)
        .map((item) => get(item, selfName))
        .join(',');

    const subscription = getSubscription(subscriptionId);
    const portMode = subscription && getPortMode(subscription, products);
    const isUntagged = ['untagged', 'link_member'].includes(portMode);

    useEffect(() => {
        if (subscriptionId && isUntagged && value !== '0') {
            onChange('0');
        } else if (
            (!subscriptionId && value !== '') ||
            (subscriptionId && !isUntagged && value === '0')
        ) {
            onChange('');
        }
    }, [onChange, subscriptionId, isUntagged, value]);

    const [usedVlansInIms, setUsedVlansInIms] = useState<number[][]>([]);
    const [missingInIms, setMissingInIms] = useState(false);

    useEffect(() => {
        if (subscriptionId) {
            customApiClient
                .usedVlans(subscriptionId, nsiVlansOnly)
                .then((result) => {
                    setUsedVlansInIms(result);
                    setMissingInIms(false);
                })
                .catch((e) => {
                    setMissingInIms(true);
                });
        }
    }, [subscriptionId, customApiClient, nsiVlansOnly]);

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

    const placeholder = subscriptionId
        ? intl.formatMessage({ id: 'forms.widgets.vlan.placeholder' })
        : intl.formatMessage({
              id: 'forms.widgets.vlan.placeholderNoServicePort',
          });

    const errorMessageExtra = missingInIms
        ? intl.formatMessage({ id: 'forms.widgets.vlan.missingInIms' })
        : !validFormat
        ? intl.formatMessage({ id: 'forms.widgets.vlan.invalidVlan' })
        : vlansInUse.length
        ? vlansInUse.length >= 1 && vlansInUse[0] === 0
            ? intl.formatMessage({ id: 'forms.widgets.vlan.untaggedPortInUse' })
            : intl.formatMessage(
                  { id: 'forms.widgets.vlan.vlansInUseError' },
                  { vlans: vlanRangeFromNumbers(vlansInUse) },
              )
        : undefined;

    let message = intl.formatMessage({ id: 'forms.widgets.vlan.taggedOnly' });
    if (!isUntagged && nsiVlansOnly) {
        const initialUsedVlans = schema
            .getInitialValue('service_ports', {})
            .map((sp: { vlan: string }) => sp.vlan);
        const currentUsedVlans = initialUsedVlans.filter(
            (vlan: any) => vlan !== value && vlan !== extraUsedVlans,
        );

        const allAvailableVlans = [
            ...usedVlans.filter(
                (number) =>
                    !getAllNumbersForVlanRange(extraUsedVlans).includes(number),
            ),
            ...currentUsedVlans,
        ].sort();

        message = !allAvailableVlans.length
            ? intl.formatMessage({
                  id: 'forms.widgets.vlan.nsiNoPortsAvailable',
              })
            : intl.formatMessage(
                  { id: 'forms.widgets.vlan.nsiVlansAvailable' },
                  { vlans: vlanRangeFromNumbers(allAvailableVlans) },
              );
    } else if (!isUntagged) {
        message = !allUsedVlans.length
            ? intl.formatMessage({ id: 'forms.widgets.vlan.allPortsAvailable' })
            : intl.formatMessage(
                  { id: 'forms.widgets.vlan.vlansInUse' },
                  { vlans: vlanRangeFromNumbers(allUsedVlans) },
              );
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
                    fullWidth
                    disabled={!subscriptionId || disabled || isUntagged}
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

export default connectField(Vlan, { kind: 'leaf' });
