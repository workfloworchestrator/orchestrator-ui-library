import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiButton,
    EuiButtonIcon,
    EuiComboBox,
    EuiFlexGroup,
    EuiFlexItem,
    EuiFormRow,
    EuiPanel,
    EuiText,
} from '@elastic/eui';

import { WfoBadge, WfoToolTip } from '@/components';
import { useOrchestratorTheme } from '@/hooks';
import { usePathAutocomplete } from '@/hooks/usePathAutoComplete';
import { Condition, EntityKind, PathInfo } from '@/types';

import { ValueControl } from '../WfoValueControl';
import {
    getButtonColor,
    getButtonFill,
    getOperatorDisplay,
    getTypeColor,
} from '../utils';

interface ConditionRowProps {
    condition: Condition;
    entityType: EntityKind;
    onChange: (condition: Condition) => void;
    onRemove: () => void;
}

export const ConditionRow: FC<ConditionRowProps> = ({
    condition,
    entityType,
    onChange,
    onRemove,
}) => {
    const t = useTranslations('search.page');
    const { theme } = useOrchestratorTheme();
    const [searchValue, setSearchValue] = useState(condition.path);
    const [selectedPathInfo, setSelectedPathInfo] = useState<PathInfo | null>(
        null,
    );
    const { paths, loading, error } = usePathAutocomplete(
        searchValue,
        entityType,
    );

    const handlePathChange = (newPath: string) => {
        const pathInfo = paths.find(({ path }) => path === newPath);
        setSelectedPathInfo(pathInfo || null);
        onChange({
            path: newPath,
            value_kind: pathInfo?.type,
            condition: { op: '', value: undefined },
        });
    };

    const handleOperatorChange = (op: string) => {
        let value: unknown = undefined;

        if (selectedPathInfo?.type === 'boolean') {
            // For boolean fields, we always use 'eq' operator
            const actualOp = 'eq';
            const booleanValue = op === 'eq' ? true : false;

            onChange({
                ...condition,
                value_kind: selectedPathInfo?.type,
                condition: { op: actualOp, value: booleanValue },
            });
            return;
        }

        onChange({
            ...condition,
            value_kind: selectedPathInfo?.type,
            condition: { op, value },
        });
    };

    const handleValueChange = (value: unknown) => {
        onChange({
            ...condition,
            value_kind: selectedPathInfo?.type,
            condition: { ...condition.condition, value },
        });
    };

    const renderPathOption = (
        option: any,
        _searchValue: string,
        contentClassName?: string,
    ) => {
        const pathInfo = option.value
            ? paths.find(({ path }) => path === option.value)
            : null;

        if (!pathInfo) return option.label;

        return (
            <EuiFlexGroup
                alignItems="center"
                gutterSize="s"
                responsive={false}
                className={contentClassName}
            >
                <EuiFlexItem grow={true}>
                    <EuiText size="s">
                        {pathInfo.displayLabel || pathInfo.path}
                    </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiFlexGroup
                        gutterSize="xs"
                        alignItems="center"
                        responsive={false}
                    >
                        {pathInfo.ui_types?.map((type, index) => (
                            <EuiFlexItem key={index} grow={false}>
                                <WfoBadge
                                    color={getTypeColor(type, theme)}
                                    textColor={theme.colors.ink}
                                    size="xs"
                                >
                                    {type}
                                </WfoBadge>
                            </EuiFlexItem>
                        ))}
                    </EuiFlexGroup>
                </EuiFlexItem>
            </EuiFlexGroup>
        );
    };

    const leavesOptions = paths
        .filter(({ group }) => group === 'leaf')
        .map(({ displayLabel, path, type, operators }) => ({
            label: displayLabel || path,
            value: path,
            'data-type': type,
            'data-operators': operators?.join(', ') || '',
        }));

    const componentsOptions = paths
        .filter(({ group }) => group === 'component')
        .map(({ displayLabel, path, type, operators }) => ({
            label: displayLabel || path,
            value: path,
            'data-type': type,
            'data-operators': operators?.join(', ') || '',
        }));

    const pathOptions = [
        ...(leavesOptions.length > 0
            ? [
                  {
                      label: 'Fields',
                      options: leavesOptions,
                  },
              ]
            : []),
        ...(componentsOptions.length > 0
            ? [
                  {
                      label: 'Components',
                      options: componentsOptions,
                  },
              ]
            : []),
    ];

    const shouldHideValueInput = (): boolean => {
        // Hide value input if no path is selected yet
        if (!selectedPathInfo || !condition.condition.op) return true;

        // Component operators don't need values
        if (selectedPathInfo.group === 'component') return true;

        // Boolean operators don't need values
        if (selectedPathInfo.type === 'boolean') return true;

        return false;
    };

    const selectedPathOptions = condition.path
        ? [
              {
                  label: selectedPathInfo?.displayLabel || condition.path,
                  value: condition.path,
              },
          ]
        : [];

    return (
        <EuiPanel paddingSize="m" color="subdued">
            <EuiFlexGroup direction="column" gutterSize="m">
                <EuiFlexItem>
                    <EuiFormRow label="Field" error={error} isInvalid={!!error}>
                        <EuiFlexGroup gutterSize="s" alignItems="center">
                            <EuiFlexItem>
                                <EuiComboBox
                                    placeholder={t('fieldSearchPlaceholder')}
                                    options={pathOptions}
                                    selectedOptions={selectedPathOptions}
                                    onChange={(selected) =>
                                        handlePathChange(
                                            selected[0]?.value || '',
                                        )
                                    }
                                    onSearchChange={(value) =>
                                        setSearchValue(value)
                                    }
                                    singleSelection={{ asPlainText: true }}
                                    isLoading={loading}
                                    isClearable
                                    isInvalid={!!error}
                                    renderOption={renderPathOption}
                                    rowHeight={30}
                                />
                            </EuiFlexItem>
                            {selectedPathInfo?.ui_types &&
                                selectedPathInfo.ui_types.length > 0 && (
                                    <EuiFlexItem grow={false}>
                                        <EuiFlexGroup
                                            gutterSize="xs"
                                            alignItems="center"
                                            responsive={false}
                                        >
                                            {selectedPathInfo.ui_types.map(
                                                (type, index) => (
                                                    <EuiFlexItem
                                                        key={index}
                                                        grow={false}
                                                    >
                                                        <WfoBadge
                                                            color={getTypeColor(
                                                                type,
                                                                theme,
                                                            )}
                                                            textColor={
                                                                theme.colors.ink
                                                            }
                                                            size="s"
                                                        >
                                                            {type}
                                                        </WfoBadge>
                                                    </EuiFlexItem>
                                                ),
                                            )}
                                        </EuiFlexGroup>
                                    </EuiFlexItem>
                                )}
                        </EuiFlexGroup>
                    </EuiFormRow>
                </EuiFlexItem>

                <EuiFlexItem>
                    <EuiFlexGroup gutterSize="s" alignItems="flexEnd">
                        <EuiFlexItem>
                            <EuiFormRow label="Operator">
                                <EuiFlexGroup gutterSize="xs" wrap>
                                    {selectedPathInfo?.operators?.map((op) => {
                                        const { symbol, description } =
                                            getOperatorDisplay(
                                                op,
                                                selectedPathInfo,
                                            );
                                        return (
                                            <EuiFlexItem key={op} grow={false}>
                                                <WfoToolTip
                                                    tooltipContent={description}
                                                >
                                                    <EuiButton
                                                        size="s"
                                                        color={getButtonColor(
                                                            op,
                                                            selectedPathInfo,
                                                            condition,
                                                        )}
                                                        fill={getButtonFill(
                                                            op,
                                                            selectedPathInfo,
                                                            condition,
                                                        )}
                                                        onClick={() =>
                                                            handleOperatorChange(
                                                                op,
                                                            )
                                                        }
                                                        style={{
                                                            minWidth:
                                                                theme.size.xxl,
                                                            fontSize:
                                                                theme.size.base,
                                                            fontWeight:
                                                                theme.font
                                                                    .weight
                                                                    .bold,
                                                        }}
                                                    >
                                                        {symbol}
                                                    </EuiButton>
                                                </WfoToolTip>
                                            </EuiFlexItem>
                                        );
                                    })}
                                    {(!selectedPathInfo ||
                                        selectedPathInfo.operators.length ===
                                            0) && (
                                        <EuiFlexItem grow={false}>
                                            <EuiText
                                                size="s"
                                                color={theme.colors.textSubdued}
                                            >
                                                {t('selectFieldFirst')}
                                            </EuiText>
                                        </EuiFlexItem>
                                    )}
                                </EuiFlexGroup>
                            </EuiFormRow>
                        </EuiFlexItem>

                        {!shouldHideValueInput() && (
                            <EuiFlexItem>
                                <EuiFormRow label="Value">
                                    <ValueControl
                                        pathInfo={selectedPathInfo}
                                        operator={condition.condition.op}
                                        value={condition.condition.value}
                                        onChange={handleValueChange}
                                    />
                                </EuiFormRow>
                            </EuiFlexItem>
                        )}

                        <EuiFlexItem grow={false}>
                            <EuiButtonIcon
                                iconType="trash"
                                color="danger"
                                onClick={onRemove}
                                aria-label={t('removeConditionAriaLabel')}
                                size="m"
                            />
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiPanel>
    );
};
