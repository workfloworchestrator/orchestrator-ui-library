import { useCallback, useEffect, useState } from 'react';

export type SummaryCardPreferences = { order: string[]; expanded: string[] };

/** The default key. Bump the version when the stored shape changes. */
export const DEFAULT_SUMMARY_CARDS_STORAGE_KEY = 'wfo.summaryCards.v1';

const emptyPreferences: SummaryCardPreferences = { order: [], expanded: [] };

const readPreferences = (storageKey: string): SummaryCardPreferences => {
  try {
    const savedPreferences = JSON.parse(window.localStorage.getItem(storageKey) ?? 'null');
    return {
      order: Array.isArray(savedPreferences?.order) ? savedPreferences.order : [],
      expanded: Array.isArray(savedPreferences?.expanded) ? savedPreferences.expanded : [],
    };
  } catch {
    return emptyPreferences; // storage unavailable or invalid JSON
  }
};

/** Card order (row by row) and open cards, saved in local storage. Cards start collapsed. */
export const useWfoSummaryCardPreferences = (storageKey: string) => {
  const [preferences, setPreferences] = useState<SummaryCardPreferences>(emptyPreferences);

  // Read after mount so server and first client render match.
  useEffect(() => setPreferences(readPreferences(storageKey)), [storageKey]);

  // Takes a function of the current preferences, so two quick changes never overwrite each other.
  const updatePreferences = useCallback(
    (getNextPreferences: (currentPreferences: SummaryCardPreferences) => SummaryCardPreferences) =>
      setPreferences((currentPreferences) => {
        const nextPreferences = getNextPreferences(currentPreferences);
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(nextPreferences));
        } catch {
          // Still works for this session without storage.
        }
        return nextPreferences;
      }),
    [storageKey],
  );

  return { preferences, updatePreferences };
};
