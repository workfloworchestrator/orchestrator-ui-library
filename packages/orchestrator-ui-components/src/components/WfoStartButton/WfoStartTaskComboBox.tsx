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
    const taskOptions = data?.startComboBoxOptions || [];

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
            options={taskOptions}
            onOptionChange={handleOptionChange}
            isProcess={false}
        />
    );
};
