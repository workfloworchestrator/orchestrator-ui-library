import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { EuiComboBox } from '@elastic/eui';

import { PathSelectorProps } from './types';

export const WfoPathSelector: FC<PathSelectorProps> = ({
    selectedFieldName,
    pathOptions,
    onPathSelection,
    onClear,
    renderOption,
}) => {
    const t = useTranslations('search.page');

    return (
        <EuiComboBox
            placeholder={t('selectSpecificPathPlaceholder')}
            options={pathOptions}
            selectedOptions={[
                {
                    label: `${selectedFieldName}:`,
                    value: selectedFieldName,
                },
            ]}
            onChange={(selected) => {
                if (selected[0]?.value) {
                    const selectedOption = pathOptions.find(
                        (option) => option.value === selected[0].value,
                    );
                    if (selectedOption) {
                        onPathSelection(selectedOption);
                    }
                } else if (selected.length === 0) {
                    onClear();
                }
            }}
            singleSelection={{ asPlainText: true }}
            isClearable
            renderOption={renderOption}
            rowHeight={40}
            autoFocus={true}
            fullWidth={true}
            style={{
                minWidth: '500px',
                maxWidth: '100%',
                textDecoration: 'none',
            }}
            className="wfo-path-selector"
        />
    );
};
