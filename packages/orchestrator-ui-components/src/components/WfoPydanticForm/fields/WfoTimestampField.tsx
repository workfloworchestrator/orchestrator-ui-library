import React from 'react';

import moment, { Moment } from 'moment-timezone';
import { PydanticFormControlledElementProps } from 'pydantic-forms';

import { EuiDatePicker } from '@elastic/eui';

const DATEPICKER_INTERVAL = 15;

const utcTimestampToLocalMoment = (utc_timestamp: number) => {
    // Convert UTC timestamp to localized Moment object
    return moment
        .unix(utc_timestamp)
        .tz(moment.tz.guess() ?? 'Europe/Amsterdam');
};

const localMomentToUtcTimestamp = (local_moment: Moment) => {
    // Convert localized Moment object to UTC timestamp
    return local_moment.unix();
};

export const WfoTimestampField = ({
    onChange,
    value,
    pydanticFormField,
    disabled,
}: PydanticFormControlledElementProps) => {
    const { schema } = pydanticFormField;

    const {
        dateFormat: dateTimeFormat,
        locale,
        max,
        min,
        showTimeSelect,
        timeFormat,
    } = schema.uniforms as unknown as {
        dateFormat?: string;
        locale?: string;
        max?: number;
        min?: number;
        showTimeSelect: boolean;
        timeFormat?: string;
    };
    const dateValue = value || schema.default;
    return (
        <EuiDatePicker
            disabled={disabled}
            timeIntervals={DATEPICKER_INTERVAL}
            selected={dateValue ? utcTimestampToLocalMoment(dateValue) : null}
            value={
                dateValue
                    ? utcTimestampToLocalMoment(dateValue).toLocaleString()
                    : undefined
            }
            onChange={(event) => {
                onChange(event ? localMomentToUtcTimestamp(event) : undefined);
            }}
            showTimeSelect={showTimeSelect}
            dateFormat={dateTimeFormat || undefined}
            timeFormat={timeFormat || undefined}
            locale={locale || 'en-en'}
            maxDate={max ? moment.unix(max) : undefined}
            minDate={min ? moment.unix(min) : undefined}
        />
    );
};
