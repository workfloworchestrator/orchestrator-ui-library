import React, { FC } from 'react';
import {
    parseDateRelativeToToday,
    parseDateTimeToLocaleString,
} from '../../utils';

export type WFODateTimeProps = {
    date: Date | null;
};

export const WFODateTime: FC<WFODateTimeProps> = ({ date }) => (
    <span title={parseDateTimeToLocaleString(date)}>
        {parseDateRelativeToToday(date, true)}
    </span>
);
