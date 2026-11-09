import {
  StoredTableConfig,
  getTableConfigFromLocalStorage,
  isValidLocalStorageTableConfig,
} from './tableConfigPersistence';

// Note: for some testcases a typecast is needed on the testObject to bypass TSC errors
describe('tableConfigPersistence', () => {
  describe('isValidLocalStorageTableConfig', () => {
    it('returns true if the input-object does contain LocalStorageTableConfig properties', () => {
      const testObject: StoredTableConfig<unknown> = {
        hiddenColumns: [],
        selectedPageSize: 10,
      };
      const result = isValidLocalStorageTableConfig(testObject);
      expect(result).toEqual(true);
    });

    it('returns false if the input-object contains undefined properties of the LocalStorageTableConfig type', () => {
      const testObject = {
        hiddenColumns: undefined,
        selectedPageSize: undefined,
      } as unknown as StoredTableConfig<unknown>;
      const result = isValidLocalStorageTableConfig(testObject);
      expect(result).toEqual(false);
    });

    it('returns false if the input-object does not contain LocalStorageTableConfig properties', () => {
      const testObject = {} as StoredTableConfig<unknown>;
      const result = isValidLocalStorageTableConfig(testObject);
      expect(result).toEqual(false);
    });
  });

  describe('getTableConfigFromLocalStorage', () => {
    it('returns the tableConfig from LocalStorage when it is valid', () => {
      // given
      const testObject = {
        hiddenColumns: [],
        selectedPageSize: 10,
      };
      localStorage.removeItem('testCase1');
      localStorage.setItem('testCase1', JSON.stringify(testObject));

      // when
      const result = getTableConfigFromLocalStorage<unknown>('testCase1');

      // then
      expect(result).toEqual(testObject);
    });

    it('returns the undefined when the object in local storage is not a valid tableConfig', () => {
      // given
      const testObject = {
        hiddenColumns: undefined,
      };
      localStorage.removeItem('testCase2');
      localStorage.setItem('testCase2', JSON.stringify(testObject));

      // when
      const result = getTableConfigFromLocalStorage<unknown>('testCase2');

      // then
      expect(result).toEqual(undefined);
    });

    it('returns the undefined when the object in local storage is not valid json', () => {
      // given
      const testObject = '{ invalid json " ';
      localStorage.removeItem('testCase3');
      localStorage.setItem('testCase3', JSON.stringify(testObject));

      // when
      const result = getTableConfigFromLocalStorage<unknown>('testCase3');

      // then
      expect(result).toEqual(undefined);
    });
  });
});
