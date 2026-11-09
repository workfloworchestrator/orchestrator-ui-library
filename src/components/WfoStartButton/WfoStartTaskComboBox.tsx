import React from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import { PATH_START_NEW_TASK } from '@/components';
import { useCheckEngineStatus } from '@/hooks';
import { useGetTaskOptionsQuery } from '@/rtk';
import { StartComboBoxOption } from '@/types';

import { WfoStartButtonComboBox } from './WfoStartButtonComboBox';

export const WfoStartTaskButtonComboBox = () => {
  const router = useRouter();
  const t = useTranslations('common');
  const { isEngineRunningNow } = useCheckEngineStatus();

  const { data } = useGetTaskOptionsQuery();
  const taskOptions = data?.startOptions || [];

  const comboBoxOptions: StartComboBoxOption[] = [...taskOptions]
    .map((option) => ({
      data: {
        workflowName: option.name,
      },
      label: option.description ?? option.name,
      disabled: option.isAllowed === false,
    }))
    .sort((taskA, taskB) => taskA.label.localeCompare(taskB.label));

  const handleOptionChange = async (selectedProduct: StartComboBoxOption) => {
    if (await isEngineRunningNow()) {
      const { workflowName } = selectedProduct.data;
      router.push({
        pathname: `${PATH_START_NEW_TASK}/${workflowName}`,
      });
    }
  };

  return (
    <WfoStartButtonComboBox
      buttonText={t('newTask')}
      options={comboBoxOptions}
      onOptionChange={handleOptionChange}
      isProcess={false}
      css={{ width: '600px' }}
    />
  );
};
