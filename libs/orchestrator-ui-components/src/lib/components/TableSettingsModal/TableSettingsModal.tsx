import React, { FC, useState } from 'react';
import {
    EuiForm,
    EuiFormRow,
    EuiHorizontalRule,
    EuiSelect,
    EuiSpacer,
    EuiSwitch,
} from '@elastic/eui';
import { SettingsModal } from '../SettingsModal';

export type ColumnConfig = {
    field: string;
    name: string;
    isVisible: boolean;
};

export type TableConfig = {
    columns: ColumnConfig[];
    selectedPageSize: number;
};

export type TableSettingsModalProps = {
    tableConfig: TableConfig;
    pageSizeOptions: number[];
    onClose: () => void;
    onUpdateTableConfig: (updatedTableConfig: TableConfig) => void;
    onResetToDefaults: () => void;
};

export const TableSettingsModal: FC<TableSettingsModalProps> = ({
    tableConfig,
    pageSizeOptions,
    onUpdateTableConfig,
    onResetToDefaults,
    onClose,
}) => {
    const [columns, setColumns] = useState(tableConfig.columns);
    const [selectedPageSize, setSelectedPageSize] = useState(
        tableConfig.selectedPageSize,
    );

    const options = pageSizeOptions.map((pageSizeOption) => ({
        value: pageSizeOption,
        text: pageSizeOption.toString(),
    }));

    const handleUpdateColumnVisibility = (field: string) => {
        const newColumns: ColumnConfig[] = columns.map((column) =>
            column.field === field
                ? {
                      ...column,
                      isVisible: !column.isVisible,
                  }
                : column,
        );
        setColumns(newColumns);
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
                    <div key={field}>
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
