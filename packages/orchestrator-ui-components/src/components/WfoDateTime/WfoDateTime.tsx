import React, { FC } from 'react';

import {
    parseDateOrTimeRelativeToToday,
    parseDateToLocaleDateTimeString,
} from '../../utils';

export type WfoDateTimeProps = {
    dateOrIsoString: Date | string | null;
};

export const WfoDateTime: FC<WfoDateTimeProps> = ({ dateOrIsoString }) => {
    const date = getDate(dateOrIsoString);

    return (
        <span title={parseDateToLocaleDateTimeString(date)}>
            {parseDateOrTimeRelativeToToday(date)}
        </span>
    );
};

function getDate(date: Date | string | null) {
    if (typeof date === 'string') {
        return new Date(date);
    }

    return date;
}
