import { act, renderHook, waitFor } from '@testing-library/react';

import { useSearchPathsQuery } from '@/rtk/endpoints';
import { EntityKind, PathAutocompleteResponse } from '@/types';

import { useFieldsPathInfo, usePathAutocomplete } from './usePathAutoComplete';

const fetchPathsMock = jest.fn();

jest.mock('@/rtk/endpoints', () => {
  // Stable like RTK Query's cached data: the hooks depend on it in effects.
  const definitionsResult = {
    data: {
      boolean: {
        operators: ['eq', 'neq'],
        value_schema: { eq: { kind: 'boolean' }, neq: { kind: 'boolean' } },
      },
    },
    isError: false,
  };
  return {
    useSearchPathsQuery: jest.fn(),
    useLazySearchPathsQuery: () => [fetchPathsMock],
    useSearchDefinitionsQuery: () => definitionsResult,
  };
});

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

describe('usePathAutocomplete', () => {
  const SAPS_RESPONSE = {
    leaves: [],
    components: [{ name: 'saps', ui_types: ['component'], paths: ['saps.port', 'saps.vlan'] }],
  };
  const EMPTY_RESPONSE: PathAutocompleteResponse = { leaves: [], components: [] };

  // Only the fields the hook reads; the full RTK Query result type is far larger.
  const mockSearchPaths = (
    getData: (args: { q: string }, options?: { skip?: boolean }) => PathAutocompleteResponse | undefined,
  ) =>
    jest.mocked(useSearchPathsQuery).mockImplementation(((args: { q: string }, options?: { skip?: boolean }) => ({
      data: getData(args, options),
      isFetching: false,
      isError: false,
    })) as unknown as typeof useSearchPathsQuery);

  beforeEach(() => {
    jest.useFakeTimers();
    mockSearchPaths((args, options) => {
      if (options?.skip) return undefined;
      return args.q === 'sa' ? SAPS_RESPONSE : EMPTY_RESPONSE;
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('skips the paths request and offers no paths while the prefix is empty', () => {
    const { result } = renderHook(() => usePathAutocomplete('', EntityKind.SUBSCRIPTION));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(useSearchPathsQuery).toHaveBeenCalled();
    jest.mocked(useSearchPathsQuery).mock.calls.forEach(([, options]) => expect(options?.skip).toBe(true));
    expect(result.current.paths).toEqual([]);
  });

  it('reports loading from the keystroke until the debounced request has settled', async () => {
    const { result, rerender } = renderHook(({ prefix }) => usePathAutocomplete(prefix, EntityKind.SUBSCRIPTION), {
      initialProps: { prefix: '' },
    });
    expect(result.current.loading).toBe(false);

    rerender({ prefix: 'sa' });
    expect(result.current.loading).toBe(true);
    expect(result.current.paths).toEqual([]);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.paths).toHaveLength(1);
  });

  it('maps the components returned for a typed prefix, e.g. saps for "sa"', async () => {
    const { result } = renderHook(() => usePathAutocomplete('sa', EntityKind.SUBSCRIPTION));

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => expect(result.current.paths).toHaveLength(1));
    expect(useSearchPathsQuery).toHaveBeenLastCalledWith(
      { q: 'sa', entity_type: EntityKind.SUBSCRIPTION },
      { skip: false },
    );
    expect(result.current.paths[0]).toMatchObject({
      path: 'saps',
      type: 'component',
      group: 'component',
      availablePaths: ['saps.port', 'saps.vlan'],
    });
  });
});
