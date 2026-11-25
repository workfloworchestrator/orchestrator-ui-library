import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiButtonGroup, EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui';

import { useGetOrchestratorConfig } from '@/hooks';

// Opt-in switch between the current and the new (beta) start/process layouts. Kept so users can try the new layout; remove when the new layout becomes the default.
const STORAGE_KEY = 'wfoNewUiPreview';

/**
 * isNewUi is undefined until the choice is read: render neither layout before that. Mounting one form and then
 * the other within 2s makes the second hit pydantic-forms' SWR dedupe cache, so it never gets its form schema.
 *
 * The choice is stored in localStorage, so a user sets it once for all workflow pages and visits.
 */
export const useNewUiPreview = () => {
  const { showBetaWorkflowLayoutToggle } = useGetOrchestratorConfig();
  const [storedIsNewUi, setStoredIsNewUi] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (!showBetaWorkflowLayoutToggle) return;
    try {
      setStoredIsNewUi(localStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      setStoredIsNewUi(false); // storage blocked: current layout
    }
  }, [showBetaWorkflowLayoutToggle]);

  // Full reload on switch, for the same SWR cache reason as above
  const setNewUi = (value: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
    } catch {
      // storage blocked: the choice is not kept
    }
    window.location.reload();
  };

  // Toggle off: always the classic layout, whatever an earlier choice stored
  return {
    isNewUi: showBetaWorkflowLayoutToggle ? storedIsNewUi : false,
    setNewUi,
    showToggle: showBetaWorkflowLayoutToggle,
  };
};

export const WfoLayoutPreviewToggle = ({
  isNewUi,
  onChange,
}: {
  isNewUi?: boolean;
  onChange: (value: boolean) => void;
}) => {
  const t = useTranslations('layoutPreview');
  return (
    <EuiFlexGroup alignItems="center" gutterSize="s" responsive={false} css={{ marginBottom: 16 }}>
      <EuiFlexItem grow={false}>
        <EuiText size="s">
          <strong>{t('label')}:</strong>
        </EuiText>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButtonGroup
          legend={t('label')}
          buttonSize="compressed"
          idSelected={isNewUi ? 'new' : 'current'}
          onChange={(id) => onChange(id === 'new')}
          options={[
            { id: 'current', label: t('classic') },
            { id: 'new', label: t('new') },
          ]}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
