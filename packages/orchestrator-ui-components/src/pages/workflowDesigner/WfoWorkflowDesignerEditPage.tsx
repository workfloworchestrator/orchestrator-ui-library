import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { EuiCallOut, EuiLoadingSpinner } from '@elastic/eui';

import { WfoWorkflowDesigner } from '@/components/WfoWorkflowDesigner';
import { useGetDesignedWorkflowQuery } from '@/rtk';

export type WfoWorkflowDesignerEditPageProps = {
  /** Name of the designed workflow to edit; omit to design a new one. */
  name?: string;
};

export const WfoWorkflowDesignerEditPage: FC<WfoWorkflowDesignerEditPageProps> = ({ name }) => {
  const t = useTranslations('workflowDesigner');
  const { data, isLoading, isError } = useGetDesignedWorkflowQuery(name ?? '', { skip: !name });

  if (!name) {
    return <WfoWorkflowDesigner />;
  }
  if (isLoading) {
    return <EuiLoadingSpinner size="xl" />;
  }
  if (isError || !data) {
    return <EuiCallOut color="danger" title={t('notFound', { name })} />;
  }
  return <WfoWorkflowDesigner key={name} existing={data.definition} />;
};
