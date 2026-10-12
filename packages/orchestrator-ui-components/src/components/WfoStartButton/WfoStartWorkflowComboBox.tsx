import React from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import { useCheckEngineStatus, useGetOrchestratorConfig } from '@/hooks';
import { useGetWorkflowOptionsQuery } from '@/rtk';
import { ProductLifecycleStatus, StartComboBoxOption } from '@/types';

import { PATH_START_NEW_WORKFLOW } from '../WfoPageTemplate';
import { WfoStartButtonComboBox } from './WfoStartButtonComboBox';
import { filterGroupedStartOptions, getStartWorkflowComboBoxOptions, hasStartWorkflowGroups } from './utils';

export const WfoStartWorkflowButtonComboBox = () => {
  const router = useRouter();
  const t = useTranslations('common');
  const { isEngineRunningNow } = useCheckEngineStatus();
  const { startWorkflowLabel, startWorkflowGroups } = useGetOrchestratorConfig();
  const [selectedProductStatus, setSelectedProductStatus] = React.useState<ProductLifecycleStatus>(
    ProductLifecycleStatus.ACTIVE,
  );

  const { data } = useGetWorkflowOptionsQuery(selectedProductStatus);
  const workflowOptions = data?.startOptions || [];

  const comboBoxOptions: StartComboBoxOption[] = getStartWorkflowComboBoxOptions(
    workflowOptions,
    startWorkflowLabel,
    startWorkflowGroups,
    t('newSubscriptionOtherGroup'),
  );

  const handleOptionChange = async (selectedProduct: StartComboBoxOption) => {
    if (await isEngineRunningNow()) {
      const { workflowName, productId } = selectedProduct.data;
      router.push({
        pathname: `${PATH_START_NEW_WORKFLOW}/${workflowName}`,
        query: { productId },
      });
    }
  };

  return (
    <WfoStartButtonComboBox
      buttonText={t('newSubscription')}
      options={comboBoxOptions}
      onOptionChange={handleOptionChange}
      filterOptions={hasStartWorkflowGroups(startWorkflowGroups) ? filterGroupedStartOptions : undefined}
      isProcess
      css={{ width: '300px' }}
      selectedProductStatus={selectedProductStatus}
      setSelectedProductStatus={setSelectedProductStatus}
    />
  );
};
