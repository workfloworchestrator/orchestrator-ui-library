import React, { useEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiFieldSearch, EuiFormRow } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';
import { getFormFieldsBaseStyle } from '@/theme';

export type WfoSearchFieldProps = {
  queryString?: string;
  queryIsValid?: boolean;
  onUpdateQueryString?: (queryString: string) => void;
};

export const WfoSearchField = ({ queryString, queryIsValid = true, onUpdateQueryString }: WfoSearchFieldProps) => {
  const t = useTranslations('common');
  const tError = useTranslations('errors');
  const { formFieldBaseStyle } = useWithOrchestratorTheme(getFormFieldsBaseStyle);

  const handleSearch = useRef((queryText: string) => onUpdateQueryString?.(queryText));

  const [currentQuery, setCurrentQuery] = useState(queryString ?? '');
  useEffect(() => {
    setCurrentQuery(queryString ?? '');
  }, [queryString]);

  useEffect(() => {
    if (currentQuery === '') {
      handleSearch.current(currentQuery);
    }
  }, [currentQuery, handleSearch]);

  return (
    <EuiFormRow fullWidth isInvalid={!queryIsValid} error={[tError('invalidQueryParts')]}>
      <EuiFieldSearch
        css={formFieldBaseStyle}
        value={currentQuery}
        placeholder={`${t('search')}...`}
        onChange={(event) => setCurrentQuery(event.target.value)}
        onSearch={handleSearch.current}
        onBlur={(event) => handleSearch.current(event.target.value)}
        isInvalid={!queryIsValid}
        fullWidth
      />
    </EuiFormRow>
  );
};
