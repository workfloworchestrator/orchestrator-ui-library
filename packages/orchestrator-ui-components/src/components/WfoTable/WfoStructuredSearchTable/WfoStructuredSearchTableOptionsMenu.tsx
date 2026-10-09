import React, { useState } from 'react';

import { useTranslations } from 'next-intl';

import type { EuiContextMenuPanelDescriptor, EuiContextMenuPanelItemDescriptor } from '@elastic/eui';
import { EuiButton, EuiCheckbox, EuiContextMenu, EuiPopover, EuiTitle } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';
import { RetrieverType } from '@/types';
import { toOptionalArrayEntries } from '@/utils/optionalArray';

import { getWfoStructuredSearchTableStyles } from './styles';

const MAIN_PANEL_ID = 0;
const RETRIEVAL_PANEL_ID = 1;

// Choices render as checked menu items: a check mark when active, an empty icon otherwise so the
// labels stay aligned.
const getCheckedIcon = (isChecked: boolean) => (isChecked ? 'check' : 'empty');

export type WfoStructuredSearchTableOptionsMenuProps = {
  onShowTableSettings: () => void;
  advancedNestedSearch: boolean;
  onToggleAdvancedNestedSearch: (checked: boolean) => void;
  retrieverType: RetrieverType;
  onUpdateRetrieverType: (retrieverType: RetrieverType) => void;
  onExportData?: () => void;
  exportDataIsLoading?: boolean;
  isBulkEditMode?: boolean;
  onToggleBulkEditMode?: (enabled: boolean) => void;
};

export const WfoStructuredSearchTableOptionsMenu = ({
  onShowTableSettings,
  advancedNestedSearch,
  onToggleAdvancedNestedSearch,
  retrieverType,
  onUpdateRetrieverType,
  onExportData,
  exportDataIsLoading,
  isBulkEditMode = false,
  onToggleBulkEditMode,
}: WfoStructuredSearchTableOptionsMenuProps) => {
  const t = useTranslations('common');
  const { optionsMenuSectionTitleStyles, optionsMenuCheckboxStyles } = useWithOrchestratorTheme(
    getWfoStructuredSearchTableStyles,
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const closePopover = () => setIsPopoverOpen(false);
  // Every menu action applies immediately, so the menu closes to reveal its effect on the table.
  const withClosePopover = (action: () => void) => () => {
    closePopover();
    action();
  };

  // The search settings render as checkboxes. Unlike the other items they keep the menu open, so
  // the checkbox shows its changed state.
  const renderCheckboxItem =
    (id: string, label: string, checked: boolean, onChange: (checked: boolean) => void) => () => (
      <EuiCheckbox
        id={id}
        label={label}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        css={optionsMenuCheckboxStyles}
      />
    );

  const retrieverOptions = [
    { value: RetrieverType.Auto, label: t('retrieverAuto') },
    { value: RetrieverType.Fuzzy, label: t('retrieverFuzzy') },
    { value: RetrieverType.Semantic, label: t('retrieverSemantic') },
    { value: RetrieverType.Hybrid, label: t('retrieverHybrid') },
  ];
  const selectedRetrieverLabel = retrieverOptions.find(({ value }) => value === retrieverType)?.label ?? retrieverType;

  const exportItems: EuiContextMenuPanelItemDescriptor[] = [
    { isSeparator: true, key: 'exportSeparator' },
    {
      name: t('downloadCsv'),
      icon: 'download',
      disabled: exportDataIsLoading,
      onClick: withClosePopover(() => onExportData?.()),
    },
  ];

  const bulkEditItems: EuiContextMenuPanelItemDescriptor[] = [
    { isSeparator: true, key: 'bulkEditSeparator' },
    {
      name: t('bulkEditMode'),
      icon: getCheckedIcon(isBulkEditMode),
      onClick: withClosePopover(() => onToggleBulkEditMode?.(!isBulkEditMode)),
    },
  ];

  const panels: EuiContextMenuPanelDescriptor[] = [
    {
      id: MAIN_PANEL_ID,
      items: [
        {
          name: t('tableSettings'),
          icon: 'gear',
          onClick: withClosePopover(onShowTableSettings),
        },
        { isSeparator: true, key: 'searchSeparator' },
        {
          key: 'searchTitle',
          renderItem: () => (
            <EuiTitle size="xxxs" css={optionsMenuSectionTitleStyles}>
              <h3>{t('search')}</h3>
            </EuiTitle>
          ),
        },
        {
          key: 'advancedNestedSearch',
          renderItem: renderCheckboxItem(
            'checkbox-advanced-nested-search',
            t('advancedNestedSearch'),
            advancedNestedSearch,
            onToggleAdvancedNestedSearch,
          ),
        },
        {
          name: `${t('retrieval')}: ${selectedRetrieverLabel}`,
          icon: 'empty',
          panel: RETRIEVAL_PANEL_ID,
        },
        ...toOptionalArrayEntries(exportItems, !!onExportData),
        ...toOptionalArrayEntries(bulkEditItems, !!onToggleBulkEditMode),
      ],
    },
    {
      id: RETRIEVAL_PANEL_ID,
      title: t('retrieval'),
      items: retrieverOptions.map(({ value, label }) => ({
        name: label,
        icon: getCheckedIcon(value === retrieverType),
        onClick: withClosePopover(() => onUpdateRetrieverType(value)),
      })),
    },
  ];

  return (
    <EuiPopover
      id="structuredSearchTableOptionsMenu"
      button={
        <EuiButton
          iconType="menu"
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          data-test-id="button-structured-search-options"
        >
          {t('options')}
        </EuiButton>
      }
      isOpen={isPopoverOpen}
      closePopover={closePopover}
      panelPaddingSize="none"
      anchorPosition="downRight"
    >
      <EuiContextMenu initialPanelId={MAIN_PANEL_ID} panels={panels} size="s" />
    </EuiPopover>
  );
};
