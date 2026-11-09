import { ProcessStatus } from '../types';
import { listIncludesStatus } from './listIncludesStatus';

describe('listIncludesStatus()', () => {
  it('returns true when the uppercased status is in the list', () => {
    expect(listIncludesStatus([ProcessStatus.FAILED, ProcessStatus.WAITING], 'FAILED')).toBe(true);
  });

  it('returns true when the lowercased status is in the list', () => {
    expect(listIncludesStatus([ProcessStatus.FAILED, ProcessStatus.WAITING], 'failed')).toBe(true);
  });

  it('returns false when the status is not in the list', () => {
    expect(listIncludesStatus([ProcessStatus.FAILED], 'COMPLETED')).toBe(false);
  });

  it('returns false when the status is undefined', () => {
    expect(listIncludesStatus([ProcessStatus.FAILED], undefined)).toBe(false);
  });
});
