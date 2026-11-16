import React, { useEffect, useState } from 'react';

import { EuiButtonGroup, EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui';

// Opt-in switch between the current and the new (beta) start/process layouts. Kept so users can try the new layout; remove when the new layout becomes the default.
const STORAGE_KEY = 'wfoNewUiPreview';

/**
 * isNewUi is undefined until the choice is read: render neither layout before that. Mounting one form and then
 * the other within 2s makes the second hit pydantic-forms' SWR dedupe cache, so it never gets its form schema.
 *
 * The choice is stored in localStorage, so a user sets it once for all workflow pages and visits.
 */
export const useNewUiPreview = () => {
  const [isNewUi, setIsNewUi] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    try {
      setIsNewUi(localStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      setIsNewUi(false); // storage blocked: current layout
    }
  }, []);

  // Full reload on switch, for the same SWR cache reason as above
  const setNewUi = (value: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
    } catch {
      // storage blocked: the choice is not kept
    }
    window.location.reload();
  };

  return { isNewUi, setNewUi };
};

export const WfoLayoutPreviewToggle = ({
  isNewUi,
  onChange,
}: {
  isNewUi?: boolean;
  onChange: (value: boolean) => void;
}) => (
  <EuiFlexGroup alignItems="center" gutterSize="s" responsive={false} css={{ marginBottom: 16 }}>
    <EuiFlexItem grow={false}>
      <EuiText size="s">
        <strong>Layout:</strong>
      </EuiText>
    </EuiFlexItem>
    <EuiFlexItem grow={false}>
      <EuiButtonGroup
        legend="Layout"
        buttonSize="compressed"
        idSelected={isNewUi ? 'new' : 'current'}
        onChange={(id) => onChange(id === 'new')}
        options={[
          { id: 'current', label: 'Classic' },
          { id: 'new', label: 'New (beta)' },
        ]}
      />
    </EuiFlexItem>
  </EuiFlexGroup>
);
