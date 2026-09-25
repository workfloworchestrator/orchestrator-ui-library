import React, { useContext } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import {
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButton,
  EuiCallOut,
  EuiHorizontalRule,
  EuiLink,
  EuiText,
} from '@elastic/eui';

import { PATH_START_NEW_TASK, PATH_WORKFLOW_DESIGNER, WfoContentHeader } from '@/components';
import { ConfirmationDialogContext } from '@/contexts';
import { useShowToastMessage } from '@/hooks';
import { useDeleteDesignedWorkflowMutation, useGetDesignedWorkflowsQuery } from '@/rtk';
import { ToastTypes, WorkflowDesignerStoredWorkflow } from '@/types';

export const WfoWorkflowDesignerListPage = () => {
  const t = useTranslations('workflowDesigner.list');
  const router = useRouter();
  const { showConfirmDialog } = useContext(ConfirmationDialogContext);
  const { showToastMessage } = useShowToastMessage();
  const { data: workflows = [], isLoading, isError } = useGetDesignedWorkflowsQuery();
  const [deleteWorkflow] = useDeleteDesignedWorkflowMutation();

  const onDelete = (name: string) =>
    showConfirmDialog({
      question: t('deleteQuestion', { name }),
      onConfirm: async () => {
        const result = await deleteWorkflow(name);
        if ('data' in result && result.data) {
          showToastMessage(ToastTypes.SUCCESS, name, t(result.data.result));
        } else {
          showToastMessage(ToastTypes.ERROR, name, t('deleteFailed'));
        }
      },
    });

  const columns: EuiBasicTableColumn<WorkflowDesignerStoredWorkflow>[] = [
    {
      name: t('name'),
      render: (workflow: WorkflowDesignerStoredWorkflow) => (
        <EuiLink onClick={() => router.push(`${PATH_WORKFLOW_DESIGNER}/${workflow.definition.name}`)}>
          {workflow.definition.name}
        </EuiLink>
      ),
    },
    { name: t('description'), render: (workflow: WorkflowDesignerStoredWorkflow) => workflow.definition.description },
    {
      name: t('steps'),
      render: (workflow: WorkflowDesignerStoredWorkflow) => (
        <EuiText size="xs">
          {workflow.definition.steps.map((step) => step.step_id.split(':').pop()).join(' → ')}
        </EuiText>
      ),
    },
    { field: 'version', name: t('version'), width: '80px' },
    { field: 'process_count', name: t('processes'), width: '100px' },
    {
      name: t('actions'),
      width: '120px',
      actions: [
        {
          name: t('start'),
          description: t('start'),
          icon: 'play',
          type: 'icon',
          onClick: (workflow) => router.push(`${PATH_START_NEW_TASK}/${workflow.definition.name}`),
        },
        {
          name: t('edit'),
          description: t('edit'),
          icon: 'pencil',
          type: 'icon',
          onClick: (workflow) => router.push(`${PATH_WORKFLOW_DESIGNER}/${workflow.definition.name}`),
        },
        {
          name: t('delete'),
          description: t('delete'),
          icon: 'trash',
          type: 'icon',
          color: 'danger',
          onClick: (workflow) => onDelete(workflow.definition.name),
        },
      ],
    },
  ];

  return (
    <>
      <WfoContentHeader title={t('title')} subtitle={<EuiHorizontalRule margin="s" />}>
        <EuiButton fill iconType="plusInCircle" onClick={() => router.push(`${PATH_WORKFLOW_DESIGNER}/new`)}>
          {t('new')}
        </EuiButton>
      </WfoContentHeader>
      <EuiText size="s" color="subdued">
        {t('intro')}
      </EuiText>
      {isError && <EuiCallOut color="danger" title={t('loadFailed')} />}
      <EuiBasicTable
        items={workflows}
        columns={columns}
        loading={isLoading}
        noItemsMessage={t('empty')}
        tableCaption={t('title')}
      />
    </>
  );
};
