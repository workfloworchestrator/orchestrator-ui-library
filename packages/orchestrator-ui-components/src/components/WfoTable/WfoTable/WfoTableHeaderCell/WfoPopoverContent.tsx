import React, { FC, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiButton, EuiFieldSearch, EuiFlexGroup, EuiFlexItem, EuiForm, EuiFormRow, EuiSwitch } from '@elastic/eui';

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
  const [toggleValue, setToggleValue] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newValue = isToggleFilter ? String(toggleValue) : inputRef.current?.value || '';
    onSearch?.(newValue);
    if (inputRef.current) inputRef.current.value = '';
    closePopover();
  };

  const ToggleFilterContent = () => {
    return (
      <EuiFlexGroup gutterSize="m" alignItems="center" responsive={false}>
        <EuiFlexItem grow={false}>
          <EuiSwitch
            label={toggleValue ? 'True' : 'False'}
            checked={toggleValue}
            onChange={(e) => setToggleValue(e.target.checked)}
            name={`toggle-${fieldName}`}
          />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton type="submit" size="s" fill>
            {t('applyFilter')}
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  };

  return (
    <div css={headerCellPopoverContentStyle}>
      <EuiForm component="form" onSubmit={handleSubmit}>
        <EuiFormRow>
          {isToggleFilter ?
            <ToggleFilterContent />
          : <EuiFieldSearch
              className={fieldName}
              placeholder={t('search')}
              inputRef={(input) => {
                inputRef.current = input;
              }}
              isClearable={false}
              name={`search-${fieldName}`}
            />
          }
        </EuiFormRow>
      </EuiForm>
    </div>
  );
};
