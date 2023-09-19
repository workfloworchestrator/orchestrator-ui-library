import React, { FC } from 'react';
import {
    parseDateRelativeToToday,
    parseDateToLocaleDateTimeString,
} from '../../utils';

export type WFODateTimeProps = {
    dateOrIsoString: Date | string | null;
};

export const WFODateTime: FC<WFODateTimeProps> = ({ dateOrIsoString }) => {
    const date = getDate(dateOrIsoString);

    return (
        <span title={parseDateToLocaleDateTimeString(date)}>
            {parseDateRelativeToToday(date, true)}
        </span>
    );
};

function getDate(date: Date | string | null) {
    if (typeof date === 'string') {
        return new Date(date);
    }

    return date;
}
