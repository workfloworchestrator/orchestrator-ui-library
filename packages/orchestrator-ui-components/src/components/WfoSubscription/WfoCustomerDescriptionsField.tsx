import React, { FC } from 'react';

import { useOrchestratorTheme } from '@/hooks';
import { useGetCustomerQuery } from '@/rtk';
import {
    useSetCustomerDescriptionMutation,
    useUpdateCustomerDescriptionMutation,
} from '@/rtk/endpoints/customerDescriptions';
import { Customer, CustomerDescriptions, SubscriptionDetail } from '@/types';
import { INVISIBLE_CHARACTER } from '@/utils';

import { WfoInlineEdit } from '../WfoInlineEdit';

type CustomerDescriptionWithName = CustomerDescriptions &
    Partial<Pick<Customer, 'fullname' | 'shortcode'>>;

export type WfoCustomerDescriptionsFieldProps = {
    customerDescriptions: CustomerDescriptions[];
    subscriptionCustomerId: SubscriptionDetail['customerId'];
    subscriptionId: SubscriptionDetail['subscriptionId'];
};

export const WfoCustomerDescriptionsField: FC<
    WfoCustomerDescriptionsFieldProps
> = ({ customerDescriptions, subscriptionCustomerId, subscriptionId }) => {
    const { theme } = useOrchestratorTheme();
    const [updateCustomerDescription, {}] =
        useUpdateCustomerDescriptionMutation();
    const [setCustomerDescription, {}] = useSetCustomerDescriptionMutation();
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

    const customerDescriptionEditForm = ({
        customerId,
        fullname,
        shortcode,
        description,
        id,
        subscriptionId,
    }: CustomerDescriptionWithName) => (
        <div key={customerId} css={{ display: 'flex' }}>
            <div
                css={{
                    whiteSpace: 'nowrap',
                    alignSelf: 'center',
                    marginRight: theme.base / 2,
                }}
            >
                {fullname ?? customerId} {`${shortcode ?? customerId}`}:
            </div>
            <WfoInlineEdit
                value={description}
                triggerModify={(value) =>
                    updateCustomerDescription({
                        id: id,
                        description: value,
                        customerId: customerId,
                        subscriptionId: subscriptionId,
                    })
                }
            />
        </div>
    );

    const customerDescriptionCreateForm = () => {
        if (!subscriptionCustomerId) return;
        return (
            <div key={subscriptionCustomerId}>
                <WfoInlineEdit
                    value={INVISIBLE_CHARACTER}
                    onlyShowOnHover={true}
                    triggerModify={(value) =>
                        setCustomerDescription({
                            customerId: subscriptionCustomerId,
                            subscriptionId: subscriptionId,
                            description: value,
                        })
                    }
                />
            </div>
        );
    };

    const currentCustomerSubscriptionDescription =
        customerDescriptionsWithName.find(
            ({ customerId }) => customerId === subscriptionCustomerId,
        );

    return (
        <div
            css={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
            }}
        >
            {(currentCustomerSubscriptionDescription &&
                customerDescriptionEditForm(
                    currentCustomerSubscriptionDescription,
                )) ||
                customerDescriptionCreateForm()}
            {customerDescriptionsWithName
                .filter(
                    ({ customerId }) => customerId !== subscriptionCustomerId,
                )
                .map((customerDescriptionWithName) =>
                    customerDescriptionEditForm(customerDescriptionWithName),
                )}
        </div>
    );
};
