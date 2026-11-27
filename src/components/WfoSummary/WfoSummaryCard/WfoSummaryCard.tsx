import React, { ComponentType, FC, MouseEvent, ReactNode, useContext, useEffect, useId, useState } from 'react';

import { useFormatter, useTranslations } from 'next-intl';
import Link from 'next/link';

import { WfoCheckmarkCircleFill, WfoCubeFill, WfoExclamationTriangle } from '@/icons';
import {
  WfoCollapsiblePanel,
  WfoCollapsibleRoot,
  WfoCollapsibleTrigger,
  WfoIconTile,
  WfoLink,
  WfoList,
  WfoListItem,
  WfoPanel,
  WfoSpinner,
  WfoStatusColor,
  useWfoSortableList,
} from '@/ui';
import { warnDeprecated } from '@/utils/warnDeprecated';

import type { SummaryCardButtonConfig, SummaryCardListItem } from '../types';
import styles from './WfoSummaryCard.module.css';
import { WfoSummaryCardContext } from './WfoSummaryCardContext';

export enum SummaryCardStatus {
  Success = 'Success',
  Error = 'Error',
  Neutral = 'Neutral',
}

export type WfoSummaryCardProps = {
  /** The title. It is a link when `button` is set. At most 2 lines. */
  headerTitle: string;
  /** The amount. A number is formatted for the language, for example 1,234. */
  headerValue: string | number;
  /** Title of the list that opens below the header. */
  listTitle: string;
  /** The items of the list. An item with a `url` is a link. */
  listItems: SummaryCardListItem[];
  /** The color set of the icon tile, by meaning: success green, info blue, warning orange, danger red. Default `info`. */
  color?: WfoStatusColor;
  /** Your own icon in the tile, drawn in `currentColor`. Without it, the icon follows `color`. */
  icon?: ReactNode;
  /** @deprecated Use `color`. `Success` becomes `success`, `Error` becomes `danger`, `Neutral` becomes `info`. */
  headerStatus?: SummaryCardStatus;
  /** @deprecated Use `icon` and `color`. A component in `iconType` becomes the icon; `iconColor` is not used. */
  headerBadge?: { iconType?: string | ComponentType; iconColor?: string };
  /** Makes the title a link to the overview page. Only `url` is used. */
  button?: SummaryCardButtonConfig;
  /** First load: shows '-' and placeholder lines. */
  isLoading?: boolean;
  /** Reload with data on screen: shows a small spinner next to the amount. */
  isFetching?: boolean;
};

const defaultIconByColor = {
  info: WfoCubeFill,
  success: WfoCheckmarkCircleFill,
  warning: WfoExclamationTriangle,
  danger: WfoExclamationTriangle,
} as const;

const colorByDeprecatedStatus: Record<SummaryCardStatus, WfoStatusColor> = {
  [SummaryCardStatus.Success]: 'success',
  [SummaryCardStatus.Error]: 'danger',
  [SummaryCardStatus.Neutral]: 'info',
};

const getDeprecatedBadgeIcon = (headerBadge: WfoSummaryCardProps['headerBadge']) => {
  const BadgeIcon = headerBadge?.iconType;
  return BadgeIcon && typeof BadgeIcon !== 'string' ? <BadgeIcon /> : undefined;
};

/** One summary card: an amount with an icon, and a list that opens below it. Collapsed at first. */
export const WfoSummaryCard: FC<WfoSummaryCardProps> = ({
  headerTitle,
  headerValue,
  listTitle,
  listItems,
  button,
  isLoading = false,
  isFetching = false,
  headerStatus,
  headerBadge,
  // After headerStatus and headerBadge: a default can only use the props above it.
  color = headerStatus ? colorByDeprecatedStatus[headerStatus] : 'info',
  icon = getDeprecatedBadgeIcon(headerBadge),
}) => {
  if (headerStatus) warnDeprecated('WfoSummaryCard prop headerStatus', 'Use color: success, info, warning or danger.');
  if (headerBadge) warnDeprecated('WfoSummaryCard prop headerBadge', 'Use icon and color.');
  const t = useTranslations('startPage.summary');
  const format = useFormatter();
  const cardId = useId();
  const cardContext = useContext(WfoSummaryCardContext);
  const sortableList = useWfoSortableList();
  const [isLocallyExpanded, setIsLocallyExpanded] = useState(false);
  // All cards close while one is dragged, so every slot in the grid has the same height.
  const isExpanded = (cardContext?.isExpanded ?? isLocallyExpanded) && !sortableList?.isDragActive;
  const setExpanded = cardContext?.onExpandedChange ?? setIsLocallyExpanded;
  const onTitleChange = cardContext?.onTitleChange;

  useEffect(() => onTitleChange?.(headerTitle), [onTitleChange, headerTitle]);

  const DefaultIcon = defaultIconByColor[color];

  // Clicking the card toggles it, except on links and buttons inside the header.
  const handleHeaderClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('a,button')) return;
    setExpanded(!isExpanded);
  };

  return (
    <WfoCollapsibleRoot
      open={isExpanded}
      onOpenChange={setExpanded}
      render={<section aria-labelledby={`${cardId}-title`} />}
      data-summary-card-color={color}
    >
      <WfoPanel padding={0}>
        <div className={styles.header} onClick={handleHeaderClick}>
          <WfoIconTile color={color}>{icon ?? <DefaultIcon width={36} height={36} color="currentColor" />}</WfoIconTile>
          <div className={styles.text}>
            <h2 id={`${cardId}-title`} title={headerTitle} className={styles.title}>
              {button ?
                <WfoLink render={<Link href={button.url} />} className={styles.titleText}>
                  {headerTitle}
                </WfoLink>
              : <span className={styles.titleText}>{headerTitle}</span>}
            </h2>
            <div className={styles.valueRow}>
              <span className={styles.value}>
                {isLoading ?
                  '-'
                : typeof headerValue === 'number' ?
                  format.number(headerValue)
                : headerValue}
              </span>
              {isFetching && <WfoSpinner label={t('updating')} />}
            </div>
          </div>
          {/* A fixed name: the trigger itself tells screen readers if it is open (aria-expanded). */}
          <WfoCollapsibleTrigger label={t('summaryDetails', { title: headerTitle })} />
        </div>
        <WfoCollapsiblePanel>
          <WfoList title={listTitle} emptyText={t('empty')} isLoading={isLoading}>
            {listItems.map((listItem, listItemIndex) => (
              <WfoListItem key={`${listItem.url ?? listItem.title}-${listItemIndex}`} description={listItem.value}>
                {listItem.url ?
                  <WfoLink render={<Link href={listItem.url} />}>{listItem.title}</WfoLink>
                : listItem.title}
              </WfoListItem>
            ))}
          </WfoList>
        </WfoCollapsiblePanel>
      </WfoPanel>
    </WfoCollapsibleRoot>
  );
};
