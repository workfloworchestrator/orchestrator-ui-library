import { StartComboBoxOption, StartWorkflowGroups, StartWorkflowLabel } from '@/types';

export type StartWorkflowOptionSource = {
  workflowName: string;
  productId: string;
  productName: string;
  productDescription?: string | null;
  isAllowed?: boolean;
};

const getStartWorkflowOptionLabel = (option: StartWorkflowOptionSource, labelSource?: StartWorkflowLabel): string => {
  const description = option.productDescription?.trim();
  if (labelSource === 'description' && description) {
    return description;
  }
  return option.productName || '';
};

const toSortedComboBoxOptions = (
  options: StartWorkflowOptionSource[],
  labelSource?: StartWorkflowLabel,
): StartComboBoxOption[] =>
  options
    .map((option) => {
      const label = getStartWorkflowOptionLabel(option, labelSource);
      const comboBoxOption: StartComboBoxOption = {
        data: {
          workflowName: option.workflowName,
          productId: option.productId,
        },
        label,
        disabled: option.isAllowed === false,
      };
      // A product shown by its description can still be found by its name
      if (option.productName && label !== option.productName) {
        comboBoxOption.searchableLabel = `${label} ${option.productName}`;
      }
      return comboBoxOption;
    })
    .sort((optionA, optionB) => optionA.label.localeCompare(optionB.label));

export const hasStartWorkflowGroups = (groups?: StartWorkflowGroups): groups is StartWorkflowGroups =>
  !!groups && Object.values(groups).some((productNames) => Array.isArray(productNames));

/**
 * Builds the "New subscription" dropdown options. Without groups this is a flat list sorted by label.
 * With groups each non-empty group gets a heading followed by its products, in the key order of the
 * groups object. Products in no group are shown under otherGroupLabel at the end. A product listed in
 * several groups is shown in each of them; names that match no product are ignored.
 */
export const getStartWorkflowComboBoxOptions = (
  options: StartWorkflowOptionSource[],
  labelSource: StartWorkflowLabel | undefined,
  groups: StartWorkflowGroups | undefined,
  otherGroupLabel: string,
): StartComboBoxOption[] => {
  if (!hasStartWorkflowGroups(groups)) {
    return toSortedComboBoxOptions(options, labelSource);
  }

  const groupedProductNames = new Set<string>();
  const comboBoxOptions: StartComboBoxOption[] = [];

  const addGroup = (groupLabel: string, groupOptions: StartWorkflowOptionSource[]) => {
    if (groupOptions.length === 0) {
      return;
    }
    comboBoxOptions.push(
      { label: groupLabel, isGroupLabel: true, data: { workflowName: '' } },
      ...toSortedComboBoxOptions(groupOptions, labelSource),
    );
  };

  Object.entries(groups).forEach(([groupLabel, productNames]) => {
    if (!Array.isArray(productNames)) {
      return;
    }
    productNames.forEach((productName) => groupedProductNames.add(productName));
    addGroup(
      groupLabel,
      options.filter((option) => productNames.includes(option.productName)),
    );
  });
  addGroup(
    otherGroupLabel,
    options.filter((option) => !groupedProductNames.has(option.productName)),
  );

  return comboBoxOptions;
};

/**
 * Filters grouped options by the search value. An option is kept when the search value matches its
 * (searchable) label or the label of its group; a group heading is kept when any of its options is kept.
 */
export const filterGroupedStartOptions = (
  options: StartComboBoxOption[],
  searchValue: string,
): StartComboBoxOption[] => {
  const normalizedSearchValue = searchValue.trim().toLowerCase();
  if (!normalizedSearchValue) {
    return options;
  }
  const isMatching = (text: string) => text.toLowerCase().includes(normalizedSearchValue);

  const filteredOptions: StartComboBoxOption[] = [];
  let groupLabel: StartComboBoxOption | undefined;
  let isGroupMatching = false;
  let isGroupLabelAdded = false;

  options.forEach((option) => {
    if (option.isGroupLabel) {
      groupLabel = option;
      isGroupMatching = isMatching(option.label);
      isGroupLabelAdded = false;
      return;
    }
    if (isGroupMatching || isMatching(option.searchableLabel ?? option.label)) {
      if (groupLabel && !isGroupLabelAdded) {
        filteredOptions.push(groupLabel);
        isGroupLabelAdded = true;
      }
      filteredOptions.push(option);
    }
  });

  return filteredOptions;
};
