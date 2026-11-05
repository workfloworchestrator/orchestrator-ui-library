import React, { FC, useMemo } from 'react';

import dynamic from 'next/dynamic';

import type { WfoChatColors } from '@workfloworchestrator/wfo-chat';

import { useGetOrchestratorConfig, useOrchestratorTheme, useWfoSession } from '@/hooks';
import type { WfoComputedTheme } from '@/theme';

// The popup keeps its thread in session storage and renders in a shadow root: client only.
const WfoChat = dynamic(() => import('@workfloworchestrator/wfo-chat').then((module) => module.WfoChat), {
  ssr: false,
});

/**
 * The popup's colours from the theme, so that it wears the WFO UI's own, a deployment's overrides included.
 * The popup fills with `accent` and writes with `accentText`: EUI's `primary` and `textPrimary`.
 */
export const getWfoChatColors = (theme: WfoComputedTheme, isDarkModeActive: boolean): WfoChatColors => ({
  bg: theme.colors.backgroundBaseNeutral,
  surface: theme.colors.backgroundBaseSubdued,
  line: theme.colors.borderBasePlain,
  ink: theme.colors.textParagraph,
  muted: theme.colors.textSubdued,
  accent: theme.colors.primary,
  accentStrong: isDarkModeActive ? theme.colors.backgroundFilledPrimary : theme.colors.textPrimary,
  accentText: theme.colors.textPrimary,
  accentSoft: theme.colors.backgroundLightPrimary,
  onAccent: theme.colors.textInverse,
  mark: theme.colors.header,
  onMark: theme.colors.textGhost,
  wait: theme.colors.textWarning,
  waitSoft: theme.colors.highlight,
  danger: theme.colors.textDanger,
  dangerSoft: theme.colors.backgroundBaseDanger,
});

/**
 * The WFO agent as a chat popup in the corner of every page, for a deployment that names its agent
 * (`orchestratorAgentUrl`). The person's access token goes along, so the agent acts as them, and the theme
 * goes along, so the popup looks like the page.
 */
export const WfoAgentChat: FC = () => {
  const { orchestratorAgentUrl } = useGetOrchestratorConfig();
  const { session } = useWfoSession();
  const { theme, isDarkModeActive } = useOrchestratorTheme();
  const colors = useMemo(() => getWfoChatColors(theme, isDarkModeActive), [theme, isDarkModeActive]);

  if (!orchestratorAgentUrl) {
    return null;
  }

  return (
    <WfoChat
      agentUrl={orchestratorAgentUrl}
      token={session?.accessToken}
      theme={isDarkModeActive ? 'dark' : 'light'}
      colors={colors}
    />
  );
};
