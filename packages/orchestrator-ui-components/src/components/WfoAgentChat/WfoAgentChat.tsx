import React, { FC } from 'react';

import dynamic from 'next/dynamic';

import { useGetOrchestratorConfig, useWfoSession } from '@/hooks';

// The popup keeps its thread in session storage and renders in a shadow root: client only.
const WfoChat = dynamic(() => import('@workfloworchestrator/wfo-chat').then((module) => module.WfoChat), {
  ssr: false,
});

/**
 * The WFO agent as a chat popup in the corner of every page, for a deployment that names its agent
 * (`orchestratorAgentUrl`). The person's access token goes along, so the agent acts as them.
 */
export const WfoAgentChat: FC = () => {
  const { orchestratorAgentUrl } = useGetOrchestratorConfig();
  const { session } = useWfoSession();

  if (!orchestratorAgentUrl) {
    return null;
  }

  return <WfoChat agentUrl={orchestratorAgentUrl} token={session?.accessToken} />;
};
