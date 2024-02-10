import React, { FC, ReactNode } from 'react';

import { usePolicy } from '@/contexts';

export type WfoIsAllowedToRenderProps = {
    resource: string;
    children: ReactNode;
};

export const WfoIsAllowedToRender: FC<WfoIsAllowedToRenderProps> = ({
    resource,
    children,
}) => {
    const { isAllowed } = usePolicy();

    return isAllowed(resource) ? <>{children}</> : null;
};
