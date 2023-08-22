import { EuiDatePicker, EuiFormRow, EuiText } from "@elastic/eui";
import { FieldProps } from "lib/uniforms-surfnet/src/types";
import moment from "moment";
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
import { connectField, filterDOMProps } from "uniforms";
import { localMomentToUtcTimestamp, utcTimestampToLocalMoment } from "utils/Time";

export type TimestampFieldProps = FieldProps<
    number,
    { max?: number; min?: number; showTimeSelect: boolean; locale?: string; dateFormat?: string; timeFormat?: string }
>;

function TimestampField({
    disabled,
    id,
    inputRef,
    label,
    description,
    max,
    min,
    showTimeSelect,
    locale,
    dateFormat,
    timeFormat,
    name,
    onChange,
    readOnly,
    placeholder,
    value,
    error,
    showInlineError,
    errorMessage,
    ...props
}: TimestampFieldProps) {
    return (
        <div {...filterDOMProps(props)}>
            <EuiFormRow
                label={label}
                labelAppend={<EuiText size="m">{description}</EuiText>}
                error={showInlineError ? errorMessage : false}
                isInvalid={error}
                id={id}
                fullWidth
            >
                <EuiDatePicker
                    disabled={disabled}
                    selected={value ? utcTimestampToLocalMoment(value) : null}
                    // @ts-ignore
                    value={value ? utcTimestampToLocalMoment(value) : undefined}
                    onChange={(event) => {
                        onChange(event ? localMomentToUtcTimestamp(event) : undefined);
                    }}
                    showTimeSelect={showTimeSelect}
                    dateFormat={dateFormat ? dateFormat : undefined}
                    timeFormat={timeFormat ? timeFormat : undefined}
                    locale={locale ? locale : "en-en"}
                    maxDate={max ? moment.unix(max) : undefined}
                    minDate={min ? moment.unix(min) : undefined}
                />
            </EuiFormRow>
        </div>
    );
}

export default connectField(TimestampField, { kind: "leaf" });
