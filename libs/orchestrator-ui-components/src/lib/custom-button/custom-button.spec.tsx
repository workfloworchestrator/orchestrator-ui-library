import { render } from '@testing-library/react';

import CustomButton from './custom-button';

describe('CustomButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CustomButton />);
    expect(baseElement).toBeTruthy();
  });
});
