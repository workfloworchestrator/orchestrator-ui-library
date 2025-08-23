import React, { useState } from 'react';

import {
    EuiButtonIcon,
    EuiComboBox,
    EuiFlexGroup,
    EuiFlexItem,
    EuiFormRow,
    EuiPanel,
    EuiSelect,
} from '@elastic/eui';

import { usePathAutocomplete } from '@/hooks/usePathAutoComplete';
import { Condition } from '@/types';
import { EntityKind } from '@/types';

import { ValueControl } from './ValueControl';

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
    const [searchValue, setSearchValue] = useState(condition.path);
    const { paths, loading, error } = usePathAutocomplete(
        searchValue,
        entityType,
    );

    const selectedPathInfo =
        paths.find((p) => p.path === condition.path) || null;

    const handlePathChange = (newPath: string) => {
        onChange({
            path: newPath,
            condition: { op: '', value: undefined },
        });
    };

    const handleOperatorChange = (op: string) => {
        onChange({
            ...condition,
            condition: { op, value: undefined },
        });
    };

    const handleValueChange = (value: unknown) => {
        onChange({
            ...condition,
            condition: { ...condition.condition, value },
        });
    };

    const pathOptions = paths.map((p) => ({ label: p.path, value: p.path }));
    const operatorOptions =
        selectedPathInfo?.operators?.map((op) => ({
            value: op,
            text: op,
        })) || [];

    const selectedPathOptions = condition.path
        ? [
              {
                  label: condition.path,
                  value: condition.path,
              },
          ]
        : [];

    return (
        <EuiPanel paddingSize="s" color="subdued">
            <EuiFlexGroup gutterSize="s" alignItems="center">
                <EuiFlexItem style={{ minWidth: '200px' }}>
                    <EuiFormRow
                        label="Path"
                        display="columnCompressed"
                        error={error}
                        isInvalid={!!error}
                    >
                        <EuiComboBox
                            placeholder="Type to search paths..."
                            options={pathOptions}
                            selectedOptions={selectedPathOptions}
                            onChange={(selected) =>
                                handlePathChange(selected[0]?.value || '')
                            }
                            onSearchChange={(value) => setSearchValue(value)}
                            singleSelection={{ asPlainText: true }}
                            isLoading={loading}
                            isClearable
                            isInvalid={!!error}
                        />
                    </EuiFormRow>
                </EuiFlexItem>

                <EuiFlexItem style={{ minWidth: '120px' }}>
                    <EuiFormRow label="Operator" display="columnCompressed">
                        <EuiSelect
                            options={[
                                { value: '', text: 'Select...' },
                                ...operatorOptions,
                            ]}
                            value={condition.condition.op}
                            onChange={(e) =>
                                handleOperatorChange(e.target.value)
                            }
                            disabled={!selectedPathInfo}
                        />
                    </EuiFormRow>
                </EuiFlexItem>

                <EuiFlexItem>
                    <EuiFormRow label="Value" display="columnCompressed">
                        <ValueControl
                            pathInfo={selectedPathInfo}
                            operator={condition.condition.op}
                            value={condition.condition.value}
                            onChange={handleValueChange}
                        />
                    </EuiFormRow>
                </EuiFlexItem>

                <EuiFlexItem grow={false}>
                    <EuiFormRow label="&nbsp;" display="columnCompressed">
                        <EuiButtonIcon
                            iconType="trash"
                            color="danger"
                            onClick={onRemove}
                            aria-label="Remove condition"
                        />
                    </EuiFormRow>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiPanel>
    );
};
