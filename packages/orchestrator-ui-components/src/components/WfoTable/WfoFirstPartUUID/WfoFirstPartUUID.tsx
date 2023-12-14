import React, { FC } from 'react';

import { useWithOrchestratorTheme } from '@/hooks';

import { getFirstUuidPart } from '../../../utils';
import { getStyles } from './styles';

export type WfoFirstUUIDPartProps = {
    UUID: string;
};

export const WfoFirstPartUUID: FC<WfoFirstUUIDPartProps> = ({ UUID }) => {
    const { uuidFieldStyle } = useWithOrchestratorTheme(getStyles);

    return (
        <span css={uuidFieldStyle} title={UUID}>
            {getFirstUuidPart(UUID)}
        </span>
    );
};
