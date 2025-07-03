import React from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import { useCheckEngineStatus } from '@/hooks';
import { useGetWorkflowOptionsQuery } from '@/rtk';
import { StartComboBoxOption } from '@/types';

import { PATH_START_NEW_WORKFLOW } from '../WfoPageTemplate';
import { WfoStartButtonComboBox } from './WfoStartButtonComboBox';

export const WfoStartWorkflowButtonComboBox = () => {
    const router = useRouter();
    const t = useTranslations('common');
    const { isEngineRunningNow } = useCheckEngineStatus();

    const { data } = useGetWorkflowOptionsQuery();
    const workflowOptions = data?.startOptions || [];

    const comboBoxOptions: StartComboBoxOption[] = [...workflowOptions]
        .sort((workflowA, workflowB) =>
            workflowA.productName.localeCompare(workflowB.productName),
        )
        .map((option) => ({
            data: {
                workflowName: option.workflowName,
                productId: option.productId,
            },
            label: option.productName || '',
            disabled: option.isAllowed === false,
        }));

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
            isProcess
            css={{ width: '300px' }}
        />
    );
};
