/*
 * Copyright 2019-2024 SURF.
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

import { EuiFormRow, EuiText } from '@elastic/eui';

import { WfoLoading, WfoSubscriptionDetailSection } from '@/components';
import { useGetSubscriptionDetailQuery } from '@/rtk';

import { FieldProps } from './types';

export type SubscriptionSummaryFieldProps = FieldProps<string>;

interface SubscriptionSummaryDisplayProps {
    subscriptionId: string;
}

export const SubscriptionSummaryDisplay = ({
    subscriptionId,
}: SubscriptionSummaryDisplayProps) => {
    const { data } = useGetSubscriptionDetailQuery({
        subscriptionId,
    });
    const subscriptionDetail = data?.subscription;

    if (!subscriptionDetail) {
        return <WfoLoading />;
    }

    return (
        <WfoSubscriptionDetailSection subscriptionDetail={subscriptionDetail} />
    );
};

const SubscriptionSummary = ({
    id,
    value,
    description,
    ...props
}: SubscriptionSummaryFieldProps) => {
    if (!value) {
        return null;
    }

    return (
        <section {...filterDOMProps(props)}>
            <EuiFormRow
                id={id}
                labelAppend={<EuiText size="m">{description}</EuiText>}
                fullWidth
            >
                <SubscriptionSummaryDisplay subscriptionId={value} />
            </EuiFormRow>
        </section>
    );
};

export const SubscriptionSummaryField = connectField(SubscriptionSummary, {
    kind: 'leaf',
});
