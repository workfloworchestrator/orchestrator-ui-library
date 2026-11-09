import { Condition, EntityKind, PathInfo } from '@/types';

export interface ConditionRowProps {
  condition: Condition;
  entityType: EntityKind;
  onChange: (condition: Condition) => void;
  onRemove: () => void;
}

export interface FieldSelectorProps {
  pathOptions: Array<{
    label: string;
    options: Array<{
      label: string;
      value: string;
      'data-type': string;
      'data-operators': string;
    }>;
  }>;
  loading: boolean;
  error: string | null;
  searchValue: string;
  onFieldSelection: (fieldName: string) => void;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  renderPathOption: (
    option: { label: string; value?: string },
    searchValue: string,
    contentClassName?: string,
  ) => JSX.Element;
}

export interface PathSelectorProps {
  selectedFieldName: string;
  pathOptions: Array<{
    label: string;
    value: string;
    fullPath: string;
    isAnyPath?: boolean;
  }>;
  onPathSelection: (option: { label: string; value: string; fullPath: string; isAnyPath?: boolean }) => void;
  onClear: () => void;
  renderOption?: (
    option: {
      label: string;
      value?: string;
      fullPath?: string;
      isAnyPath?: boolean;
    },
    searchValue: string,
    contentClassName?: string,
  ) => JSX.Element;
}

export interface SelectedPathDisplayProps {
  condition: Condition;
  selectedPathInfo: PathInfo | null;
  onEdit: () => void;
}

export interface OperatorSelectorProps {
  selectedPathInfo: PathInfo | null;
  condition: Condition;
  onOperatorChange: (op: string) => void;
}

export interface PathOptionRenderProps {
  option: { label: string; value?: string };
  searchValue: string;
  contentClassName?: string;
  paths: PathInfo[];
}

export interface PathSelectionOptionRenderProps {
  option: { label: string; value?: string; fullPath?: string };
  searchValue: string;
  contentClassName?: string;
  fieldType: string;
}
