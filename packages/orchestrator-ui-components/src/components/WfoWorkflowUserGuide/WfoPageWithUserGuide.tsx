import React, { ReactNode, useState } from 'react';

import { EuiFlexGroup, EuiFlexItem, useIsWithinBreakpoints } from '@elastic/eui';

import { useGetOrchestratorConfig } from '@/hooks';

import { WfoWorkflowGuideExpandablePanel } from './WfoWorkflowGuideExpandablePanel';

interface WfoFormWithUserGuideProps {
  workflowName?: string;
  children: ReactNode;
}

export const WfoPageWithUserGuide = ({ workflowName, children }: WfoFormWithUserGuideProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isBigScreen = useIsWithinBreakpoints(['xl', 'xxl']);
  const { showWorkflowUserGuide } = useGetOrchestratorConfig();

  if (!workflowName || !showWorkflowUserGuide) {
    return <>{children}</>;
  }

  const workflowGuideExpandablePanel = (
    <WfoWorkflowGuideExpandablePanel
      workflowName={workflowName}
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded((expanded) => !expanded)}
    />
  );

  return (
    <EuiFlexGroup
      gutterSize="s"
      direction={isBigScreen ? 'row' : 'column'}
      alignItems={isBigScreen ? 'flexStart' : 'stretch'}
    >
      {!isBigScreen && workflowGuideExpandablePanel}
      <EuiFlexItem grow={true} css={{ minWidth: 0 }}>
        {children}
      </EuiFlexItem>
      {isBigScreen && workflowGuideExpandablePanel}
    </EuiFlexGroup>
  );
};
