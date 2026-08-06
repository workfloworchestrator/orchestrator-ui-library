import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import { EuiButton, EuiButtonIcon, EuiLoadingSpinner, EuiTitle } from '@elastic/eui';

import {
  PATH_START_NEW_TASK,
  PATH_START_NEW_WORKFLOW,
  PATH_SUBSCRIPTIONS,
  WfoInSyncField,
  WfoPopover,
} from '@/components';
import { WfoSubscriptionActionsMenuItem } from '@/components/WfoSubscription/WfoSubscriptionActions/WfoSubscriptionActionsMenuItem';
import { useActiveProcess } from '@/components/WfoSubscription/WfoSubscriptionActions/utils';
import { PolicyResource } from '@/configuration/policy-resources';
import { useOrchestratorTheme, usePolicy } from '@/hooks';
import { WfoDotsHorizontal } from '@/icons/WfoDotsHorizontal';
import { useGetSubscriptionActionsQuery, useGetSubscriptionDetailQuery, useStartProcessMutation } from '@/rtk';
import { SubscriptionAction, WorkflowTarget } from '@/types';

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

  const button =
    compactMode ?
      <EuiButtonIcon
        iconType={() =>
          buttonIsLoading ? <EuiLoadingSpinner /> : <WfoDotsHorizontal color={theme.colors.textDisabled} />
        }
        onClick={onButtonClick}
        aria-label="Row context menu"
        isLoading={isLoading}
      />
    : <EuiButton iconType="arrowDown" iconSide="right" onClick={onButtonClick} isLoading={isLoading}>
        {t('actions')}
      </EuiButton>;

  const { SUBSCRIPTION_VALIDATE, SUBSCRIPTION_RECONCILE, SUBSCRIPTION_MODIFY, SUBSCRIPTION_TERMINATE, SET_IN_SYNC } =
    PolicyResource;

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

  const getActionItems = (workflowTarget: WorkflowTarget): SubscriptionAction[] => {
    // Core versions 5.2 and lower return subscriptionActions result with lowercase keynames. Higher version return them uppercased to align
    // with all the other places they are used. We support both for now. The lowercase keys are deliberately not part of the
    // SubscriptionActions type, so the fallback is a runtime-only check behind a cast.
    const actionsByTarget = subscriptionActions as unknown as
      | Record<string, SubscriptionAction[] | undefined>
      | undefined;

    return actionsByTarget?.[workflowTarget] ?? actionsByTarget?.[workflowTarget.toLowerCase()] ?? [];
  };

  const validateActionItems = getActionItems(WorkflowTarget.VALIDATE);
  const reconcileActionItems = getActionItems(WorkflowTarget.RECONCILE);
  const modifyActionItems = getActionItems(WorkflowTarget.MODIFY);
  const terminateActionItems = getActionItems(WorkflowTarget.TERMINATE);

  const compactItems = (
    <>
      {isAllowed(SUBSCRIPTION_VALIDATE + subscriptionId) && validateActionItems.length > 0 && (
        <>
          {!compactMode && <MenuBlock title={t('tasks')} />}
          {validateActionItems.map((subscriptionAction, index) => (
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
      )}

      {isAllowed(SUBSCRIPTION_RECONCILE + subscriptionId) && reconcileActionItems.length > 0 && (
        <>
          {!compactMode && <MenuBlock title={t('reconcile')} />}
          {reconcileActionItems.map((subscriptionAction, index) => (
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
      {isAllowed(SUBSCRIPTION_MODIFY + subscriptionId) && modifyActionItems.length > 0 && (
        <>
          <MenuBlock title={t('modify')} />
          {modifyActionItems.map((subscriptionAction, index) => (
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
      )}
      {compactItems}
      {isAllowed(SUBSCRIPTION_TERMINATE + subscriptionId) && terminateActionItems.length > 0 && (
        <>
          <MenuBlock title={t('terminate')} />
          {terminateActionItems.map((subscriptionAction, index) => (
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
      )}
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
