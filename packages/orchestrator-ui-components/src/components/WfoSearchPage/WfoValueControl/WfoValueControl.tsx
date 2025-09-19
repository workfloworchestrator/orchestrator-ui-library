import React from 'react';

import moment from 'moment';

import {
    EuiComboBox,
    EuiDatePicker,
    EuiFieldNumber,
    EuiFieldText,
    EuiFlexGroup,
    EuiFlexItem,
    EuiText,
} from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';
import { PathInfo } from '@/types';

interface ValueControlProps {
    pathInfo: PathInfo | null;
    operator: string;
    value: unknown;
    onChange: (value: unknown) => void;
}

export const ValueControl: React.FC<ValueControlProps> = ({
    pathInfo,
    operator,
    value,
    onChange,
}) => {
    const { theme } = useOrchestratorTheme();

    if (!pathInfo || !operator) return null;

    const schema = pathInfo.value_schema[operator];
    if (!schema || schema.kind === 'none') return null;

    if (pathInfo.type === 'string') {
        if (pathInfo.example_values && pathInfo.example_values.length > 0) {
            const options = pathInfo.example_values.map((val) => ({
                label: val,
                value: val,
            }));
            return (
                <EuiComboBox
                    placeholder="Select or type value"
                    options={options}
                    selectedOptions={
                        value
                            ? [{ label: String(value), value: String(value) }]
                            : []
                    }
                    onChange={(selected) => onChange(selected[0]?.value || '')}
                    singleSelection={{ asPlainText: true }}
                    isClearable
                />
            );
        }
        return (
            <EuiFieldText
                placeholder="Enter value"
                value={String(value || '')}
                onChange={(e) => onChange(e.target.value)}
            />
        );
    }

    if (pathInfo.type === 'number') {
        if (operator === 'between') {
            const betweenValue = (value as {
                start: number | string;
                end: number | string;
            }) || { start: '', end: '' };
            return (
                <EuiFlexGroup gutterSize="s" alignItems="center">
                    <EuiFlexItem>
                        <EuiFieldNumber
                            placeholder="From"
                            value={betweenValue.start}
                            onChange={(e) =>
                                onChange({
                                    ...betweenValue,
                                    start: parseFloat(e.target.value) || '',
                                })
                            }
                        />
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                        <EuiText size="s" color={theme.colors.textSubdued}>
                            to
                        </EuiText>
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiFieldNumber
                            placeholder="To"
                            value={betweenValue.end}
                            onChange={(e) =>
                                onChange({
                                    ...betweenValue,
                                    end: parseFloat(e.target.value) || '',
                                })
                            }
                        />
                    </EuiFlexItem>
                </EuiFlexGroup>
            );
        }
        return (
            <EuiFieldNumber
                placeholder="Enter number"
                value={
                    value !== undefined && value !== null ? Number(value) : ''
                }
                onChange={(e) => onChange(parseFloat(e.target.value) || '')}
            />
        );
    }

    if (pathInfo.type === 'datetime') {
        if (operator === 'between') {
            const betweenValue = (value as {
                start: string | null;
                end: string | null;
            }) || { start: null, end: null };
            return (
                <EuiFlexGroup gutterSize="s" alignItems="center">
                    <EuiFlexItem>
                        <EuiDatePicker
                            selected={
                                betweenValue.start
                                    ? moment(betweenValue.start)
                                    : null
                            }
                            onChange={(date) =>
                                onChange({
                                    ...betweenValue,
                                    start: date?.toISOString(),
                                })
                            }
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm"
                            placeholderText="From date"
                        />
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                        <EuiText size="s" color={theme.colors.textSubdued}>
                            to
                        </EuiText>
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiDatePicker
                            selected={
                                betweenValue.end
                                    ? moment(betweenValue.end)
                                    : null
                            }
                            onChange={(date) =>
                                onChange({
                                    ...betweenValue,
                                    end: date?.toISOString(),
                                })
                            }
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm"
                            placeholderText="To date"
                        />
                    </EuiFlexItem>
                </EuiFlexGroup>
            );
        }
        return (
            <EuiDatePicker
                selected={value ? moment(String(value)) : null}
                onChange={(date) => onChange(date?.toISOString())}
                showTimeSelect
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Select date"
            />
        );
    }

    return null;
};
