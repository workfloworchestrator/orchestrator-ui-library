import React, { FC, useEffect, useRef, useState } from 'react';
import { FieldSelectorProps } from 'react-querybuilder';

import { useTranslations } from 'next-intl';

import type { EuiComboBoxOptionOption } from '@elastic/eui';
import { EuiComboBox } from '@elastic/eui';

import { usePathAutocomplete } from '@/hooks';
import { EntityKind, PathInfo, WfoQueryBuilderContext } from '@/types';

// react-querybuilder applies the `.rule` class to the rule container and `.rule-value` to
// the value-editor cell (see `standardClassnames` in @react-querybuilder/core). We hop from
// the EuiComboBox search input up to the enclosing rule and focus the value editor's first
// focusable child on the next frame, once react-querybuilder has re-rendered the rule with
// the editor type for the new field.
const focusValueEditorAfterRender = (searchInput: HTMLInputElement | null) => {
  if (!searchInput) return;
  requestAnimationFrame(() => {
    const valueCell = searchInput.closest('.rule')?.querySelector('.rule-value');
    const focusable = valueCell?.querySelector<HTMLElement>(
      'input:not([disabled]), textarea:not([disabled]), button:not([disabled])',
    );

    if (!focusable) return;
    focusable.focus();
    if (focusable instanceof HTMLInputElement && (focusable.type === 'text' || focusable.type === 'number')) {
      focusable.select();
    }
  });
};

interface WfoFieldSelectorProps extends Omit<FieldSelectorProps, 'context'> {
  context: WfoQueryBuilderContext;
}

export const WfoFieldSelector: FC<WfoFieldSelectorProps> = ({ handleOnChange, disabled, rule, context }) => {
  const { field } = rule;
  const { useAdvancedNestedSearch, prefilledFieldOptions, onFieldSelected } = context;
  const [selectedValue, setSelectedValue] = useState<string>(field);
  const [searchInput, setSearchInput] = useState<HTMLInputElement | null>(null);
  const optionsRef = useRef<EuiComboBoxOptionOption<string>[]>([]);
  const handleFieldSelectionRef = useRef<(selected: EuiComboBoxOptionOption<string>[]) => void>(() => {});
  const t = useTranslations('search.page');
  const getOption = (path: string) => ({
    value: path,
    label: path,
  });

  const isSelectablePath = (path: string) => useAdvancedNestedSearch || !path.includes('.');

  const getOptionsFromPathInfo = (pathInfos: PathInfo[]): EuiComboBoxOptionOption<string>[] => {
    const pathOptions: EuiComboBoxOptionOption<string>[] = [];

    pathInfos.forEach((pathInfo) => {
      [pathInfo.path, ...(pathInfo.availablePaths ?? [])].filter(isSelectablePath).forEach((path) => {
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

    onFieldSelected(selectedValue, operators, matchingPath);
  };

  const handleFieldSelection = (selectedOptions: EuiComboBoxOptionOption<string>[]) => {
    const selectedOption = selectedOptions[0];
    const selectedValue = selectedOption?.value || '';
    setSelectedValue(selectedValue);
    storeFieldOperators(selectedValue);

    handleOnChange(selectedValue);

    if (selectedValue) focusValueEditorAfterRender(searchInput);
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
      // Prevent both Enter (form submit / EUI's no-op fallback) and Tab (native focus
      // shift to the operator selector) — handleFieldSelection moves focus to the value
      // editor itself, and a native Tab in the meantime causes a visible focus flash.
      event.preventDefault();
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
