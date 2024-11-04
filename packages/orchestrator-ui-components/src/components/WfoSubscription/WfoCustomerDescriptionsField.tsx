import React, { FC } from 'react';

import { useGetCustomerQuery } from '@/rtk';
import { Customer, CustomerDescriptions } from '@/types';

type CustomerDescriptionWithName = Pick<
    CustomerDescriptions,
    'description' | 'customerId'
> &
    Partial<Pick<Customer, 'fullname' | 'shortcode'>>;

export type WfoCustomerDescriptionsFieldProps = {
    customerDescriptions: CustomerDescriptions[];
};

export const WfoCustomerDescriptionsField: FC<
    WfoCustomerDescriptionsFieldProps
> = ({ customerDescriptions }) => {
    const customerIds = customerDescriptions.map(
        (customerDescription) => customerDescription.customerId,
    );
    const { data } = useGetCustomerQuery({ customerIds });

    if (!data) {
        return null;
    }

    const customerDescriptionsWithName: CustomerDescriptionWithName[] =
        customerDescriptions.map(({ description, customerId }) => {
            const customer = data.find(
                (customer) => customer.customerId === customerId,
            );

            return {
                customerId,
                shortcode: customer?.shortcode,
                fullname: customer?.fullname,
                description,
            };
        });

    return (
        <div>
            {customerDescriptionsWithName.map(
                ({ shortcode, fullname, description, customerId }) => (
                    <div key={customerId} title={fullname ?? customerId}>{`${
                        shortcode ?? customerId
                    }: ${description}`}</div>
                ),
            )}
        </div>
    );
};
