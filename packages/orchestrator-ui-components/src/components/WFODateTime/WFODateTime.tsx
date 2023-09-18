import React, { FC } from 'react';
import { parseDateRelativeToToday } from '../../utils';

export type WFODateTimeProps = {
    dateTime: string;
};

export const WFODateTime: FC<WFODateTimeProps> = ({ dateTime }) => (
    <span title={dateTime}>{parseDateRelativeToToday(dateTime, true)}</span>
);
