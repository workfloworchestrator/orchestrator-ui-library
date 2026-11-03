import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';
import { formatQuery } from 'react-querybuilder/formatQuery';

import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import type { TableColumnKeys, WfoDataSorting } from '@/components/WfoTable/utils/columns';
import { DEFAULT_PAGE_SIZE } from '@/components/WfoTable/utils/constants';
import { RetrieverType } from '@/types';

import type { SearchParams } from './WfoStructuredSearchTable';
import { parseCelToRuleGroup } from './utils';

type UseStructuredSearchStateOptions<T extends object> = {
  defaultSorting: WfoDataSorting<T>;
  // Anything else that makes a next-page cursor invalid, e.g. the selected tab
  searchKeyScope?: unknown[];
};

/**
 * State of a list that uses the WfoStructuredSearchTable: the search bar, the filter builder, the
 * committed search, sorting, page size and the next-page cursor.
 *
 * The committed query and filter live in the URL (queryString and filterString params) so a link
 * reproduces the search and browser back/forward re-runs it. The filter is stored as a CEL string
 * and parsed back to a rule group.
 */
export const useStructuredSearchState = <T extends object>({
  defaultSorting,
  searchKeyScope = [],
}: UseStructuredSearchStateOptions<T>) => {
  const [retrieverType, setRetrieverType] = useState<RetrieverType>(RetrieverType.Auto);

  // String that is displayed in the search bar, and the CEL string displayed in the filter textarea.
  // Only when committed (and valid) are they passed to the search.
  const [queryString, setQueryString] = useState<string>('');
  const [filterString, setFilterString] = useState<string>('');
  const [queryBuilderRuleGroup, setQueryBuilderRuleGroup] = useState<RuleGroupType | undefined>();
  const [isValidFilterString, setIsValidFilterString] = useState<boolean>(true);
  // Set when a commit attempt (Apply filter, or enter in the search bar) is refused because the
  // filter draft is invalid; used to hide the search results, see isSearchBlocked below.
  const [isCommitRefused, setIsCommitRefused] = useState<boolean>(false);

  const [committedQueryString, setCommittedQueryString] = useQueryParam('queryString', withDefault(StringParam, ''));
  const [committedFilterString, setCommittedFilterString] = useQueryParam('filterString', withDefault(StringParam, ''));
  const committedRuleGroup = useMemo<RuleGroupType | undefined>(
    () => parseCelToRuleGroup(committedFilterString),
    [committedFilterString],
  );

  // Track the last value this hook committed, so the URL->state sync effects below only rebuild the
  // inputs for external changes (page load, back/forward). Rebuilding on own commits would revert
  // characters typed right after committing (search bar) or visibly restructure builder rules the
  // CEL round trip cannot preserve, such as 'between'. The refs hold the value as the params decode
  // it (absent param -> ''); the setters receive undefined to remove an empty param from the URL.
  const lastSelfCommittedFilter = useRef('');
  const commitFilterString = (celString: string) => {
    lastSelfCommittedFilter.current = celString;
    setCommittedFilterString(celString || undefined);
  };
  const lastSelfCommittedQueryString = useRef('');
  const commitQueryString = (queryString: string) => {
    lastSelfCommittedQueryString.current = queryString;
    setCommittedQueryString(queryString || undefined);
  };

  // Columns the user hid in the table; only the visible columns are requested from the backend
  const [hiddenColumns, setHiddenColumns] = useState<TableColumnKeys<T>>([]);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [dataSorting, setDataSorting] = useState<WfoDataSorting<T>>(defaultSorting);
  const [pageCursor, setPageCursor] = useState<{ cursor: string; searchKey: string } | undefined>(undefined);

  // A next-page cursor is only valid for the committed search that produced it. Binding it to a key
  // of that search covers commits that bypass the handlers below, e.g. browser back/forward changing
  // the URL params: the key no longer matches, so the stale cursor is not sent along with the new search.
  const committedSearchKey = JSON.stringify([
    committedQueryString,
    committedFilterString,
    retrieverType,
    dataSorting,
    hiddenColumns,
    ...searchKeyScope,
  ]);
  const cursor = pageCursor?.searchKey === committedSearchKey ? pageCursor.cursor : undefined;

  // Formats the given rule group to CEL and commits it. Returns false without committing when
  // the CEL would not survive the URL round trip: formatQuery escapes double quotes in values
  // but parseCEL has no escape support, so such a filter would silently be dropped after
  // committing. Refusing keeps the URL and the search results consistent.
  const commitFilterDraft = (effectiveRuleGroup: RuleGroupType | undefined): boolean => {
    // '' (no rule group, or only placeholder rules) commits an empty filter, clearing the URL param.
    const celQuery =
      effectiveRuleGroup ? formatQuery(effectiveRuleGroup, { format: 'cel', fallbackExpression: '' }) : '';
    if (celQuery && !parseCelToRuleGroup(celQuery)) {
      setIsValidFilterString(false);
      setIsCommitRefused(true);
      return false;
    }
    commitFilterString(celQuery);
    setIsCommitRefused(false);
    return true;
  };

  const handleApplyFilter = (searchParams?: SearchParams) => {
    const ruleGroupParam = searchParams?.ruleGroup;
    // Use an explicitly passed rule group when provided (e.g. a column-header search), a cleared filter
    // when `false`, and otherwise the current query builder state (the "Apply filter" button).
    const effectiveRuleGroup = ruleGroupParam === false ? undefined : (ruleGroupParam ?? queryBuilderRuleGroup);
    if (!commitFilterDraft(effectiveRuleGroup)) {
      return;
    }
    // Also commit the draft search text, so applying a filter picks up text typed in the
    // search bar without pressing enter.
    commitQueryString(queryString);
    setPageCursor(undefined);
  };

  const onSearchQueryString = (queryString: string) => {
    setQueryString(queryString);
    // Mirror handleApplyFilter: searching also commits the pending filter draft, and an invalid
    // draft refuses the whole search, nothing commits and the results are hidden until the
    // draft is fixed. The isValidFilterString check guards the textarea state, which the
    // queryBuilderRuleGroup (holding the last *valid* parse) does not reflect while invalid.
    if (!isValidFilterString) {
      setIsCommitRefused(true);
      return;
    }
    if (!commitFilterDraft(queryBuilderRuleGroup)) {
      return;
    }
    commitQueryString(queryString);
    setPageCursor(undefined);
  };

  const onUpdateRetrieverType = (retrieverType: RetrieverType) => {
    setRetrieverType(retrieverType);
    setPageCursor(undefined);
  };

  const safeCelParse = useCallback((celString: string) => {
    if (celString === '') {
      setIsValidFilterString(true);
      return;
    }
    // parseCelToRuleGroup returns undefined when the string parses to no rules, in that
    // case we assume the string is not valid. In any case it would not do anything to the
    // search results. It also assigns the rule ids parseCEL leaves out, which the query
    // builder needs to keep rule identity stable across query updates.
    const ruleGroup = parseCelToRuleGroup(celString);
    if (ruleGroup) {
      setIsValidFilterString(true);
      setQueryBuilderRuleGroup(ruleGroup);
    } else {
      setIsValidFilterString(false);
    }
  }, []);

  // Populate the search bar and the filter builder from the URL, both on page load and when
  // back/forward navigation changes the committed search. Commits made by this hook are skipped,
  // see the lastSelfCommitted refs above.
  useEffect(() => {
    if (committedQueryString === lastSelfCommittedQueryString.current) {
      return;
    }
    lastSelfCommittedQueryString.current = committedQueryString;
    setQueryString(committedQueryString);
  }, [committedQueryString]);

  useEffect(() => {
    if (committedFilterString === lastSelfCommittedFilter.current) {
      return;
    }
    lastSelfCommittedFilter.current = committedFilterString;
    setFilterString(committedFilterString);
    if (committedFilterString) {
      safeCelParse(committedFilterString);
    } else {
      setQueryBuilderRuleGroup(undefined);
      setIsValidFilterString(true);
    }
  }, [committedFilterString, safeCelParse]);

  const onUpdateQueryBuilder = (ruleGroup: RuleGroupType | false) => {
    if (ruleGroup === false) {
      setQueryBuilderRuleGroup(undefined);
      setFilterString('');
      setIsValidFilterString(true);
    } else {
      setQueryBuilderRuleGroup({ ...ruleGroup });
      const celQuery = formatQuery({ ...ruleGroup }, { format: 'cel', fallbackExpression: '' });
      // 1 == 1 indicates the query can't be parsed. This is a fallback to allow it to still be used as
      // part of other queries.
      if (!celQuery || celQuery === '1 == 1') {
        setFilterString('');
        setIsValidFilterString(true);
      } else {
        setFilterString(celQuery);
        // formatQuery output is normally valid CEL, but not unconditionally: a rule can
        // hold state formatQuery renders as unparseable CEL (e.g. a 'field' value source
        // renders its value unquoted). Validate the round trip so the invalid marker and
        // the Apply button track what the textarea actually shows.
        setIsValidFilterString(!!parseCelToRuleGroup(celQuery));
      }
    }
  };

  const onUpdateFilterString = (filterString: string) => {
    setFilterString(filterString);
    safeCelParse(filterString);
  };

  const onUpdateDataSorting = ({ field, sortOrder }: WfoDataSorting<T>) => {
    setDataSorting({ field, sortOrder });
    setPageCursor(undefined);
  };

  const onUpdatePageSize = (updatedPageSize: number) => {
    if (updatedPageSize === pageSize) {
      return;
    }
    setPageSize(updatedPageSize);
    setPageCursor(undefined);
  };

  const showNextPage = (nextPageCursor: string | undefined) => {
    if (nextPageCursor) {
      setPageCursor({ cursor: nextPageCursor, searchKey: committedSearchKey });
    }
  };

  // A refused commit hides the search results for as long as the filter draft stays invalid:
  // showing them would suggest the attempted search ran. Editing the draft back to valid CEL
  // (or a later successful commit) lifts the block.
  const isSearchBlocked = isCommitRefused && !isValidFilterString;

  return {
    // The committed search, to build the search payload from
    committedQueryString,
    committedFilterString,
    committedRuleGroup,
    retrieverType,
    dataSorting,
    pageSize,
    cursor,
    isSearchBlocked,
    // Table state and handlers
    queryString,
    filterString,
    queryBuilderRuleGroup,
    isValidFilterString,
    setHiddenColumns,
    hiddenColumns,
    // For the page size stored in the table config, which is not a user change: no cursor reset
    initPageSize: setPageSize,
    onChangeQueryString: setQueryString,
    onSearchQueryString,
    handleApplyFilter,
    onUpdateRetrieverType,
    onUpdateQueryBuilder,
    onUpdateFilterString,
    onUpdateDataSorting,
    onUpdatePageSize,
    showNextPage,
  };
};
