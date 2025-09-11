import React, { useState } from 'react';

import {
    EuiBadge,
    EuiButton,
    EuiButtonIcon,
    EuiComboBox,
    EuiFlexGroup,
    EuiFlexItem,
    EuiFormRow,
    EuiPanel,
    EuiText,
    EuiToolTip,
} from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';
import { usePathAutocomplete } from '@/hooks/usePathAutoComplete';
import { Condition, EntityKind } from '@/types';

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

export const ConditionRow: React.FC<ConditionRowProps> = ({
    condition,
    entityType,
    onChange,
    onRemove,
}) => {
    const { theme } = useOrchestratorTheme();
    const [searchValue, setSearchValue] = useState(condition.path);
    const { paths, loading, error } = usePathAutocomplete(
        searchValue,
        entityType,
    );

    const selectedPathInfo =
        paths.find((p) => p.path === condition.path) || null;

    const handlePathChange = (newPath: string) => {
        const pathInfo = paths.find((p) => p.path === newPath);
        onChange({
            path: newPath,
            value_kind: pathInfo?.type,
            condition: { op: '', value: undefined },
        });
    };

    const handleOperatorChange = (op: string) => {
        const value: unknown = undefined;

        if (selectedPathInfo?.type === 'boolean') {
            // For boolean fields, we always use 'eq' operator
            const actualOp = 'eq';
            const booleanValue = op === 'eq' ? true : false; // ✓ = true, ✗ = false

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
        option: { label: string; value?: string },
        _searchValue: string,
        contentClassName?: string,
    ) => {
        const pathInfo = option.value
            ? paths.find((p) => p.path === option.value)
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
                                <EuiBadge
                                    color={getTypeColor(type, theme)}
                                    style={{
                                        fontSize: '10px',
                                        padding: '2px 6px',
                                    }}
                                >
                                    {type}
                                </EuiBadge>
                            </EuiFlexItem>
                        ))}
                    </EuiFlexGroup>
                </EuiFlexItem>
            </EuiFlexGroup>
        );
    };

    const leavesOptions = paths
        .filter((p) => p.group === 'leaf')
        .map((p) => ({
            label: p.displayLabel || p.path,
            value: p.path,
            'data-type': p.type,
            'data-operators': p.operators?.join(', ') || '',
        }));

    const componentsOptions = paths
        .filter((p) => p.group === 'component')
        .map((p) => ({
            label: p.displayLabel || p.path,
            value: p.path,
            'data-type': p.type,
            'data-operators': p.operators?.join(', ') || '',
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

    const shouldHideValueInput = () => {
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
                                    placeholder="Type to search fields..."
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
                                                        <EuiBadge
                                                            color={getTypeColor(
                                                                type,
                                                                theme,
                                                            )}
                                                            style={{
                                                                fontSize: '9px',
                                                                padding:
                                                                    '1px 4px',
                                                            }}
                                                        >
                                                            {type}
                                                        </EuiBadge>
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
                                                <EuiToolTip
                                                    content={description}
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
                                                            minWidth: '36px',
                                                            fontSize: '16px',
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {symbol}
                                                    </EuiButton>
                                                </EuiToolTip>
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
                                                Select a field first
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
                                aria-label="Remove condition"
                                size="m"
                            />
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiPanel>
    );
};
