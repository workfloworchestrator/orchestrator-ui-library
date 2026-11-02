import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { WfoAgentChat } from './WfoAgentChat';

const config: { orchestratorAgentUrl?: string } = {};
const session: { accessToken?: string } | null = { accessToken: 'token-1' };

jest.mock('@/hooks', () => ({
  useGetOrchestratorConfig: () => config,
  useWfoSession: () => ({ session }),
}));

// The popup itself is the package's; here it is a marker that shows what it was given.
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () => (props: { agentUrl: string; token?: string }) => (
    <div data-testid="wfo-chat" data-agent-url={props.agentUrl} data-token={props.token} />
  ),
}));

describe('WfoAgentChat', () => {
  it('renders nothing when the deployment names no agent', () => {
    delete config.orchestratorAgentUrl;
    const { container } = render(<WfoAgentChat />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the popup for the configured agent with the person's token", () => {
    config.orchestratorAgentUrl = '/agui/';
    render(<WfoAgentChat />);
    const popup = screen.getByTestId('wfo-chat');
    expect(popup).toHaveAttribute('data-agent-url', '/agui/');
    expect(popup).toHaveAttribute('data-token', 'token-1');
  });
});
