import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { EuiComboBox } from '@elastic/eui';

import { FieldSelectorProps } from './types';

export const WfoFieldSelector: FC<FieldSelectorProps> = ({
    pathOptions,
    loading,
    error,
    onFieldSelection,
    onSearchChange,
    onClear,
    renderPathOption,
}) => {
    const t = useTranslations('search.page');

    const handleSelectionChange = (selected: Array<{ value?: string }>) => {
        if (selected[0]?.value) {
            onFieldSelection(selected[0].value);
        } else {
            onClear();
        }
    };

    return (
        <EuiComboBox
            placeholder={t('searchFieldsPlaceholder')}
            options={pathOptions}
            selectedOptions={[]}
            onChange={handleSelectionChange}
            onSearchChange={onSearchChange}
            singleSelection={{ asPlainText: true }}
            isLoading={loading}
            isClearable
            isInvalid={!!error}
            renderOption={renderPathOption}
            rowHeight={30}
        />
    );
};
