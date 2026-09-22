import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import { EuiButton, EuiButtonIcon, EuiContextMenuItem, EuiLoadingSpinner, EuiTitle } from '@elastic/eui';

import {
  PATH_START_NEW_TASK,
  PATH_START_NEW_WORKFLOW,
  PATH_SUBSCRIPTIONS,
  WfoInSyncField,
  WfoPopover,
} from '@/components';
import { getActionItemsByTarget } from '@/components/WfoSubscription';
import { WfoSubscriptionActionsMenuItem } from '@/components/WfoSubscription/WfoSubscriptionActions/WfoSubscriptionActionsMenuItem';
import { getSubscriptionActionStyles } from '@/components/WfoSubscription/WfoSubscriptionActions/styles';
import { useActiveProcess } from '@/components/WfoSubscription/WfoSubscriptionActions/utils';
import { PolicyResource } from '@/configuration/policy-resources';
import { useOrchestratorTheme, usePolicy, useWithOrchestratorTheme } from '@/hooks';
import { WfoDotsHorizontal } from '@/icons/WfoDotsHorizontal';
import { useGetSubscriptionActionsQuery, useGetSubscriptionDetailQuery, useStartProcessMutation } from '@/rtk';
import { WorkflowTarget } from '@/types';

import { WfoTargetTypeIcon } from '../WfoTargetTypeIcon';

type MenuBlockProps = {
  title: string;
};
const MenuBlock: FC<MenuBlockProps> = ({ title }) => (
  <EuiTitle size="xxxs">
    <h3>{title}</h3>
  </EuiTitle>
);

export type WfoSubscriptionActionsProps = {
  subscriptionId: string;
  isLoading?: boolean;
  compactMode?: boolean;
  subscriptionPath?: string;
};

