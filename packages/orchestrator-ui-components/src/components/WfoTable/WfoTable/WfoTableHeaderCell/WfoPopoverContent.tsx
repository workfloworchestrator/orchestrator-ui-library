import React, { FC, useRef } from 'react';

import { useTranslations } from 'next-intl';

import { EuiFieldSearch, EuiForm, EuiFormRow } from '@elastic/eui';

import { getWfoBasicTableStyles } from '@/components/WfoTable/WfoTable/WfoTableHeaderCell/styles';
import { useWithOrchestratorTheme } from '@/hooks';

interface WfoPopoverContentProps {
    onSearch?: (searchText: string) => void;
    closePopover: () => void;
    fieldName: string;
}

export const WfoPopoverContent: FC<WfoPopoverContentProps> = ({
    onSearch,
    closePopover,
    fieldName,
}) => {
    const { headerCellPopoverContentStyle } = useWithOrchestratorTheme(
        getWfoBasicTableStyles,
    );
    const t = useTranslations('common');

    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newValue = inputRef.current?.value || '';
        onSearch?.(newValue);
        if (inputRef.current) inputRef.current.value = '';
        closePopover();
    };

    return (
        <div css={headerCellPopoverContentStyle}>
            <EuiForm component="form" onSubmit={handleSubmit}>
                <EuiFormRow>
                    <EuiFieldSearch
                        className={fieldName}
                        placeholder={t('search')}
                        inputRef={(input) => {
                            inputRef.current = input;
                        }}
                        isClearable={false}
                        name={`search-${fieldName}`}
                    />
                </EuiFormRow>
            </EuiForm>
        </div>
    );
};
