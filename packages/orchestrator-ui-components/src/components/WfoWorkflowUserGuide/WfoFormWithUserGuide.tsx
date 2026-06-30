import React, { ReactNode, useState } from 'react';

import { EuiFlexGroup, EuiFlexItem, useIsWithinBreakpoints } from '@elastic/eui';

import { useGetOrchestratorConfig } from '@/hooks';

import { WfoWorkflowGuideExpandablePanel } from './WfoWorkflowGuideExpandablePanel';

interface WfoFormWithUserGuideProps {
  workflowName?: string;
  children: ReactNode;
}

export const WfoFormWithUserGuide = ({ workflowName, children }: WfoFormWithUserGuideProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isStacked = useIsWithinBreakpoints(['xs', 's', 'm', 'l']);
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
    <EuiFlexGroup gutterSize="s" direction={isStacked ? 'column' : 'row'}>
      {isStacked && workflowGuideExpandablePanel}
      <EuiFlexItem grow={true}>{children}</EuiFlexItem>
      {!isStacked && workflowGuideExpandablePanel}
    </EuiFlexGroup>
  );
};
