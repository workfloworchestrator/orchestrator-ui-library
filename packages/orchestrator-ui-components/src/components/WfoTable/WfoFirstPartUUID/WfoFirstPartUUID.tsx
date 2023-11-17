import React, { FC } from 'react';

import { getFirstUuidPart } from '../../../utils';

export type WfoFirstUUIDPartProps = {
    UUID: string;
};

export const WfoFirstPartUUID: FC<WfoFirstUUIDPartProps> = ({ UUID }) => (
    <span title={UUID}>{getFirstUuidPart(UUID)}</span>
);
