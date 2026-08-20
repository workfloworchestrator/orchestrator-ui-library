import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiButtonIcon, EuiFieldSearch, EuiFlexItem, EuiFormRow } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';
import { getFormFieldsBaseStyle } from '@/theme';

export type SearchFieldWithActionsProps = {
  queryString?: string;
  onChangeQueryString: (queryString: string) => void;
  onSearchQueryString: (queryString: string) => void;
  onShowInformation: () => void;
  onShowTableSettings: () => void;
};

// Search field with the info and table-settings actions, rendered as EuiFlexItems inside an EuiFlexGroup.
export const WfoSearchFieldWithActions = ({
  queryString,
  onChangeQueryString,
  onSearchQueryString,
  onShowInformation,
  onShowTableSettings,
}: SearchFieldWithActionsProps) => {
  const t = useTranslations('common');
  const { formFieldBaseStyle } = useWithOrchestratorTheme(getFormFieldsBaseStyle);

  return (
    <>
      <EuiFlexItem>
        <EuiFormRow fullWidth>
          <EuiFieldSearch
            css={formFieldBaseStyle}
            value={queryString}
            placeholder={`${t('search')}...`}
            onChange={(e) => onChangeQueryString(e.target.value)}
            onSearch={(queryString) => onSearchQueryString(queryString)}
            fullWidth
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButtonIcon
          onClick={onShowInformation}
          iconSize={'l'}
          iconType={'info'}
          aria-label={t('searchModalTitle')}
        />
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButtonIcon onClick={onShowTableSettings} iconSize={'l'} iconType={'gear'} aria-label={t('tableSettings')} />
      </EuiFlexItem>
    </>
  );
};
