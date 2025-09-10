import {
    EuiBadge,
    EuiButtonIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiText,
} from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

interface WfoSearchPaginationInfoProps {
    has_next_page: boolean;
    next_page_cursor: number | null;
    onNextPage?: (nextPageCursor: number) => void;
    onPrevPage?: () => void;
    isLoading?: boolean;
    currentPage?: number;
    hasPrevPage?: boolean;
    resultCount?: number;
}

export const WfoSearchPaginationInfo: React.FC<
    WfoSearchPaginationInfoProps
> = ({
    has_next_page,
    next_page_cursor,
    onNextPage,
    onPrevPage,
    isLoading = false,
    currentPage = 1,
    hasPrevPage = false,
    resultCount,
}) => {
    const { theme } = useOrchestratorTheme();

    const handleNextPage = () => {
        if (!isLoading && next_page_cursor && onNextPage)
            onNextPage(next_page_cursor);
    };

    const handlePrevPage = () => {
        if (!isLoading && onPrevPage) onPrevPage();
    };

    if (!has_next_page && !hasPrevPage) return null;

    return (
        <EuiFlexGroup
            justifyContent="flexEnd"
            alignItems="center"
            gutterSize="xs"
            responsive={false}
            style={{
                whiteSpace: 'nowrap',
                padding: 0,
                background: 'transparent',
                border: 'none',
            }}
            role="navigation"
            aria-label="Search results pagination"
        >
            <EuiFlexItem grow={false}>
                <EuiButtonIcon
                    iconType="arrowLeft"
                    aria-label="Previous page"
                    onClick={handlePrevPage}
                    disabled={!hasPrevPage || isLoading}
                    color="text"
                    size="s"
                />
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
                <EuiText size="xs" color={theme.colors.textSubdued}>
                    Page {currentPage}
                </EuiText>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
                <EuiButtonIcon
                    iconType="arrowRight"
                    aria-label="Next page"
                    onClick={handleNextPage}
                    disabled={!has_next_page || isLoading}
                    color="text"
                    size="s"
                    isLoading={isLoading}
                />
            </EuiFlexItem>

            {resultCount && resultCount > 0 && (
                <EuiFlexItem grow={false}>
                    <EuiBadge className="wfoPagination__badge" color="hollow">
                        {resultCount} result{resultCount !== 1 ? 's' : ''} on
                        this page
                    </EuiBadge>
                </EuiFlexItem>
            )}
        </EuiFlexGroup>
    );
};
