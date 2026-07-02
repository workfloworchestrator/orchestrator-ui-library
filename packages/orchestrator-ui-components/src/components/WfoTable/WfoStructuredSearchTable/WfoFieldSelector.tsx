import React, { useEffect, useRef, useState } from 'react';
import { FieldSelectorProps } from 'react-querybuilder';

import { useTranslations } from 'next-intl';

import type { EuiComboBoxOptionOption } from '@elastic/eui';
import { EuiComboBox } from '@elastic/eui';

import { usePathAutocomplete } from '@/hooks';
import { EntityKind, FieldToOperatorMap, PathInfo } from '@/types';

export const WfoFieldSelector = ({ handleOnChange, disabled, rule, context }: FieldSelectorProps) => {
  const { field } = rule;
  const prefilledFieldOptions: FieldToOperatorMap = context.prefilledFieldOptions;
  const [selectedValue, setSelectedValue] = useState<string>(field);
  const [searchInput, setSearchInput] = useState<HTMLInputElement | null>(null);
  const optionsRef = useRef<EuiComboBoxOptionOption<string>[]>([]);
  const handleFieldSelectionRef = useRef<(selected: EuiComboBoxOptionOption<string>[]) => void>(() => {});
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

  const {
    paths,
    loading: isLoading,
    error: errorMessage,
  } = usePathAutocomplete(selectedValue, EntityKind.SUBSCRIPTION);

  const prefilledOptions: EuiComboBoxOptionOption<string>[] = Array.from(prefilledFieldOptions.keys()).map(getOption);
  const autocompleteOptions = getOptionsFromPathInfo(paths);
  const placeholderOption: EuiComboBoxOptionOption<string> = {
    label: '──────',
    disabled: true,
  };
  const showPlaceholder = prefilledOptions.length > 0 && autocompleteOptions.length > 0;
  const options: EuiComboBoxOptionOption<string>[] = [
    ...prefilledOptions,
    ...(showPlaceholder ? [placeholderOption] : []),
    ...autocompleteOptions,
  ];

  const storeFieldOperators = (selectedValue: string) => {
    const matchingPath =
      paths.find((path) => path.path === selectedValue)
      ?? paths.find((path) => path.availablePaths?.includes(selectedValue));
    const operators = matchingPath?.operators ?? prefilledFieldOptions.get(selectedValue) ?? [];

    context?.onFieldSelected?.(selectedValue, operators);
  };

  const handleFieldSelection = (selectedOptions: EuiComboBoxOptionOption<string>[]) => {
    const selectedOption = selectedOptions[0];
    const selectedValue = selectedOption?.value || '';
    setSelectedValue(selectedValue);
    storeFieldOperators(selectedValue);

    handleOnChange(selectedValue);
  };

  // EuiComboBox only auto-selects on Enter/Tab when exactly one option matches the typed
  // text. When several options share the typed prefix, the exact-match option is not picked
  // unless the user arrow-navigates. Patch that with a native keydown listener on the input.
  optionsRef.current = options;
  handleFieldSelectionRef.current = handleFieldSelection;

  useEffect(() => {
    if (!searchInput) return;

    const autoSelectExactMatchOption = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== 'Tab') return;
      // Let EuiComboBox handle selection when an option is keyboard-highlighted.
      if (searchInput.getAttribute('aria-activedescendant')) return;
      const typed = searchInput.value.trim();
      if (!typed) return;
      const exactMatch = optionsRef.current.find(
        (option) => !option.disabled && option.label.toLowerCase() === typed.toLowerCase(),
      );
      if (!exactMatch) return;
      if (event.key === 'Enter') event.preventDefault();
      handleFieldSelectionRef.current([exactMatch]);

      // EuiComboBox keeps its own internal `searchValue` and `isListOpen` state. Clearing
      // the value via the React-recognised native setter + input event suppresses EUI's
      // "typed-but-not-selected" warning icon (the `markAsInvalid` branch in combo_box.js).
      // The synthetic Escape closes the dropdown without disturbing focus.
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      nativeInputValueSetter?.call(searchInput, '');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    };

    searchInput.addEventListener('keydown', autoSelectExactMatchOption);
    return () => searchInput.removeEventListener('keydown', autoSelectExactMatchOption);
  }, [searchInput]);

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
      inputRef={setSearchInput}
      singleSelection={{ asPlainText: true }}
      isLoading={isLoading}
      isClearable
      isInvalid={!!errorMessage}
      isDisabled={disabled}
      rowHeight={30}
    />
  );
};
