import { FC, MouseEvent, useEffect, useRef } from 'react';

import {
    EuiBadge,
    EuiButtonIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';
import { AnySearchResult } from '@/types';

import { getDescription, getDetailUrl } from '../utils';
import { WfoHighlightedText } from './WfoHighlightedText';
import { WfoPathBreadcrumb } from './WfoPathBreadcrumb';

interface WfoSearchResultItemProps {
    result: AnySearchResult;
    index: number;
    isSelected?: boolean;
    onSelect?: () => void;
    onPositionChange?: (index: number, element: HTMLElement | null) => void;
}

export const WfoSearchResultItem: FC<WfoSearchResultItemProps> = ({
    result,
    isSelected = false,
    onSelect,
    onPositionChange,
    index,
}) => {
    const matchingField = result.matching_field;
    const { theme } = useOrchestratorTheme();
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const detailUrl = getDetailUrl(result, baseUrl);
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isSelected && onPositionChange && itemRef.current) {
            onPositionChange(index, itemRef.current);
        }
    }, [isSelected, index, onPositionChange]);

    return (
        <EuiFlexItem>
            <EuiPanel
                panelRef={itemRef}
                color={isSelected ? 'primary' : 'transparent'}
                paddingSize="m"
                data-record-index={index}
                onClick={() => {
                    onSelect?.();
                }}
                style={
                    isSelected
                        ? {
                              borderTop: theme.border.thick,
                              borderBottom: theme.border.thick,
                              borderLeft: 'none',
                              borderRight: 'none',
                              borderColor: theme.colors.primary,
                          }
                        : undefined
                }
            >
                <EuiFlexGroup alignItems="flexStart" gutterSize="m">
                    <EuiFlexItem>
                        <EuiFlexGroup direction="column" gutterSize="xs">
                            <EuiFlexItem>
                                <EuiText
                                    size="m"
                                    style={{
                                        fontWeight: 600,
                                    }}
                                >
                                    {getDescription(result)}
                                </EuiText>
                            </EuiFlexItem>
                            {matchingField && (
                                <>
                                    {matchingField.path && (
                                        <EuiFlexItem>
                                            <WfoPathBreadcrumb
                                                path={matchingField.path}
                                                size="s"
                                                maxSegments={4}
                                                color={theme.colors.primary}
                                            />
                                        </EuiFlexItem>
                                    )}
                                    <EuiFlexItem>
                                        <EuiText
                                            style={{
                                                backgroundColor: 'transparent',
                                                borderRadius:
                                                    theme.border.radius.medium,
                                                fontSize: theme.size.base,
                                            }}
                                        >
                                            <WfoHighlightedText
                                                text={matchingField.text}
                                                highlight_indices={
                                                    matchingField.highlight_indices
                                                }
                                            />
                                        </EuiText>
                                    </EuiFlexItem>

                                    <EuiSpacer size="xs" />
                                </>
                            )}
                        </EuiFlexGroup>
                    </EuiFlexItem>

                    <EuiFlexItem grow={false}>
                        <EuiFlexGroup
                            direction="column"
                            alignItems="flexEnd"
                            gutterSize="xs"
                        >
                            <EuiFlexItem>
                                <EuiBadge color={theme.colors.primary}>
                                    {'score' in result && result.score
                                        ? result.score.toFixed(4)
                                        : 'N/A'}
                                </EuiBadge>
                            </EuiFlexItem>
                            <EuiFlexItem>
                                <EuiButtonIcon
                                    iconType="popout"
                                    aria-label="View details"
                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                        e.stopPropagation();
                                        window.open(detailUrl, '_blank');
                                    }}
                                    color="text"
                                    size="m"
                                />
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    </EuiFlexItem>
                </EuiFlexGroup>
            </EuiPanel>
        </EuiFlexItem>
    );
};
