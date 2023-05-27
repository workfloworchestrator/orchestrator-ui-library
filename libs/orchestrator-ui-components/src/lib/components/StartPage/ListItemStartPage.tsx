import React, { FC, useState } from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiTextColor } from '@elastic/eui';
import moment from 'moment';
import { Process, ProductBase } from '../../types';

interface Subscription {
    name: string;
    subscription_id: string;
    description: string;
    product: ProductBase;
    product_id: string;
    status: string;
    insync: boolean;
    customer_id: string;
    start_date: number;
    end_date: number;
    note: string;
}

export interface ListItemStartPageProps {
    item: Subscription | Process;
    type: string;
}

export const ListItemStartPage: FC<ListItemStartPageProps> = ({
    item,
    type,
}) => {
    const [hoverState, setHoverState] = useState(false);
    const renderItem = (item: Subscription | Process, type: string) => {
        if (type === 'subscription') {
            item = item as Subscription;
            return (
                <EuiFlexItem>
                    <EuiTextColor
                        color={hoverState ? '#397dc2' : 'black'}
                        style={{ fontWeight: 500, transition: '0.2s' }}
                    >
                        {item.product.name}
                    </EuiTextColor>
                    <EuiTextColor style={{ fontWeight: 400 }}>
                        {item.subscription_id.slice(0, 8)}
                    </EuiTextColor>
                </EuiFlexItem>
            );
        } else if (type === 'process') {
            item = item as Process;
            const date = new Date(item.last_modified_at * 1000);
            const formattedDate = moment(date).format('DD-MM-YYYY, HH:mm');
            return (
                <EuiFlexItem>
                    <EuiTextColor
                        color={hoverState ? '#397dc2' : 'black'}
                        style={{ fontWeight: 500, transition: '0.2s' }}
                    >
                        {item.workflow}
                    </EuiTextColor>
                    <EuiTextColor style={{ fontWeight: 400 }}>
                        {formattedDate} for{' '}
                        <span style={{ color: '#397dc2' }}>KLM</span>
                    </EuiTextColor>
                </EuiFlexItem>
            );
        }
    };

    return (
        <a
            href={`/subscriptions/${
                'subscription_id' in item ? item.subscription_id : ''
            }`}
        >
            <EuiFlexGroup
                style={{ cursor: 'pointer', paddingBlock: 10 }}
                onMouseOver={() => setHoverState(true)}
                onMouseLeave={() => setHoverState(false)}
            >
                {renderItem(item, type)}
                <EuiFlexItem
                    grow={false}
                    style={{ display: hoverState ? 'block' : 'none' }}
                >
                    <EuiIcon type="sortRight" color="primary" />
                </EuiFlexItem>
            </EuiFlexGroup>
        </a>
    );
};
export default ListItemStartPage;
