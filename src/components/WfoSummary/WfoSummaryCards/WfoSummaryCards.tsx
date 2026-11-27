import React, { FC, ReactElement, ReactNode, isValidElement, useCallback, useEffect, useMemo, useState } from 'react';

import { useTranslations } from 'next-intl';

import { WfoChevronDown, WfoChevronUp, WfoRefresh } from '@/icons';
import { WfoButton, WfoGrid, WfoSortableItem, WfoSortableList } from '@/ui';
import type { WfoSortableListAnnouncements } from '@/ui';

import { WfoSummaryCardContext } from '../WfoSummaryCard/WfoSummaryCardContext';
import styles from './WfoSummaryCards.module.css';
import { areAllCardsExpanded, normalizeCardOrder, toggleAllCards } from './summaryCardOrder';
import { DEFAULT_SUMMARY_CARDS_STORAGE_KEY, useWfoSummaryCardPreferences } from './useWfoSummaryCardPreferences';

export type WfoSummaryCardsProps = {
  /** `WfoSummaryCard`s. Required: every card has a unique `key`. It identifies the card in the saved order. */
  children: ReactElement | (ReactElement | false | null | undefined)[];
  /** Where the order and the open cards are saved in the browser. Give each `WfoSummaryCards` on a site its own key. */
  storageKey?: string;
};

type SummaryCardSlotProps = {
  cardId: string;
  isExpanded: boolean;
  onExpandedChange: (cardId: string, isExpanded: boolean) => void;
  onTitleChange: (cardId: string, title: string) => void;
  children: ReactNode;
};

/** Gives one card its context. The value only changes when this card changes, so the other cards do not render again. */
const SummaryCardSlot: FC<SummaryCardSlotProps> = ({
  cardId,
  isExpanded,
  onExpandedChange,
  onTitleChange,
  children,
}) => {
  const cardContextValue = useMemo(
    () => ({
      isExpanded,
      onExpandedChange: (isCardExpanded: boolean) => onExpandedChange(cardId, isCardExpanded),
      onTitleChange: (title: string) => onTitleChange(cardId, title),
    }),
    [cardId, isExpanded, onExpandedChange, onTitleChange],
  );
  return <WfoSummaryCardContext.Provider value={cardContextValue}>{children}</WfoSummaryCardContext.Provider>;
};

/** The summary cards in a sortable masonry grid. The order and the open cards are saved in the browser. */
export const WfoSummaryCards: FC<WfoSummaryCardsProps> = ({
  children,
  storageKey = DEFAULT_SUMMARY_CARDS_STORAGE_KEY,
}) => {
  const t = useTranslations('startPage.summary');
  const { preferences, updatePreferences } = useWfoSummaryCardPreferences(storageKey);
  // Each card reports its title. The cards are often wrappers, so the title is not in their props.
  const [cardTitles, setCardTitles] = useState<Record<string, string>>({});

  // Not Children.toArray: it rewrites the keys, and the keys are the ids in the saved order.
  const cards = [children].flat().filter(isValidElement);
  const cardsById = new Map(cards.map((card) => [String(card.key), card]));
  const hasUniqueCardKeys = cards.every((card) => card.key !== null) && cardsById.size === cards.length;

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && !hasUniqueCardKeys) {
      console.error(
        '[@orchestrator-ui/orchestrator-ui-components] WfoSummaryCards: give every card a unique `key`, for example <WfoSummaryCard key="failedTasks" />. Without it, moving and opening cards does not work.',
      );
    }
  }, [hasUniqueCardKeys]);

  const defaultCardOrder = [...cardsById.keys()];
  const cardOrder = normalizeCardOrder(preferences.order, defaultCardOrder);
  const isEveryCardExpanded = areAllCardsExpanded(defaultCardOrder, preferences.expanded);
  const getCardTitle = (cardId: string) => cardTitles[cardId] ?? '';

  const handleTitleChange = useCallback(
    (cardId: string, title: string) =>
      setCardTitles((currentCardTitles) =>
        currentCardTitles[cardId] === title ? currentCardTitles : { ...currentCardTitles, [cardId]: title },
      ),
    [],
  );

  const handleExpandedChange = useCallback(
    (cardId: string, isExpanded: boolean) =>
      updatePreferences((currentPreferences) => ({
        ...currentPreferences,
        expanded:
          isExpanded ?
            [...new Set([...currentPreferences.expanded, cardId])]
          : currentPreferences.expanded.filter((expandedCardId) => expandedCardId !== cardId),
      })),
    [updatePreferences],
  );

  const handleReorder = (reorderedCardIds: string[]) =>
    updatePreferences((currentPreferences) => ({ ...currentPreferences, order: reorderedCardIds }));

  const handleToggleAll = () =>
    updatePreferences((currentPreferences) => ({
      ...currentPreferences,
      expanded: toggleAllCards(defaultCardOrder, currentPreferences.expanded),
    }));

  const handleResetLayout = () => updatePreferences((currentPreferences) => ({ ...currentPreferences, order: [] }));

  const reorderAnnouncements: WfoSortableListAnnouncements = {
    onPickUp: (cardId) => t('reorderPickedUp', { title: getCardTitle(cardId) }),
    onMoveOver: (cardId, overCardId) =>
      t('reorderMovedOver', { title: getCardTitle(cardId), overTitle: getCardTitle(overCardId) }),
    onDrop: (cardId, overCardId) =>
      t('reorderDropped', { title: getCardTitle(cardId), overTitle: getCardTitle(overCardId) }),
    onCancel: (cardId) => t('reorderCancelled', { title: getCardTitle(cardId) }),
  };

  return (
    <>
      <div className={styles.toolbar}>
        <WfoButton
          variant="ghost"
          size="small"
          disabled={defaultCardOrder.length === 0}
          onClick={handleToggleAll}
          icon={
            isEveryCardExpanded ?
              <WfoChevronUp width={16} height={16} color="currentColor" />
            : <WfoChevronDown width={16} height={16} color="currentColor" />
          }
        >
          {t(isEveryCardExpanded ? 'collapseAll' : 'expandAll')}
        </WfoButton>
        <WfoButton
          variant="ghost"
          size="small"
          onClick={handleResetLayout}
          icon={<WfoRefresh width={16} height={16} color="currentColor" />}
        >
          {t('resetLayout')}
        </WfoButton>
      </div>
      <WfoSortableList
        itemIds={cardOrder}
        onReorder={handleReorder}
        renderOverlay={(cardId) => cardsById.get(cardId)}
        instructions={t('reorderInstructions')}
        announcements={reorderAnnouncements}
      >
        <WfoGrid layout="masonry" maxColumns={3}>
          {cardOrder.map((cardId) => (
            <WfoSortableItem
              key={cardId}
              id={cardId}
              handleLabel={t('reorderCard', { title: getCardTitle(cardId) })}
              handlePlacement="edge"
              className={styles.card}
            >
              <SummaryCardSlot
                cardId={cardId}
                isExpanded={preferences.expanded.includes(cardId)}
                onExpandedChange={handleExpandedChange}
                onTitleChange={handleTitleChange}
              >
                {cardsById.get(cardId)}
              </SummaryCardSlot>
            </WfoSortableItem>
          ))}
        </WfoGrid>
      </WfoSortableList>
    </>
  );
};
