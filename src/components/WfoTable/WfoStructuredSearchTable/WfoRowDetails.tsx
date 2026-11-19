import React from 'react';

import { EuiLoadingSpinner } from '@elastic/eui';

import { WfoErrorWithMessage, WfoKeyValueTable } from '@/components';
import { getRowDetailData } from '@/components/WfoTable/WfoAdvancedTable/getRowDetailData';
import type { WfoGraphqlError } from '@/rtk';

import type { WfoStructuredSearchTableColumnConfig } from './WfoStructuredSearchTable';

export type WfoRowDetailsProps<T extends object> = {
  // The row as loaded for the details. Undefined while it is loading
  row?: T;
  isLoading: boolean;
  // Set when loading the row failed, so the modal can tell the user instead of staying empty
  error?: WfoGraphqlError[];
  tableColumnConfig: WfoStructuredSearchTableColumnConfig<T>;
};

// The content of the row details modal: the columns of the row as key value pairs
export const WfoRowDetails = <T extends object>({
  row,
  isLoading,
  error,
  tableColumnConfig,
}: WfoRowDetailsProps<T>) => {
  if (!row) {
    if (isLoading) {
      return <EuiLoadingSpinner size="l" />;
    }
    return error ? <WfoErrorWithMessage error={error} /> : null;
  }

  const keyValues = getRowDetailData(row, tableColumnConfig);
  return <WfoKeyValueTable keyValues={keyValues} showCopyToClipboardIcon />;
};
