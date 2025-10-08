import React, { FC } from 'react';
import { ReactNode } from 'react';

import { WfoPageUnauthorized } from '@/components/WfoAuth/WfoPageUnauthorized';
import { usePolicy } from '@/hooks';

export type WfoPolicyRenderFallbackProps = {
    resource?: string;
    children: ReactNode;
};

export const WfoPolicyRenderPageFallback: FC<WfoPolicyRenderFallbackProps> = ({
    resource,
    children,
}) => {
    const { isAllowed } = usePolicy();

    return isAllowed(resource) ? <>{children}</> : <WfoPageUnauthorized />;
};
