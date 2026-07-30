import { renderHook, waitFor } from '@testing-library/react';

import { EntityKind } from '@/types';

import { useFieldsPathInfo } from './usePathAutoComplete';

const fetchPathsMock = jest.fn();

jest.mock('@/rtk/endpoints', () => ({
  useSearchPathsQuery: jest.fn(),
  useLazySearchPathsQuery: () => [fetchPathsMock],
  useSearchDefinitionsQuery: () => ({
    data: {
      boolean: {
        operators: ['eq', 'neq'],
        value_schema: { eq: { kind: 'boolean' }, neq: { kind: 'boolean' } },
      },
    },
    isError: false,
  }),
}));

describe('useFieldsPathInfo', () => {
  beforeEach(() => {
    fetchPathsMock.mockImplementation(({ q }: { q: string }) => ({
      unwrap: () =>
        Promise.resolve(
          q === 'lldp' ?
            { leaves: [{ name: 'lldp', ui_types: ['boolean'], paths: [] }], components: [] }
          : { leaves: [], components: [] },
        ),
    }));
  });

  it('resolves the path info of an exactly matching leaf', async () => {
    const { result } = renderHook(() => useFieldsPathInfo(['lldp'], EntityKind.SUBSCRIPTION));

    await waitFor(() => expect(result.current.get('lldp')).toBeTruthy());
    expect(result.current.get('lldp')).toMatchObject({
      path: 'lldp',
      ui_types: ['boolean'],
      operators: ['eq', 'neq'],
    });
  });

  it('stores null for a field the backend does not know', async () => {
    const { result } = renderHook(() => useFieldsPathInfo(['nonexistent'], EntityKind.SUBSCRIPTION));

    await waitFor(() => expect(result.current.has('nonexistent')).toBe(true));
    expect(result.current.get('nonexistent')).toBeNull();
  });

  it('looks up each field at most once across rerenders', async () => {
    const { result, rerender } = renderHook(({ fields }) => useFieldsPathInfo(fields, EntityKind.SUBSCRIPTION), {
      initialProps: { fields: ['lldp'] },
    });

    await waitFor(() => expect(result.current.has('lldp')).toBe(true));
    rerender({ fields: ['lldp'] });
    rerender({ fields: ['lldp'] });

    expect(fetchPathsMock).toHaveBeenCalledTimes(1);
  });
});
