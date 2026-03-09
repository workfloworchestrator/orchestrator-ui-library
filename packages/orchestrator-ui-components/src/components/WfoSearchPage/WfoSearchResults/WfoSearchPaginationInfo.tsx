import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui';

import { WfoBadge } from '@/components/WfoBadges';
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

export const WfoSearchPaginationInfo: FC<WfoSearchPaginationInfoProps> = ({
  has_next_page,
  next_page_cursor,
  onNextPage,
  onPrevPage,
  isLoading = false,
  currentPage = 1,
  hasPrevPage = false,
  resultCount,
}) => {
  const t = useTranslations('search.page');
  const { theme } = useOrchestratorTheme();

  const handleNextPage = () => {
    if (!isLoading && next_page_cursor && onNextPage) onNextPage(next_page_cursor);
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
      aria-label={t('searchResultsPagination')}
    >
      <EuiFlexItem grow={false}>
        <EuiButtonIcon
          iconType="arrowLeft"
          aria-label={t('previousPage')}
          onClick={handlePrevPage}
          disabled={!hasPrevPage || isLoading}
          color="text"
          size="s"
        />
      </EuiFlexItem>

      <EuiFlexItem grow={false}>
        <EuiText size="xs" color={theme.colors.textSubdued}>
          {t('page')} {currentPage}
        </EuiText>
      </EuiFlexItem>

      <EuiFlexItem grow={false}>
        <EuiButtonIcon
          iconType="arrowRight"
          aria-label={t('nextPage')}
          onClick={handleNextPage}
          disabled={!has_next_page || isLoading}
          color="text"
          size="s"
          isLoading={isLoading}
        />
      </EuiFlexItem>

      {resultCount && resultCount > 0 && (
        <EuiFlexItem grow={false}>
          <WfoBadge className="wfoPagination__badge" color="hollow" textColor="default">
            {t('resultsOnPage', { resultCount })}
          </WfoBadge>
        </EuiFlexItem>
      )}
    </EuiFlexGroup>
  );
};
