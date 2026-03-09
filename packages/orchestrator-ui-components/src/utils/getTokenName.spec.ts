import { getTokenName } from './getTokenName';

describe('getTokenName()', () => {
  it('returns "tokenNamespace" when name is "Node"', () => {
    const result = getTokenName('Node');
    expect(result).toEqual('tokenNamespace');
  });
  it('returns "tokenEnumMember" when name is "IP BGP Service Settings"', () => {
    const result = getTokenName('IP BGP Service Settings');
    expect(result).toEqual('tokenEnumMember');
  });
  it('returns "tokenIP" when name is "IP_PREFIX"', () => {
    const result = getTokenName('IP_PREFIX');
    expect(result).toEqual('tokenIP');
  });
  it('returns "tokenConstant" when name does not exists', () => {
    const result = getTokenName('NOT_EXISTING_NAME');
    expect(result).toEqual('tokenConstant');
  });
});
