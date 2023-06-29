import React, { FC, useState } from 'react';
import {
    EuiButton,
    EuiButtonEmpty,
    EuiFlexGroup,
    EuiForm,
    EuiFormRow,
    EuiHorizontalRule,
    EuiModal,
    EuiModalBody,
    EuiModalFooter,
    EuiModalHeader,
    EuiModalHeaderTitle,
    EuiSwitch,
} from '@elastic/eui';

export type ColumnConfig = {
    field: string;
    name: string;
    isVisible: boolean;
};

export type TableConfig = {
    columns: ColumnConfig[];
    numberOfRows: number;
};

export type TableSettingsModalProps = {
    tableConfig: TableConfig;
    onClose: () => void;
    onUpdateTableConfig: (updatedTableConfig: TableConfig) => void;
    onResetToDefaults: () => void;
};

export const TableSettingsModal: FC<TableSettingsModalProps> = ({
    tableConfig,
    onUpdateTableConfig,
    onResetToDefaults,
    onClose,
}) => {
    const [columns, setColumns] = useState(tableConfig.columns);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [numberOfRows, setNumberOfRows] = useState(tableConfig.numberOfRows);

    return (
        <EuiModal onClose={() => onClose()} maxWidth={400}>
            <EuiModalHeader>
                <EuiModalHeaderTitle>Table settings</EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>
                <EuiForm>
                    {columns.map(({ field, name, isVisible }) => (
                        <>
                            <EuiFormRow
                                key={field}
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
                                        const newColumns: ColumnConfig[] =
                                            columns.map((column) => {
                                                if (column.field === field) {
                                                    return {
                                                        ...column,
                                                        isVisible:
                                                            !column.isVisible,
                                                    };
                                                }

                                                return column;
                                            });
                                        setColumns(newColumns);
                                    }}
                                    compressed
                                />
                            </EuiFormRow>
                            <EuiHorizontalRule margin="xs" />
                        </>
                    ))}
                    {/*  Todo number of rows  */}
                </EuiForm>
            </EuiModalBody>

            <EuiModalFooter>
                <EuiFlexGroup justifyContent="spaceBetween">
                    <EuiButtonEmpty
                        onClick={() => onResetToDefaults()}
                        flush="left"
                    >
                        Reset to default
                    </EuiButtonEmpty>
                    <EuiButton
                        onClick={() =>
                            onUpdateTableConfig({ columns, numberOfRows })
                        }
                        fill
                    >
                        Save preference
                    </EuiButton>
                </EuiFlexGroup>
            </EuiModalFooter>
        </EuiModal>
    );
};