export const WfoSubscriptionActions: FC<WfoSubscriptionActionsProps> = ({
  subscriptionId,
  isLoading,
  compactMode = false,
  subscriptionPath = PATH_SUBSCRIPTIONS,
}) => {
  const t = useTranslations('subscriptions.detail.actions');
  const { theme } = useOrchestratorTheme();
  const { iconStyle } = useWithOrchestratorTheme(getSubscriptionActionStyles);

  const [isPopoverOpen, setPopover] = useState<boolean>(false);
  const router = useRouter();
  const disableQuery = isLoading || (!isPopoverOpen && compactMode);
  const { isAllowed } = usePolicy();
  const { data: subscriptionActions, isLoading: subscriptionActionsIsLoading } = useGetSubscriptionActionsQuery(
    { subscriptionId },
    { skip: disableQuery },
  );
  const [startProcess] = useStartProcessMutation();

  const { data: subscriptionDetail, isLoading: subscriptionDetailIsLoading } = useGetSubscriptionDetailQuery(
    {
      subscriptionId,
    },
    { skip: !isPopoverOpen && compactMode, refetchOnMountOrArgChange: true },
  );

  const processes = subscriptionDetail?.subscription?.processes?.page;
  const { hasActiveProcess, isCompleted, setProcessId } = useActiveProcess(processes);

  const buttonIsLoading = isCompleted ? !isCompleted : hasActiveProcess;

  const onButtonClick = () => setPopover(!isPopoverOpen);
  const closePopover = () => setPopover(false);

  const { SUBSCRIPTION_VALIDATE, SUBSCRIPTION_RECONCILE, SUBSCRIPTION_MODIFY, SUBSCRIPTION_TERMINATE, SET_IN_SYNC } =
    PolicyResource;

  const validateActionItems = getActionItemsByTarget(WorkflowTarget.VALIDATE, subscriptionActions);
  const reconcileActionItems = getActionItemsByTarget(WorkflowTarget.RECONCILE, subscriptionActions);
  const modifyActionItems = getActionItemsByTarget(WorkflowTarget.MODIFY, subscriptionActions);
  const terminateActionItems = getActionItemsByTarget(WorkflowTarget.TERMINATE, subscriptionActions);

  const allowedValidateActionItems = isAllowed(SUBSCRIPTION_VALIDATE + subscriptionId) ? validateActionItems : [];
  const allowedReconcileActionItems = isAllowed(SUBSCRIPTION_RECONCILE + subscriptionId) ? reconcileActionItems : [];
  const allowedModifyActionItems = isAllowed(SUBSCRIPTION_MODIFY + subscriptionId) ? modifyActionItems : [];
  const allowedTerminateActionItems = isAllowed(SUBSCRIPTION_TERMINATE + subscriptionId) ? terminateActionItems : [];

  const noActionItems = !(
    allowedValidateActionItems.length > 0
    || allowedReconcileActionItems.length > 0
    || allowedModifyActionItems.length > 0
    || allowedTerminateActionItems.length > 0
  );

  const button =
    compactMode ?
      <EuiButtonIcon
        iconType={() =>
          buttonIsLoading ? <EuiLoadingSpinner /> : <WfoDotsHorizontal color={theme.colors.textDisabled} />
        }
        onClick={onButtonClick}
        aria-label="Row context menu"
        isLoading={isLoading}
        disabled={noActionItems}
      />
    : <EuiButton
        iconType="arrowDown"
        iconSide="right"
        onClick={onButtonClick}
        isLoading={isLoading}
        disabled={noActionItems}
      >
        {t('actions')}
      </EuiButton>;

  const redirectToUrl = (actionName: string, isTask: boolean = false) => {
    const path = isTask ? PATH_START_NEW_TASK : PATH_START_NEW_WORKFLOW;

    const url = {
      pathname: `${path}/${actionName}`,
      query: {
        subscriptionId,
      },
    };
    router.push(url);
  };

  const silentlyStartAction = (actionName: string) => {
    startProcess({
      workflowName: actionName,
      userInputs: [
        {
          subscription_id: subscriptionId,
        },
      ],
    })
      .unwrap()
      .then((response) => {
        if (response?.id) {
          setProcessId(response.id);
        }
      })
      .catch((error) => {
        console.error(`Failed to start action:`, error);
      })
      .finally(() => {
        closePopover();
      });
  };

  const handleActionClick = (actionName: string, compactMode: boolean, isTask: boolean = false) => {
    if (compactMode) {
      silentlyStartAction(actionName);
    } else {
      redirectToUrl(actionName, isTask);
    }
  };

  const compactItems = (
    <>
      {allowedValidateActionItems.length > 0 ?
        <>
          {!compactMode && <MenuBlock title={t('tasks')} />}
          {allowedValidateActionItems.map((subscriptionAction, index) => (
            <WfoSubscriptionActionsMenuItem
              key={`s_${index}`}
              subscriptionAction={subscriptionAction}
              target={WorkflowTarget.VALIDATE}
              setPopover={setPopover}
              subscriptionPath={subscriptionPath}
              onClick={() => handleActionClick(subscriptionAction.name, compactMode, true)}
              isLoading={buttonIsLoading}
            />
          ))}
        </>
      : <EuiContextMenuItem
          icon={
            <div css={iconStyle}>
              <WfoTargetTypeIcon target={WorkflowTarget.VALIDATE} disabled={true} />
            </div>
          }
          disabled={true}
          css={{ whiteSpace: 'nowrap' }}
        >
          {t('no_tasks')}
        </EuiContextMenuItem>
      }

      {allowedReconcileActionItems.length > 0 && (
        <>
          {!compactMode && <MenuBlock title={t('reconcile')} />}
          {allowedReconcileActionItems.map((subscriptionAction, index) => (
            <WfoSubscriptionActionsMenuItem
              key={`r_${index}`}
              subscriptionAction={
                buttonIsLoading && !subscriptionAction.reason ?
                  { ...subscriptionAction, reason: 'subscription.running_process' }
                : subscriptionAction
              }
              target={WorkflowTarget.RECONCILE}
              setPopover={setPopover}
              subscriptionPath={subscriptionPath}
              onClick={() => handleActionClick(subscriptionAction.name, compactMode, false)}
              isLoading={buttonIsLoading}
            />
          ))}
        </>
      )}

      {isAllowed(SET_IN_SYNC) && compactMode && subscriptionDetail && (
        <div>
          <WfoInSyncField
            compactMode={true}
            subscriptionDetail={subscriptionDetail?.subscription}
            setPopover={setPopover}
          />
        </div>
      )}
    </>
  );

  const fullItems = (
    <>
      {allowedModifyActionItems.length > 0 ?
        <>
          <MenuBlock title={t('modify')} />
          {allowedModifyActionItems.map((subscriptionAction, index) => (
            <WfoSubscriptionActionsMenuItem
              key={`m_${index}`}
              subscriptionAction={subscriptionAction}
              target={WorkflowTarget.MODIFY}
              setPopover={setPopover}
              subscriptionPath={subscriptionPath}
              onClick={() => {
                redirectToUrl(subscriptionAction.name);
              }}
            />
          ))}
        </>
      : <EuiContextMenuItem
          icon={
            <div css={iconStyle}>
              <WfoTargetTypeIcon target={WorkflowTarget.MODIFY} disabled={true} />
            </div>
          }
          disabled={true}
          css={{ whiteSpace: 'nowrap' }}
        >
          {t('no_modify')}
        </EuiContextMenuItem>
      }
      {compactItems}
      {allowedTerminateActionItems.length > 0 ?
        <>
          <MenuBlock title={t('terminate')} />
          {allowedTerminateActionItems.map((subscriptionAction, index) => (
            <WfoSubscriptionActionsMenuItem
              key={`t_${index}`}
              subscriptionAction={subscriptionAction}
              target={WorkflowTarget.TERMINATE}
              setPopover={setPopover}
              subscriptionPath={subscriptionPath}
              onClick={() => {
                redirectToUrl(subscriptionAction.name);
              }}
            />
          ))}
        </>
      : <EuiContextMenuItem
          icon={
            <div css={iconStyle}>
              <WfoTargetTypeIcon target={WorkflowTarget.TERMINATE} disabled={true} />
            </div>
          }
          disabled={true}
          css={{ whiteSpace: 'nowrap' }}
        >
          {t('no_terminate')}
        </EuiContextMenuItem>
      }
    </>
  );

  const MenuItemsList = () => (compactMode ? compactItems : fullItems);

  return (
    <WfoPopover
      id={'subscriptionActionPopover'}
      isLoading={subscriptionActionsIsLoading || (compactMode && subscriptionDetailIsLoading) || isLoading || false}
      button={button}
      PopoverContent={MenuItemsList}
      isPopoverOpen={isPopoverOpen}
      closePopover={() => setPopover(false)}
    />
  );
};
