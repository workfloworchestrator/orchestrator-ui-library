import { render } from '@testing-library/react';

import OrchestratorUiComponents from './orchestrator-ui-components';

describe('OrchestratorUiComponents', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrchestratorUiComponents />);
    expect(baseElement).toBeTruthy();
  });
});
