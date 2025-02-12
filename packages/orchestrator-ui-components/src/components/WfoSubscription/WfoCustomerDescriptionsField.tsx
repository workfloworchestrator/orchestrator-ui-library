import React, { FC } from 'react';

import { useGetCustomerQuery } from '@/rtk';
import { useUpdateCustomerDescriptionMutation } from '@/rtk/endpoints/customerDescriptions';
import { Customer, CustomerDescriptions } from '@/types';

import { WfoInlineEdit } from '../WfoInlineEdit';

type CustomerDescriptionWithName = CustomerDescriptions &
    Partial<Pick<Customer, 'fullname' | 'shortcode'>>;

export type WfoCustomerDescriptionsFieldProps = {
    customerDescriptions: CustomerDescriptions[];
};

export const WfoCustomerDescriptionsField: FC<
    WfoCustomerDescriptionsFieldProps
> = ({ customerDescriptions }) => {
    const [updateCustomerDescription, {}] =
        useUpdateCustomerDescriptionMutation();
    const customerIds = customerDescriptions.map(
        (customerDescription) => customerDescription.customerId,
    );
    const { data } = useGetCustomerQuery({ customerIds });

    if (!data) {
        return null;
    }

    const customerDescriptionsWithName: CustomerDescriptionWithName[] =
        customerDescriptions.map(
            ({ description, customerId, id, subscriptionId }) => {
                const customer = data.find(
                    (customer) => customer.customerId === customerId,
                );

                return {
                    id,
                    customerId,
                    shortcode: customer?.shortcode,
                    fullname: customer?.fullname,
                    description,
                    subscriptionId,
                };
            },
        );

    const triggerModifyDescription = (
        id: string,
        customerId: string,
        subscriptionId: string,
        description: string,
    ) => {
        updateCustomerDescription({
            id: id,
            description: description,
            customerId: customerId,
            subscriptionId: subscriptionId,
        });
    };

    return (
        <>
            {customerDescriptionsWithName.map(
                ({
                    shortcode,
                    fullname,
                    description,
                    customerId,
                    id,
                    subscriptionId,
                }) => (
                    <div key={customerId} css={{ display: 'flex' }}>
                        {fullname ?? customerId}
                        {`${shortcode ?? customerId}`}:
                        <WfoInlineEdit
                            value={description}
                            triggerModify={(value) =>
                                triggerModifyDescription(
                                    id,
                                    customerId,
                                    subscriptionId,
                                    value,
                                )
                            }
                        />
                    </div>
                ),
            )}
        </>
    );
};
