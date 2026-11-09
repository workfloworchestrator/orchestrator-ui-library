import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiButton, EuiButtonEmpty, EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';

import { WfoLogoutIcon } from '@/icons';

import type { useBulkEditProps } from './useBulkEdit';

export type WfoBulkEditToolbarProps = {
  bulkEdit: Pick<
    useBulkEditProps,
    'selectedRows' | 'isAllSelected' | 'canSelectAll' | 'handleToggleSelectAll' | 'handleToggleBulkEditMode'
  >;
};

export const WfoBulkEditToolbar = ({ bulkEdit }: WfoBulkEditToolbarProps) => {
  const t = useTranslations('common');
  const { selectedRows, isAllSelected, canSelectAll, handleToggleSelectAll, handleToggleBulkEditMode } = bulkEdit;

  return (
    <>
      <EuiSpacer size="m" />
      <EuiFlexGroup alignItems="center" gutterSize="s" responsive={false} wrap>
        <EuiFlexItem grow={false}>
          <EuiText size="s">{t('numberOfSelectedRows', { count: selectedRows.length })}</EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton
            size="s"
            onClick={handleToggleSelectAll}
            iconType={isAllSelected ? 'cross' : 'grid'}
            isDisabled={!canSelectAll}
          >
            {isAllSelected ? t('deselectAll') : t('selectAll')}
          </EuiButton>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButtonEmpty
            size="s"
            iconType={() => <WfoLogoutIcon width={16} height={16} color="currentColor" />}
            onClick={() => handleToggleBulkEditMode(false)}
          >
            {t('exitBulkEditMode')}
          </EuiButtonEmpty>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};
