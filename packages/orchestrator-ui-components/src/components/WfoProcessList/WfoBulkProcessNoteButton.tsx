import React, { useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiButton, EuiFormRow, EuiTextArea } from '@elastic/eui';

import { WfoSubmitModal } from '@/components/WfoSettingsModal/WfoSubmitModal';
import { WfoPencilAlt } from '@/icons';

import type { ProcessListItem } from './WfoProcessesList';
import { useBulkProcessAction } from './useBulkProcessAction';

export const PROCESS_NOTE_MAX_LENGTH = 5000;

export type WfoBulkProcessNoteButtonProps = {
  translationNamespace: string;
  selectedProcesses: ProcessListItem[];
  onActionDone: () => void;
};

export const WfoBulkProcessNoteButton = ({
  translationNamespace,
  selectedProcesses,
  onActionDone,
}: WfoBulkProcessNoteButtonProps) => {
  const t = useTranslations(`${translationNamespace}.note`);
  const { runBulkProcessAction, isLoading } = useBulkProcessAction({
    action: 'note',
    translationNamespace,
    onActionDone,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [note, setNote] = useState('');

  const closeModal = () => {
    setIsModalOpen(false);
    setNote('');
  };

  const handleSubmit = async () => {
    if (await runBulkProcessAction(selectedProcesses, note.trim() ? note : null)) {
      closeModal();
    }
  };

  return (
    <>
      <EuiButton
        size="s"
        iconType={() => <WfoPencilAlt width={16} height={16} color="currentColor" />}
        isDisabled={selectedProcesses.length === 0}
        onClick={() => setIsModalOpen(true)}
      >
        {t('button')}
      </EuiButton>
      {isModalOpen && (
        <WfoSubmitModal
          title={t('title', { count: selectedProcesses.length })}
          submitButtonLabel={t('save')}
          isLoading={isLoading}
          onClose={closeModal}
          onSubmit={handleSubmit}
        >
          <EuiFormRow label={t('label')} helpText={t('helpText')} fullWidth>
            <EuiTextArea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={PROCESS_NOTE_MAX_LENGTH}
              fullWidth
              autoFocus
            />
          </EuiFormRow>
        </WfoSubmitModal>
      )}
    </>
  );
};
