import { ProductLifecycleStatus } from '@/types';

import { getProductLifecycleStatus } from './getProductLifecycleStatus';

describe('getProductLifecycleStatus()', () => {
  it('converts an uppercase GraphQL key to its ProductLifecycleStatus value', () => {
    expect(getProductLifecycleStatus('ACTIVE')).toBe(ProductLifecycleStatus.ACTIVE);
    expect(getProductLifecycleStatus('PRE_PRODUCTION')).toBe(ProductLifecycleStatus.PRE_PRODUCTION);
    expect(getProductLifecycleStatus('PHASE_OUT')).toBe(ProductLifecycleStatus.PHASE_OUT);
    expect(getProductLifecycleStatus('END_OF_LIFE')).toBe(ProductLifecycleStatus.END_OF_LIFE);
  });

  it('converts a lowercase key to its ProductLifecycleStatus value', () => {
    expect(getProductLifecycleStatus('pre_production')).toBe(ProductLifecycleStatus.PRE_PRODUCTION);
  });

  it('converts a mixed case key to its ProductLifecycleStatus value', () => {
    expect(getProductLifecycleStatus('Phase_Out')).toBe(ProductLifecycleStatus.PHASE_OUT);
  });

  it('returns undefined for a status that does not match any ProductLifecycleStatus key', () => {
    expect(getProductLifecycleStatus('not_a_status')).toBeUndefined();
    expect(getProductLifecycleStatus('')).toBeUndefined();
    expect(getProductLifecycleStatus('active_pending')).toBeUndefined();
  });
});
