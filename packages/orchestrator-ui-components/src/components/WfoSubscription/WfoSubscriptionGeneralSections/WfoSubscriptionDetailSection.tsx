import React from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import {
  PATH_TASKS,
  PATH_WORKFLOWS,
  SubscriptionKeyValueBlock,
  WfoCustomerDescriptionsField,
  WfoInSyncField,
  WfoSubscriptionDetailNoteEdit,
  WfoSubscriptionStatusBadge,
} from '@/components';
import { SubscriptionDetail, WorkflowTarget } from '@/types';
import { formatDate } from '@/utils';

interface WfoSubscriptionDetailSectionProps {
  subscriptionDetail: SubscriptionDetail;
}

export const WfoSubscriptionDetailSection = ({ subscriptionDetail }: WfoSubscriptionDetailSectionProps) => {
  const t = useTranslations('subscriptions.detail');

  const {
    subscriptionId,
    product,
    description,
    startDate,
    endDate,
    status,
    customer,
    customerDescriptions,
    processes,
  } = subscriptionDetail;

  const subscriptionDetailBlockData = [
    {
      key: t('subscriptionId'),
      value: subscriptionId,
      textToCopy: subscriptionId,
    },
    {
      key: t('productName'),
      value: product.name,
    },
    {
      key: t('description'),
      value: description,
    },
    {
      key: t('startDate'),
      value: formatDate(startDate),
    },
    {
      key: t('endDate'),
      value: formatDate(endDate),
    },
    {
      key: t('status'),
      value: <WfoSubscriptionStatusBadge status={status} />,
    },
    {
      key: t('insync'),
      value: <WfoInSyncField subscriptionDetail={subscriptionDetail} />,
    },
    {
      key: t('lastRunValidation'),
      value: (() => {
        const lastValidate = processes?.page
          ?.filter((p) => p.workflowTarget.toLowerCase() === WorkflowTarget.VALIDATE.toLowerCase())
          .slice(-1)[0];

        if (!lastValidate) {
          return t('noValidateWorkflows');
        }

        const processUrl = `${lastValidate.isTask ? PATH_TASKS : PATH_WORKFLOWS}/${lastValidate.processId}`;

        return (
          <Link href={processUrl}>
            {lastValidate.lastStatus} ({formatDate(lastValidate.startedAt)})
          </Link>
        );
      })(),
    },
    {
      key: t('customer'),
      value: subscriptionDetail && subscriptionDetail.customer ? `${customer?.fullname}` : '-',
    },
    {
      key: t('customerUuid'),
      value: subscriptionDetail && customer ? `${customer?.customerId}` : '-',
      textToCopy: customer?.customerId,
    },
    {
      key: t('customerDescriptions'),
      value: (
        <WfoCustomerDescriptionsField
          customerDescriptions={customerDescriptions}
          subscriptionCustomerId={customer?.customerId}
          subscriptionId={subscriptionId}
        />
      ),
    },
    {
      key: t('note'),
      value: <WfoSubscriptionDetailNoteEdit subscriptionId={subscriptionId} onlyShowOnHover={true} />,
    },
  ];

  return (
    <SubscriptionKeyValueBlock title={t('blockTitleSubscriptionDetails')} keyValues={subscriptionDetailBlockData} />
  );
};
