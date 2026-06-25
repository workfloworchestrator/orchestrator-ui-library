import React, { ReactNode, useState } from 'react';

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

import { WfoWorkflowGuideExpandablePanel } from './WfoWorkflowGuideExpandablePanel';

interface WfoFormWithUserGuideProps {
  workflowName?: string;
  children: ReactNode;
}

// Wraps a user-input form and shows the collapsible workflow/task user guide beside it.
// When the SHOW_WORKFLOW_USER_GUIDE feature flag is off (or there is no workflow name) the
// form is rendered unchanged. The guide stays next to the form on narrow screens too
// (responsive={false}) so both remain visible together.
export const WfoFormWithUserGuide = ({ workflowName, children }: WfoFormWithUserGuideProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!workflowName) {
    return <>{children}</>;
  }

  return (
    <EuiFlexGroup gutterSize="none">
      <EuiFlexItem grow={true}>{children}</EuiFlexItem>
      <WfoWorkflowGuideExpandablePanel
        workflowName={workflowName}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded((expanded) => !expanded)}
      />
    </EuiFlexGroup>
  );
};
