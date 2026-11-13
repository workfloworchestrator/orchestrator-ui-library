import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { EuiButtonGroup, EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui';

// Opt-in switch between the current and the new (beta) start/process layouts. Kept so users can try the new layout; remove when the new layout becomes the default.
const STORAGE_KEY = 'wfoNewUiPreview';

/**
 * isNewUi is undefined until the choice is read: render neither layout before that. Mounting one form and then
 * the other within 2s makes the second hit pydantic-forms' SWR dedupe cache, so it never gets its form schema.
 *
 * The choice is kept per browser tab (sessionStorage), so it survives the redirect after submitting a form,
 * and two tabs can show the two layouts side by side. `?newUi=1` / `?newUi=0` in the URL also sets it.
 */
export const useNewUiPreview = () => {
  const router = useRouter();
  const [isNewUi, setIsNewUi] = useState<boolean | undefined>(undefined);
  const queryKey = Object.keys(router.query).find((key) => key.toLowerCase() === 'newui');
  const queryValue = queryKey ? router.query[queryKey] !== '0' : undefined;

  useEffect(() => {
    if (!router.isReady) return;
    try {
      if (queryValue !== undefined) sessionStorage.setItem(STORAGE_KEY, queryValue ? '1' : '0');
      setIsNewUi(queryValue ?? sessionStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      setIsNewUi(!!queryValue);
    }
  }, [router.isReady, queryValue]);

  // Full reload on switch, for the same SWR cache reason as above
  const setNewUi = (value: boolean) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, value ? '1' : '0');
    } catch {
      // storage blocked: fall back to the URL parameter
    }
    const url = new URL(window.location.href);
    [...url.searchParams.keys()]
      .filter((key) => key.toLowerCase() === 'newui')
      .forEach((key) => url.searchParams.delete(key));
    url.searchParams.set('newUi', value ? '1' : '0');
    window.location.replace(url.toString());
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
