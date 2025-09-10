import { Fragment } from 'react';

import { EuiBadge, EuiFlexGroup, EuiFlexItem, EuiIcon } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

interface WfoPathBreadcrumbProps {
    path: string;
    size?: 's' | 'm';
    maxSegments?: number;
    showArrows?: boolean;
    color?: string;
    stripFirstSegment?: boolean;
}

export const WfoPathBreadcrumb: React.FC<WfoPathBreadcrumbProps> = ({
    path,
    size = 'm',
    maxSegments,
    showArrows = true,
    color,
    stripFirstSegment = false,
}) => {
    const { theme } = useOrchestratorTheme();

    if (!path) {
        return null;
    }

    let segments = path.split('.').filter((segment) => !/^\d+$/.test(segment));

    // Strip the first segment (the entity type)
    if (stripFirstSegment && segments.length > 1) {
        segments = segments.slice(1);
    }

    const displaySegments =
        maxSegments && segments.length > maxSegments
            ? [
                  ...segments.slice(0, maxSegments - 1),
                  '...',
                  segments[segments.length - 1],
              ]
            : segments;

    const badgeColor = color || theme.colors.primary;

    return (
        <EuiFlexGroup
            gutterSize={size}
            alignItems="center"
            wrap={false}
            responsive={false}
        >
            {displaySegments.map((segment, index) => (
                <Fragment key={index}>
                    <EuiFlexItem grow={false}>
                        <EuiBadge color={badgeColor}>{segment}</EuiBadge>
                    </EuiFlexItem>
                    {showArrows && index < displaySegments.length - 1 && (
                        <EuiFlexItem grow={false}>
                            <EuiIcon
                                type="arrowRight"
                                size={size}
                                color={theme.colors.link}
                            />
                        </EuiFlexItem>
                    )}
                </Fragment>
            ))}
        </EuiFlexGroup>
    );
};
