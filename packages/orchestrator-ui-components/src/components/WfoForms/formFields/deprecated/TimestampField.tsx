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

import moment, { Moment } from 'moment-timezone';
import { connectField, filterDOMProps } from 'uniforms';

import { EuiDatePicker, EuiFormRow, EuiText } from '@elastic/eui';

import { getCommonFormFieldStyles } from '@/components/WfoForms/formFields/commonStyles';
import { useWithOrchestratorTheme } from '@/hooks';

import { FieldProps } from '../types';

export function utcTimestampToLocalMoment(utc_timestamp: number) {
    // Convert UTC timestamp to localized Moment object
    return moment
        .unix(utc_timestamp)
        .tz(moment.tz.guess() ?? 'Europe/Amsterdam');
}

export function localMomentToUtcTimestamp(local_moment: Moment) {
    // Convert localized Moment object to UTC timestamp
    return local_moment.unix();
}

export type TimestampFieldProps = FieldProps<
    number,
    {
        max?: number;
        min?: number;
        showTimeSelect: boolean;
        locale?: string;
        dateFormat?: string;
        timeFormat?: string;
    }
>;

function Timestamp({
    disabled,
    id,
    label,
    description,
    max,
    min,
    showTimeSelect,
    locale,
    dateFormat,
    timeFormat,
    onChange,
    value,
    error,
    showInlineError,
    errorMessage,
    ...props
}: TimestampFieldProps) {
    const { formRowStyle } = useWithOrchestratorTheme(getCommonFormFieldStyles);

    return (
        <div {...filterDOMProps(props)}>
            <EuiFormRow
                css={formRowStyle}
                label={label}
                labelAppend={<EuiText size="m">{description}</EuiText>}
                error={showInlineError ? errorMessage : false}
                isInvalid={error}
                id={id}
                fullWidth
            >
                <EuiDatePicker
                    disabled={disabled}
                    timeIntervals={15}
                    selected={value ? utcTimestampToLocalMoment(value) : null}
                    value={
                        value
                            ? utcTimestampToLocalMoment(value).toLocaleString()
                            : undefined
                    }
                    onChange={(event) => {
                        onChange(
                            event
                                ? localMomentToUtcTimestamp(event)
                                : undefined,
                        );
                    }}
                    showTimeSelect={showTimeSelect}
                    dateFormat={dateFormat ? dateFormat : undefined}
                    timeFormat={timeFormat ? timeFormat : undefined}
                    locale={locale ? locale : 'en-en'}
                    maxDate={max ? moment.unix(max) : undefined}
                    minDate={min ? moment.unix(min) : undefined}
                />
            </EuiFormRow>
        </div>
    );
}

export const TimestampField = connectField(Timestamp, { kind: 'leaf' });
