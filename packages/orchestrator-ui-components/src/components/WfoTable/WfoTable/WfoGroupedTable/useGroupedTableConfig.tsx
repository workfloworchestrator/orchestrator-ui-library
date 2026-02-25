import React, { ReactNode, useEffect, useRef, useState } from 'react';

import { getObjectKeys } from '@/utils';

import { ColumnType, WfoTableColumnConfig } from '../WfoTable';
import { WfoExpandableRow } from './WfoExpandableRow';
import { WfoExpandedGroupRow } from './WfoExpandedGroupRow';
import { GroupType, WfoGroupedTableProps } from './WfoGroupedTable';
import { WfoGroupedTableGroupsRef } from './WfoGroupedTableGroups';
import { getTotalNumberOfRows } from './utils';

export type UseGroupedTableConfigProps<T extends object> = Pick<
  WfoGroupedTableProps<T>,
  'columnConfig' | 'data' | 'groupNameLabel'
> & {
  nestingLevel?: number;
  notifyParent?: (meAndAllMySubgroupsAreExpanded: boolean) => void;
};

export const useGroupedTableConfig = <T extends object>({
  data,
  columnConfig,
  groupNameLabel,
  nestingLevel = 0,
  notifyParent,
}: UseGroupedTableConfigProps<T>) => {
  const groupReferences = useRef(new Map<string, WfoGroupedTableGroupsRef>());

  const [expandedRowIds, setExpandedRowIds] = useState<string[]>([]);
  const [isAllGroupsExpanded, setIsAllGroupsExpanded] = useState(false);
  const [isAllSubgroupsExpanded, setIsAllSubgroupsExpanded] = useState<string[]>([]);

  // Expanding all children needs another render cycle, because they do not exist in the DOM yet
  const [isExpanding, setIsExpanding] = useState(false);

  const groups: GroupType[] = getObjectKeys(data).map((key) => ({
    groupName: key.toString(),
  }));
  const numberOfColumnsInnerTable = Object.keys(columnConfig).length;

  const notifyParentRef = useRef(notifyParent);
  const groupsRef = useRef(groups);

  useEffect(() => {
    if (isExpanding) {
      groupReferences.current.forEach((ref) => {
        ref.expandAllRows();
      });
      setIsExpanding(false);
    }
  }, [isExpanding]);

  useEffect(() => {
    if (notifyParentRef.current) {
      notifyParentRef.current(
        isAllGroupsExpanded && groupsRef.current.every(({ groupName }) => isAllSubgroupsExpanded.includes(groupName)),
      );
    }
  }, [isAllSubgroupsExpanded, isAllGroupsExpanded, notifyParentRef, groupsRef]);

  const groupColumnConfig: WfoTableColumnConfig<GroupType> = {
    groupName: {
      columnType: ColumnType.CONTROL,
      label: groupNameLabel,
      width: 'calc(100vw - 300px)', //TODO: #1807
      numberOfColumnsToSpan: numberOfColumnsInnerTable,
      renderControl: ({ groupName }) => {
        const isExpanded = expandedRowIds.includes(groupName);
        const groupData = data[groupName];

        const numberOfRowsInGroup = Array.isArray(groupData) ? groupData.length : getTotalNumberOfRows(groupData);

        return (
          <WfoExpandableRow
            groupName={groupName}
            isExpanded={isExpanded}
            updateExpandedRows={toggleExpandedRow}
            numberOfRowsInGroup={numberOfRowsInGroup}
          />
        );
      },
    },
  };

  const getReferenceCallbackForRow = (groupName: string) => {
    return (ref: WfoGroupedTableGroupsRef | null) => {
      if (ref) {
        groupReferences.current.set(groupName, ref);
      } else if (groupName && groupReferences.current.has(groupName)) {
        groupReferences.current.delete(groupName);
      }
    };
  };

  const uniqueRowIdToExpandedRowMap = expandedRowIds.reduce<Record<string, ReactNode>>((accumulator, groupName) => {
    const groupData = data[groupName];

    accumulator[groupName] = (
      <WfoExpandedGroupRow
        key={groupName}
        ref={getReferenceCallbackForRow(groupName)}
        data={groupData}
        columnConfig={columnConfig}
        groupNameLabel={groupNameLabel}
        nestingLevel={nestingLevel + 1}
        onExpandRowChange={(isAllSubgroupsExpanded) =>
          setIsAllSubgroupsExpanded((prevState) => {
            if (isAllSubgroupsExpanded) {
              return [...prevState, groupName];
            }

            return prevState.filter((id) => id !== groupName);
          })
        }
      />
    );

    return accumulator;
  }, {});

  const toggleExpandedRow = (groupName: string) => {
    const groupData = data[groupName];
    const groupHasData = Array.isArray(groupData) ? groupData.length > 0 : Object.keys(groupData).length > 0;

    if (groupHasData) {
      setExpandedRowIds((prevState) => {
        // Collapse group
        if (prevState.includes(groupName)) {
          setIsAllGroupsExpanded(false);
          return prevState.filter((value) => value !== groupName);
        }

        // Expand group
        if (prevState.length + 1 >= groups.length) {
          setIsAllGroupsExpanded(true);
        }
        if (Array.isArray(groupData)) {
          setIsAllSubgroupsExpanded((prevState) => {
            return [...prevState, groupName];
          });
        }
        return [...prevState, groupName];
      });
    }
  };

  const expandAllRows = () => {
    setExpandedRowIds(() => groups.map(({ groupName }) => groupName));
    setIsExpanding(true);
    setIsAllGroupsExpanded(true);
    setIsAllSubgroupsExpanded(() => groups.map(({ groupName }) => groupName));
  };

  const collapseAllRows = () => {
    setExpandedRowIds([]);
    setIsAllGroupsExpanded(false);
  };

  const isAllGroupsAndSubgroupsExpanded =
    isAllGroupsExpanded && groups.every(({ groupName }) => isAllSubgroupsExpanded.includes(groupName));

  return {
    groups,
    numberOfColumnsInnerTable,
    groupColumnConfig,
    uniqueRowIdToExpandedRowMap,
    isAllGroupsAndSubgroupsExpanded,
    toggleExpandedRow,
    expandAllRows,
    collapseAllRows,
  };
};
