import React, { FC } from 'react';

import { CustomerDescriptions } from '@/types';

export type WfoCustomerDescriptionsFieldProps = {
    customerDescriptions: CustomerDescriptions[];
};

export const WfoCustomerDescriptionsField: FC<
    WfoCustomerDescriptionsFieldProps
> = ({ customerDescriptions }) => {
    // Todo service call to fetch short codes

    return (
        <>
            {customerDescriptions
                .map(
                    (q) =>
                        `${q.subscriptionId}/${q.description}/${q.customerId}`,
                )
                .join(', ')}
        </>
    );
};
