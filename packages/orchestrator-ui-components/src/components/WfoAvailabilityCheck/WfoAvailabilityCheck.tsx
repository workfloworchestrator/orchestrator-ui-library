import React, { FC, ReactNode } from 'react';

import { WfoBackendUnavailable } from '@/components/WfoBackendUnavailable';
import { BackendFeatureStatus } from '@/hooks';

interface WfoAvailabilityCheckProps {
    featureType: 'search' | 'agent';
    availability: BackendFeatureStatus;
    children: ReactNode;
}

export const WfoAvailabilityCheck: FC<WfoAvailabilityCheckProps> = ({
    featureType,
    availability,
    children,
}) => {
    if (!availability.isLoading && !availability.isAvailable) {
        return (
            <WfoBackendUnavailable
                featureType={featureType}
                onRetry={() => window.location.reload()}
            />
        );
    }

    return <>{children}</>;
};
