import { getFirstUuidPart } from '../../../utils';
import React, { FC } from 'react';

export type WFOFirstUUIDPartProps = {
    UUID: string;
};

export const WFOFirstPartUUID: FC<WFOFirstUUIDPartProps> = ({ UUID }) => (
    <span title={UUID}>{getFirstUuidPart(UUID)}</span>
);
