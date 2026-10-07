import React, { FC, useRef } from 'react';

import { useTranslations } from 'next-intl';

import { EuiButton, EuiFieldSearch, EuiFlexGroup, EuiFlexItem, EuiForm, EuiFormRow } from '@elastic/eui';

import { getWfoBasicTableStyles } from '@/components/WfoTable/WfoTable/WfoTableHeaderCell/styles';
import { useWithOrchestratorTheme } from '@/hooks';

interface WfoPopoverContentProps {
  onSearch?: (searchText: string) => void;
  closePopover: () => void;
  fieldName: string;
  isToggleFilter?: boolean;
}

export const WfoPopoverContent: FC<WfoPopoverContentProps> = ({
  onSearch,
  closePopover,
  fieldName,
  isToggleFilter = false,
}) => {
  const { headerCellPopoverContentStyle } = useWithOrchestratorTheme(getWfoBasicTableStyles);
  const t = useTranslations('common');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newValue = inputRef.current?.value || '';
    onSearch?.(newValue);
    if (inputRef.current) inputRef.current.value = '';
    closePopover();
  };

  const handleToggleFilter = (value: boolean) => {
    onSearch?.(String(value));
    closePopover();
  };

  if (isToggleFilter) {
    return (
      <div css={headerCellPopoverContentStyle}>
        <EuiFlexGroup gutterSize="s" responsive={false}>
          <EuiFlexItem grow={false}>
            <EuiButton
              size="s"
              color="primary"
              iconType="check"
              name={`toggle-${fieldName}-true`}
              onClick={() => handleToggleFilter(true)}
            >
              True
            </EuiButton>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton
              size="s"
              color="danger"
              iconType="cross"
              name={`toggle-${fieldName}-false`}
              onClick={() => handleToggleFilter(false)}
            >
              False
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    );
  }

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
