import React from 'react';

import { EuiSpacer, EuiText } from '@elastic/eui';

import { WfoBadge } from '@/components/WfoBadges';
import { WfoPathBreadcrumb } from '@/components/WfoSearchPage/WfoSearchResults/WfoPathBreadcrumb';

interface DiscoverFilterPathsResult {
    status?: string;
    leaves?: Array<{
        paths?: string[];
        name?: string;
    }>;
}

type DiscoverFilterPathsDisplayProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result?: any;
    parameters: {
        field_names?: string[];
        entity_type?: string;
    };
};

export const DiscoverFilterPathsDisplay = ({
    parameters,
    result,
}: DiscoverFilterPathsDisplayProps) => {
    const { field_names = [] } = parameters;

    const foundFields: [string, DiscoverFilterPathsResult][] = result
        ? Object.entries(
              result as Record<string, DiscoverFilterPathsResult>,
          ).filter(([, fieldResult]) => fieldResult.status !== 'NOT_FOUND')
        : [];

    // Count total paths across all found fields
    const totalPaths = foundFields.reduce((count, [, fieldResult]) => {
        const pathCount =
            fieldResult.leaves?.reduce((leafCount: number, leaf) => {
                return leafCount + (leaf.paths?.length || 1);
            }, 0) || 0;
        return count + pathCount;
    }, 0);

    return (
        <div>
            {field_names.length > 0 && (
                <>
                    <EuiText size="xs" color="subdued">
                        Looking for{' '}
                        {field_names.map((name, idx) => (
                            <React.Fragment key={name}>
                                {idx > 0 && ', '}
                                <WfoBadge color="hollow" textColor="default">
                                    {name}
                                </WfoBadge>
                            </React.Fragment>
                        ))}
                    </EuiText>
                    <EuiSpacer size="s" />
                </>
            )}

            {result && totalPaths > 0 && (
                <div>
                    <EuiText size="xs" color="subdued">
                        <strong>
                            Found {totalPaths} path
                            {totalPaths > 1 ? 's' : ''}:
                        </strong>
                    </EuiText>
                    <EuiSpacer size="xs" />
                    {foundFields.map(([fieldName, fieldResult]) => (
                        <div key={fieldName} style={{ marginBottom: '8px' }}>
                            {fieldResult.leaves &&
                                fieldResult.leaves.length > 0 &&
                                fieldResult.leaves.map(
                                    (leaf, leafIdx: number) => {
                                        const paths =
                                            leaf.paths ||
                                            (leaf.name ? [leaf.name] : []);
                                        return (
                                            <React.Fragment key={leafIdx}>
                                                {paths.map(
                                                    (
                                                        path: string,
                                                        pathIdx: number,
                                                    ) => (
                                                        <div
                                                            key={pathIdx}
                                                            style={{
                                                                marginBottom:
                                                                    '4px',
                                                            }}
                                                        >
                                                            <WfoPathBreadcrumb
                                                                path={path}
                                                                size="s"
                                                            />
                                                        </div>
                                                    ),
                                                )}
                                            </React.Fragment>
                                        );
                                    },
                                )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
