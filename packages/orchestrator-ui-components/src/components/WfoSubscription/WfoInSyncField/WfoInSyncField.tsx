import React, { useContext, useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiButton, EuiContextMenuItem, EuiLoadingSpinner, EuiToolTip } from '@elastic/eui';

import { WfoIsAllowedToRender } from '@/components';
import { WfoInsyncIcon } from '@/components';
import { PATH_TASKS, PATH_WORKFLOWS } from '@/components';
import { WfoInSyncErrorToastMessage } from '@/components/WfoSubscription/WfoInSyncField/WfoInSyncErrorToastMessage';
import { getSubscriptionActionStyles } from '@/components/WfoSubscription/WfoSubscriptionActions/styles';
import { WfoInSyncCompactIcon } from '@/components/WfoSubscription/WfoTargetTypeIcon';
import { PolicyResource } from '@/configuration/policy-resources';
import { ConfirmationDialogContext } from '@/contexts';
import { useOrchestratorTheme, useShowToastMessage, useWithOrchestratorTheme } from '@/hooks';
import { WfoCheckmarkCircleFill } from '@/icons';
import { useSetSubscriptionInSyncMutation } from '@/rtk/endpoints';
import { SubscriptionDetail, ToastTypes } from '@/types';
import { formatDate } from '@/utils';

import { getLastUncompletedProcess, getLatestTaskDate } from '../utils';

interface WfoInSyncFieldProps {
  subscriptionDetail: SubscriptionDetail;
  compactMode?: boolean;
  setPopover?: (isOpen: boolean) => void;
}

export const WfoInSyncField = ({ subscriptionDetail, compactMode = false, setPopover }: WfoInSyncFieldProps) => {
  const t = useTranslations('subscriptions.detail');
  const { theme } = useOrchestratorTheme();
  const {
    clickableStyle,
    linkMenuItemStyle,
    disabledTextStyle,
    disabledIconStyle,
    secondaryIconStyle,
    spinnerSecondaryIconStyle,
  } = useWithOrchestratorTheme(getSubscriptionActionStyles);
  const [inSync, setInSync] = useState<boolean>(subscriptionDetail.insync);
  const lastTaskRunDate = getLatestTaskDate(subscriptionDetail.processes?.page);
  const lastUncompletedProcess = getLastUncompletedProcess(subscriptionDetail?.processes?.page);

  const [setSubscriptionInSync, { isLoading }] = useSetSubscriptionInSyncMutation();
  const { showToastMessage } = useShowToastMessage();
  const { showConfirmDialog } = useContext(ConfirmationDialogContext);

  useEffect(() => {
    setInSync(subscriptionDetail.insync);
  }, [subscriptionDetail.insync]);

  const setInSyncAction = () => {
    setSubscriptionInSync(subscriptionDetail.subscriptionId)
      .unwrap()
      .then(() => {
        setInSync(true);
        showToastMessage(ToastTypes.SUCCESS, t('setInSyncSuccess.text'), t('setInSyncSuccess.title'));
      })
      .catch((error) => {
        const errorToastMessage =
          error?.data?.detail ?
            <WfoInSyncErrorToastMessage errorDetail={error.data?.detail} />
          : t('setInSyncFailed.text').toString();

        showToastMessage(ToastTypes.ERROR, errorToastMessage, t('setInSyncFailed.title'));
        console.error('Failed to set subscription in sync.', error);
      });
  };

  const confirmSetInSync = () => {
    showConfirmDialog({
      question: t('setInSyncQuestion'),
      onConfirm: () => {
        setInSyncAction();
        setPopover?.(false);
      },
    });
  };

  const getProcessLink = () => {
    const processUrl = `${
      lastUncompletedProcess?.isTask ? PATH_TASKS : PATH_WORKFLOWS
    }/${lastUncompletedProcess?.processId}`;

    return (
      <>
        <Link
          href={processUrl}
          css={{
            paddingLeft: theme.base / 2,
            paddingRight: theme.base,
          }}
        >
          {t('see')} {lastUncompletedProcess?.processId}
        </Link>
        <WfoIsAllowedToRender resource={PolicyResource.PROCESS_RETRY}>
          <EuiButton isLoading={isLoading} isDisabled={isLoading} color="danger" size="s" onClick={confirmSetInSync}>
            {t('setInSync')}
          </EuiButton>
        </WfoIsAllowedToRender>
      </>
    );
  };

  const allowInSyncButton = !inSync && lastUncompletedProcess;
  const showDate = inSync && lastTaskRunDate;

  const InSyncDetails = () => (
    <>
      <div css={{ display: 'flex' }}>
        <div css={{ paddingRight: theme.base / 4, display: 'flex' }}>
          <WfoInsyncIcon inSync={inSync} />
        </div>
        {showDate && `(${formatDate(lastTaskRunDate)})`}
        {!showDate && compactMode && t('subscriptionIsInSync')}
      </div>
    </>
  );

  const InSyncDetailsWithButton = () => (
    <>
      <InSyncDetails />
      {allowInSyncButton && getProcessLink()}
    </>
  );

  const InSyncCompactMenuIcon = () => {
    const LoadingSecondaryIcon = () => (
      <div css={spinnerSecondaryIconStyle}>
        <EuiLoadingSpinner size="s" />
      </div>
    );
    if (!allowInSyncButton) {
      return (
        <div css={disabledIconStyle}>
          <WfoInSyncCompactIcon disabled />
          {isLoading ?
            <LoadingSecondaryIcon />
          : <div css={secondaryIconStyle}>
              <WfoCheckmarkCircleFill width={20} height={20} color={theme.colors.primary} />
            </div>
          }
        </div>
      );
    }
    return (
      <div css={disabledIconStyle}>
        <WfoInSyncCompactIcon disabled={false} />
        {isLoading && <LoadingSecondaryIcon />}
      </div>
    );
  };

  const InSyncCompactMenuItem = () => {
    return (
      <div css={[allowInSyncButton && clickableStyle, linkMenuItemStyle]}>
        <EuiToolTip position="top" content={!allowInSyncButton && <InSyncDetails />}>
          <EuiContextMenuItem
            css={!allowInSyncButton && disabledTextStyle}
            icon={<InSyncCompactMenuIcon />}
            onClick={confirmSetInSync}
            disabled={!allowInSyncButton}
          >
            {t('setInSync')}
          </EuiContextMenuItem>
        </EuiToolTip>
      </div>
    );
  };

  return (
    <>
      {!compactMode ?
        <InSyncDetailsWithButton />
      : <InSyncCompactMenuItem />}
    </>
  );
};
