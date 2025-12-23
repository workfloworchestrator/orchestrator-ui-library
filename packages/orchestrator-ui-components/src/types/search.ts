export type EntityKind = 'SUBSCRIPTION' | 'PRODUCT' | 'WORKFLOW' | 'PROCESS';

export type RetrieverType = 'auto' | 'fuzzy' | 'semantic' | 'hybrid';

export interface MatchingField {
    text: string;
    path: string;
    highlight_indices: [number, number][];
}

export interface SearchResult {
    entity_id: string;
    entity_type: EntityKind;
    entity_title: string;
    score: number;
    perfect_match: number;
    matching_field?: MatchingField | null;
}

/** Paginated search results */
export type PaginatedSearchResults = {
    data: SearchResult[];
    page_info: {
        has_next_page: boolean;
        next_page_cursor: number | null;
    };
    search_metadata: {
        search_type: string | null;
        description: string | null;
    };
};

/** ---------- PathFilter & condition types ---------- */

export type DateRange = {
    from: string;
    to: string;
};

export type DateEqFilter = { op: 'eq'; value: string };
export type DateNeqFilter = { op: 'neq'; value: string };
export type DateLtFilter = { op: 'lt'; value: string };
export type DateLteFilter = { op: 'lte'; value: string };
export type DateGtFilter = { op: 'gt'; value: string };
export type DateGteFilter = { op: 'gte'; value: string };
export type DateBetweenFilter = { op: 'between'; value: DateRange };
export type DateIsNullFilter = { op: 'is_null' };
export type DateIsNotNullFilter = { op: 'is_not_null' };

export type StrEqFilter = { op: 'eq'; value: string };
export type StrNeFilter = { op: 'ne'; value: string };

export type LtreeDescendantFilter = { op: 'is_descendant'; value: string };
export type LtreeAncestorFilter = { op: 'is_ancestor'; value: string };
export type LtreeMatchesFilter = { op: 'matches_lquery'; value: string };

export type PathFilter = {
    path: string;
    condition:
        | DateEqFilter
        | DateNeqFilter
        | DateLtFilter
        | DateLteFilter
        | DateGtFilter
        | DateGteFilter
        | DateBetweenFilter
        | DateIsNullFilter
        | DateIsNotNullFilter
        | StrEqFilter
        | StrNeFilter
        | LtreeDescendantFilter
        | LtreeAncestorFilter
        | LtreeMatchesFilter;
};

type ActionType = 'select';

type BaseSearchParameters = {
    query?: string | null;

    filters?: PathFilter[] | Group | null;

    action: ActionType;
};

export type SubscriptionSearchParameters = BaseSearchParameters & {
    entity_type: 'SUBSCRIPTION';
};

export type ProductSearchParameters = BaseSearchParameters & {
    entity_type: 'PRODUCT';
};

export type WorkflowSearchParameters = BaseSearchParameters & {
    entity_type: 'WORKFLOW';
};

export type ProcessSearchParameters = BaseSearchParameters & {
    entity_type: 'PROCESS';
};

export type AnySearchParameters =
    | SubscriptionSearchParameters
    | ProductSearchParameters
    | WorkflowSearchParameters
    | ProcessSearchParameters;

export type Condition = {
    path: string;
    value_kind?: string;
    condition: { op: string; value?: unknown };
};

export type Group = {
    op: 'AND' | 'OR';
    children: Array<Group | Condition>;
};

export type value_schema = {
    kind: 'string' | 'number' | 'datetime' | 'boolean' | 'object' | 'none';
    format?: string;
    fields?: Record<string, value_schema>;
};

export type PathLeaf = {
    name: string;
    ui_types: string[];
    paths?: string[];
};

export type PathAutocompleteResponse = {
    leaves: PathLeaf[];
    components: PathLeaf[];
};

export type PathDataType =
    | 'string'
    | 'number'
    | 'datetime'
    | 'boolean'
    | 'component';

export type PathInfo = {
    path: string;
    type: PathDataType;
    operators: string[];
    value_schema: Record<string, value_schema>;
    example_values?: string[];
    group: 'leaf' | 'component';
    displayLabel?: string;
    ui_types?: string[];
    fullPath?: string;
    availablePaths?: string[];
    pathCount?: number;
};

/** ---------- Agent visualization types ---------- */

export type AggregationResult = {
    group_values: Record<string, string>;
    aggregations: Record<string, number>;
};

export type SearchMetadata = {
    search_type: string;
    description?: string;
};

export enum VisualizationType {
    PIE = 'pie',
    LINE = 'line',
    TABLE = 'table',
}

export type AggregationResultsData = {
    results: AggregationResult[];
    total_groups: number;
    metadata: SearchMetadata;
    visualization_type: {
        type: VisualizationType;
    };
};
