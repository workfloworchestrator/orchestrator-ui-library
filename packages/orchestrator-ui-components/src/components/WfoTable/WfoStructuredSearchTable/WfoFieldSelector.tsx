import React, { useState } from 'react';
import { FieldSelectorProps } from 'react-querybuilder';

import { useTranslations } from 'next-intl';

import { EuiComboBox } from '@elastic/eui';
import type { EuiComboBoxOptionOption } from '@elastic/eui';

import { usePathAutocomplete } from '@/hooks';
import { PathInfo } from '@/types';

export const WfoFieldSelector = ({ handleOnChange, disabled, rule, context }: FieldSelectorProps) => {
  const { field } = rule;
  const [selectedValue, setSelectedValue] = useState<string>(field);
  const t = useTranslations('search.page');
  const getOption = (path: string) => ({
    value: path,
    label: path,
  });
  const getOptionsFromPathInfo = (pathInfos: PathInfo[]): EuiComboBoxOptionOption<string>[] => {
    const pathOptions: EuiComboBoxOptionOption<string>[] = [];

    pathInfos.forEach((pathInfo) => {
      pathOptions.push(getOption(pathInfo.path));
      // Adds more specific paths
      pathInfo.availablePaths?.forEach((path) => {
        pathOptions.push(getOption(path));
      });
    });
    return (
      pathOptions.length > 0 ? pathOptions
      : selectedValue ? [getOption(selectedValue)]
      : []
    );
  };
  const { paths, loading: isLoading, error: errorMessage } = usePathAutocomplete(selectedValue, 'SUBSCRIPTION');
  const options = getOptionsFromPathInfo(paths);

  const storeFieldOperators = (selectedValue: string) => {
    const matchingPath =
      paths.find((path) => path.path === selectedValue)
      ?? paths.find((path) => path.availablePaths?.includes(selectedValue));
    context?.onFieldSelected?.(selectedValue, matchingPath);
  };

  const handleFieldSelection = (selectedOptions: EuiComboBoxOptionOption<string>[]) => {
    const selectedOption = selectedOptions[0];
    const selectedValue = selectedOption?.value || '';
    setSelectedValue(selectedValue);
    storeFieldOperators(selectedValue);

    handleOnChange(selectedValue);
  };

  return (
    <EuiComboBox
      placeholder={t('searchFieldsPlaceholder')}
      options={options}
      fullWidth={true}
      selectedOptions={options.filter((option) => option.value === selectedValue)}
      onChange={(selectedOptions) => {
        handleFieldSelection(selectedOptions);
      }}
      onSearchChange={(inputValue) => {
        if (inputValue.length > 0) {
          setSelectedValue(inputValue);
        }
      }}
      singleSelection={{ asPlainText: true }}
      isLoading={isLoading}
      isClearable
      isInvalid={!!errorMessage}
      isDisabled={disabled}
      rowHeight={30}
    />
  );
};
