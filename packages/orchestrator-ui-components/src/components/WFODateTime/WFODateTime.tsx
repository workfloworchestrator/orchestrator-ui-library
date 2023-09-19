import React, { FC } from 'react';
import { parseDateTimeToLocaleString } from '../../utils';

export type WFODateTimeProps = {
    date: Date;
};

// title full date inclusing time: always!
// content time OR date
export const WFODateTime: FC<WFODateTimeProps> = ({ date }) => (
    <span title={parseDateTimeToLocaleString(date)}>
        {parseDateTimeToLocaleString(date)}
    </span>
);
