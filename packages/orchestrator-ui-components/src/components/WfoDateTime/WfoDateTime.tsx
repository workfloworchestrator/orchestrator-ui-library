import React, { FC } from 'react';

import {
    getDate,
    parseDateOrTimeRelativeToToday,
    parseDateToLocaleDateTimeString,
} from '@/utils';

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
