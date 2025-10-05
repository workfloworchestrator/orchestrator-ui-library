import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiButtonIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiFormRow,
    EuiPanel,
} from '@elastic/eui';

import { WfoBadge } from '@/components';
import { useOrchestratorTheme } from '@/hooks';
import { usePathAutocomplete } from '@/hooks/usePathAutoComplete';
import { Condition, EntityKind, PathInfo } from '@/types';

import { ValueControl } from '../WfoValueControl';
import { getTypeColor } from '../utils';
import { WfoFieldSelector } from './WfoFieldSelector';
import { WfoOperatorSelector } from './WfoOperatorSelector';
import { WfoPathChips } from './WfoPathChips';
import { WfoPathSelector } from './WfoPathSelector';
import { WfoRenderPathOption } from './WfoRenderFunctions';
import { WfoSelectedPathDisplay } from './WfoSelectedPathDisplay';
import {
    createOptionsFromPaths,
    getPathSelectionOptions,
    isFullPathSelected,
    shouldHideValueInput,
} from './utils';

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
    const [showPathSelection, setShowPathSelection] = useState(false);
    const [selectedFieldName, setSelectedFieldName] = useState<string>('');
    const { paths, loading, error } = usePathAutocomplete(
        searchValue,
        entityType,
    );

    const selectedPathInfo: PathInfo | null = (() => {
        if (!condition.path) return null;

        const exactMatch = paths.find(({ path, fullPath }) =>
            fullPath ? fullPath === condition.path : path === condition.path,
        );
        if (exactMatch) return exactMatch;

        if (condition.path.includes('.')) {
            const fieldName = condition.path.split('.').pop();
            if (fieldName) {
                const fieldMatch = paths.find(
                    ({ path, availablePaths }) =>
                        path === fieldName &&
                        availablePaths &&
                        availablePaths.includes(condition.path),
                );
                if (fieldMatch) return fieldMatch;
            }
        } else {
            const fieldMatch = paths.find(
                ({ path }) => path === condition.path,
            );
            if (fieldMatch) return fieldMatch;
        }

        return null;
    })();

    const handleFieldSelection = (fieldName: string) => {
        const fieldInfo = paths.find(({ path }) => path === fieldName);

        if (fieldInfo && fieldInfo.group === 'component') {
            onChange({
                path: fieldName,
                value_kind: fieldInfo.type,
                condition: { op: '', value: undefined },
            });
            return;
        }

        if (
            fieldInfo &&
            fieldInfo.availablePaths &&
            fieldInfo.availablePaths.length === 1
        ) {
            const singlePath = fieldInfo.availablePaths[0];
            onChange({
                path: singlePath,
                value_kind: fieldInfo.type,
                condition: { op: '', value: undefined },
            });
            return;
        }

        setSelectedFieldName(fieldName);
        setShowPathSelection(true);
    };

    const handlePathSelection = (selectedOption: {
        label: string;
        value: string;
        fullPath: string;
        isAnyPath?: boolean;
    }) => {
        const fieldInfo = paths.find(({ path }) => path === selectedFieldName);
        if (fieldInfo) {
            if (selectedOption.isAnyPath) {
                onChange({
                    path: selectedFieldName,
                    value_kind: fieldInfo.type,
                    condition: { op: '', value: undefined },
                });
            } else {
                onChange({
                    path: selectedOption.value,
                    value_kind: fieldInfo.type,
                    condition: { op: '', value: undefined },
                });
            }
        }
        setShowPathSelection(false);
        setSelectedFieldName('');
    };

    const handleOperatorChange = (op: string) => {
        const value: unknown = undefined;

        if (selectedPathInfo?.type === 'boolean') {
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

    const leavesOptions = createOptionsFromPaths(paths, 'leaf');
    const componentsOptions = createOptionsFromPaths(paths, 'component');

    const pathOptions = [
        ...(leavesOptions.length > 0
            ? [
                  {
                      label: t('fieldsGroupLabel'),
                      options: leavesOptions,
                  },
              ]
            : []),
        ...(componentsOptions.length > 0
            ? [
                  {
                      label: t('componentsGroupLabel'),
                      options: componentsOptions,
                  },
              ]
            : []),
    ];

    const hideValueInput = shouldHideValueInput(
        selectedPathInfo,
        !!condition.condition.op,
    );
    const fullPathSelected = isFullPathSelected(
        condition.path,
        selectedPathInfo,
    );
    const pathSelectionOptions = (() => {
        const baseOptions = getPathSelectionOptions(selectedFieldName, paths);

        // Add "Any path" option at the top if there are multiple paths
        const fieldInfo = paths.find(({ path }) => path === selectedFieldName);
        if (fieldInfo?.availablePaths && fieldInfo.availablePaths.length > 1) {
            return [
                {
                    label: t('anyPathOption'),
                    value: selectedFieldName,
                    fullPath: selectedFieldName,
                    isAnyPath: true,
                },
                ...baseOptions,
            ];
        }

        return baseOptions;
    })();

    // Create render functions with theme
    const renderPathOption = (
        option: { label: string; value?: string },
        searchValue: string,
        contentClassName?: string,
    ) => (
        <WfoRenderPathOption
            option={option}
            searchValue={searchValue}
            contentClassName={contentClassName}
            paths={paths}
        />
    );

    const renderPathSelectionOption = (option: {
        label: string;
        value?: string;
        fullPath?: string;
        isAnyPath?: boolean;
    }) => {
        // Get the field type from the selected field info
        const fieldInfo = paths.find(({ path }) => path === selectedFieldName);
        const fieldType = fieldInfo?.type || 'string';

        return (
            <WfoPathChips
                fullPath={option.fullPath || ''}
                label={option.label}
                fieldType={fieldType}
                isAnyPath={option.isAnyPath}
            />
        );
    };

    return (
        <EuiPanel paddingSize="m" color="subdued">
            <EuiFlexGroup direction="column" gutterSize="m">
                <EuiFlexItem>
                    <EuiFormRow
                        label={t('fieldLabel')}
                        error={error}
                        isInvalid={!!error}
                    >
                        <EuiFlexGroup gutterSize="s" alignItems="center">
                            <EuiFlexItem>
                                {showPathSelection ? (
                                    <WfoPathSelector
                                        selectedFieldName={selectedFieldName}
                                        pathOptions={pathSelectionOptions}
                                        onPathSelection={handlePathSelection}
                                        onClear={() => {
                                            setShowPathSelection(false);
                                            setSelectedFieldName('');
                                        }}
                                        renderOption={renderPathSelectionOption}
                                    />
                                ) : condition.path && fullPathSelected ? (
                                    <WfoSelectedPathDisplay
                                        condition={condition}
                                        selectedPathInfo={selectedPathInfo}
                                        onEdit={() => {
                                            onChange({
                                                path: '',
                                                value_kind: undefined,
                                                condition: {
                                                    op: '',
                                                    value: undefined,
                                                },
                                            });
                                        }}
                                    />
                                ) : (
                                    <WfoFieldSelector
                                        pathOptions={pathOptions}
                                        loading={loading}
                                        error={error}
                                        searchValue={searchValue}
                                        onFieldSelection={handleFieldSelection}
                                        onSearchChange={setSearchValue}
                                        onClear={() => {
                                            onChange({
                                                path: '',
                                                value_kind: undefined,
                                                condition: {
                                                    op: '',
                                                    value: undefined,
                                                },
                                            });
                                        }}
                                        renderPathOption={renderPathOption}
                                    />
                                )}
                            </EuiFlexItem>
                            {condition.path &&
                                selectedPathInfo?.ui_types &&
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
                            <WfoOperatorSelector
                                selectedPathInfo={selectedPathInfo}
                                condition={condition}
                                onOperatorChange={handleOperatorChange}
                            />
                        </EuiFlexItem>

                        {!hideValueInput && (
                            <EuiFlexItem>
                                <EuiFormRow label={t('valueLabel')}>
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
