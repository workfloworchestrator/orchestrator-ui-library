import React, { useState } from 'react';

import { EuiFlexGroup, EuiPanel } from '@elastic/eui';

import { AnySearchResult, SubscriptionMatchingField } from '@/types';

import { WfoSearchEmptyState } from './WfoSearchEmptyState';
import { WfoSearchLoadingState } from './WfoSearchLoadingState';
import { WfoSearchResultItem } from './WfoSearchResultItem';
import { WfoSubscriptionDetailModal } from './WfoSubscriptionDetailModal';

interface WfoSearchResultsProps {
    results: AnySearchResult[];
    loading: boolean;
    selectedRecordIndex?: number;
    onRecordSelect?: (index: number) => void;
}

export const WfoSearchResults = ({
    results,
    loading,
    selectedRecordIndex = 0,
    onRecordSelect,
}: WfoSearchResultsProps) => {
    const [modalData, setModalData] = useState<{
        subscription: {
            subscription_id: string;
            description: string;
            product: {
                name: string;
                description: string;
            };
        };
        matchingField?: SubscriptionMatchingField;
    } | null>(null);

    const handleCloseModal = () => {
        setModalData(null);
    };

    if (loading) {
        return <WfoSearchLoadingState />;
    }

    if (!results || results.length === 0) {
        return <WfoSearchEmptyState />;
    }

    return (
        <>
            <EuiPanel paddingSize="m" hasShadow={false}>
                <EuiFlexGroup direction="column" gutterSize="s">
                    {results.map((result, idx) => (
                        <WfoSearchResultItem
                            key={idx}
                            result={result}
                            index={idx}
                            isSelected={idx === selectedRecordIndex}
                            onSelect={() => onRecordSelect?.(idx)}
                        />
                    ))}
                </EuiFlexGroup>
            </EuiPanel>
            <WfoSubscriptionDetailModal
                isVisible={!!modalData}
                onClose={handleCloseModal}
                subscriptionData={modalData?.subscription}
                matchingField={modalData?.matchingField}
            />
        </>
    );
};
