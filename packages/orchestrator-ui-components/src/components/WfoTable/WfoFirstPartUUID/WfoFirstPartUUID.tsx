import { getFirstUuidPart } from '../../../utils';
import React, { FC } from 'react';

export type WfoFirstUUIDPartProps = {
    UUID: string;
};

export const WfoFirstPartUUID: FC<WfoFirstUUIDPartProps> = ({ UUID }) => (
    <span title={UUID}>{getFirstUuidPart(UUID)}</span>
);
