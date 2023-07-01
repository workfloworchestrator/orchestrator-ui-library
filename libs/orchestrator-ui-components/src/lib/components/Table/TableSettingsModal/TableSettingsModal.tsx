import React, { useState } from 'react';
import {
    EuiForm,
    EuiFormRow,
    EuiHorizontalRule,
    EuiSelect,
    EuiSpacer,
    EuiSwitch,
} from '@elastic/eui';
import { SettingsModal } from '../../SettingsModal';

export type ColumnConfig<T> = {
    field: keyof T;
    name: string;
    isVisible: boolean;
};

export type TableConfig<T> = {
    columns: ColumnConfig<T>[];
    selectedPageSize: number;
};

export type TableSettingsModalProps<T> = {
    tableConfig: TableConfig<T>;
    pageSizeOptions: number[];
    onClose: () => void;
    onUpdateTableConfig: (updatedTableConfig: TableConfig<T>) => void;
    onResetToDefaults: () => void;
};

export const TableSettingsModal = <T,>({
    tableConfig,
    pageSizeOptions,
    onUpdateTableConfig,
    onResetToDefaults,
    onClose,
}: TableSettingsModalProps<T>) => {
    const [columns, setColumns] = useState(tableConfig.columns);
    const [selectedPageSize, setSelectedPageSize] = useState(
        tableConfig.selectedPageSize,
    );

    const options = pageSizeOptions.map((pageSizeOption) => ({
        value: pageSizeOption,
        text: pageSizeOption.toString(),
    }));

    const handleUpdateColumnVisibility = (field: keyof T) => {
        const updatedColumns: ColumnConfig<T>[] = columns.map((column) =>
            column.field === field
                ? {
                      ...column,
                      isVisible: !column.isVisible,
                  }
                : column,
        );
        setColumns(updatedColumns);
    };

    return (
        <SettingsModal
            title="Table settings"
            onClose={onClose}
            onResetToDefaults={onResetToDefaults}
            onUpdateTableConfig={() =>
                onUpdateTableConfig({
                    columns,
                    selectedPageSize,
                })
            }
        >
            <EuiForm>
                {columns.map(({ field, name, isVisible }) => (
                    <div key={field.toString()}>
                        <EuiFormRow
                            display="columnCompressedSwitch"
                            label={name}
                            css={{
                                justifyContent: 'space-between',
                            }}
                        >
                            <EuiSwitch
                                showLabel={false}
                                label={name}
                                checked={isVisible}
                                onChange={() => {
                                    handleUpdateColumnVisibility(field);
                                }}
                                compressed
                            />
                        </EuiFormRow>
                        <EuiHorizontalRule margin="xs" />
                    </div>
                ))}
                <EuiSpacer size="xs" />

                <EuiFormRow
                    hasEmptyLabelSpace
                    label="Number of Rows"
                    display="columnCompressed"
                >
                    <EuiSelect
                        compressed
                        onChange={(event) =>
                            setSelectedPageSize(parseInt(event.target.value))
                        }
                        value={selectedPageSize}
                        options={options}
                    />
                </EuiFormRow>
            </EuiForm>
        </SettingsModal>
    );
};
