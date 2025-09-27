import React, { FC } from 'react';

import moment from 'moment';
import { useTranslations } from 'next-intl';

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

export const ValueControl: FC<ValueControlProps> = ({
    pathInfo,
    operator,
    value,
    onChange,
}) => {
    const t = useTranslations('search.page');
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
                    placeholder={t('selectOrEnterValue')}
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
                placeholder={t('enterValue')}
                value={String(value || '')}
                onChange={(event) => onChange(event.target.value)}
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
                            placeholder={t('fromNumber')}
                            value={betweenValue.start}
                            onChange={(event) =>
                                onChange({
                                    ...betweenValue,
                                    start: parseFloat(event.target.value) || '',
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
                            placeholder={t('toNumber')}
                            value={betweenValue.end}
                            onChange={(event) =>
                                onChange({
                                    ...betweenValue,
                                    end: parseFloat(event.target.value) || '',
                                })
                            }
                        />
                    </EuiFlexItem>
                </EuiFlexGroup>
            );
        }
        return (
            <EuiFieldNumber
                placeholder={t('enterNumber')}
                value={
                    value !== undefined && value !== null ? Number(value) : ''
                }
                onChange={(event) =>
                    onChange(parseFloat(event.target.value) || '')
                }
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
                            placeholderText={t('fromDate')}
                        />
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                        <EuiText size="s" color={theme.colors.textSubdued}>
                            {t('valueControlTo')}
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
                            placeholderText={t('toDate')}
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
                placeholderText={t('selectDateAndTime')}
            />
        );
    }

    return null;
};
