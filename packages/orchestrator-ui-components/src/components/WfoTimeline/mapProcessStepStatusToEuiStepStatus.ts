import { EuiStepStatus } from '@elastic/eui/src/components/steps/step_number';

import { StepStatus } from '../../types';

export const mapProcessStepStatusToEuiStepStatus = (processStepStatus: StepStatus): EuiStepStatus => {
  switch (processStepStatus) {
    case StepStatus.SUCCESS:
    case StepStatus.SKIPPED:
    case StepStatus.COMPLETE:
      return 'complete';
    case StepStatus.FAILED:
      return 'danger';
    case StepStatus.RUNNING:
      return 'loading';
    case StepStatus.SUSPEND:
      return 'warning';
    case StepStatus.PENDING:
    default:
      return 'incomplete';
  }
};
