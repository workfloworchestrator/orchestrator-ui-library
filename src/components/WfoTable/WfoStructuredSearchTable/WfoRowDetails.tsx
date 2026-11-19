import React from 'react';

import { EuiLoadingSpinner } from '@elastic/eui';

import { WfoKeyValueTable } from '@/components';
import { getRowDetailData } from '@/components/WfoTable/WfoAdvancedTable/getRowDetailData';

import type { WfoStructuredSearchTableColumnConfig } from './WfoStructuredSearchTable';

export type WfoRowDetailsProps<T extends object> = {
  // The row as loaded for the details. Undefined while it is loading
  row?: T;
  isLoading: boolean;
  tableColumnConfig: WfoStructuredSearchTableColumnConfig<T>;
};

// The content of the row details modal: the columns of the row as key value pairs
export const WfoRowDetails = <T extends object>({ row, isLoading, tableColumnConfig }: WfoRowDetailsProps<T>) => {
  if (!row) {
    return isLoading ? <EuiLoadingSpinner size="l" /> : null;
  }

  const keyValues = getRowDetailData(row, tableColumnConfig);
  return <WfoKeyValueTable keyValues={keyValues} showCopyToClipboardIcon />;
};
