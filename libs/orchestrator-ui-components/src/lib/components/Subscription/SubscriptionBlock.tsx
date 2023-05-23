import React, { FC } from 'react';

import {
    EuiButtonEmpty,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';
import { SubscriptionStatusBadge } from '../Badge/SubscriptionStatusBadge';
import { SubscriptionBlockBase } from '../../types';

// Todo: add render cell functions
export type SubscriptionBlockProps = {
    title: string;
    subscriptionBlock: SubscriptionBlockBase;
};
// Todo: add data type?
export const SubscriptionBlock: FC<SubscriptionBlockProps> = ({
    title,
    subscriptionBlock,
}) => {
    // Todo: investigate -> for some reason I can't just use `keys()`
    const keys = [];
    for (const key in subscriptionBlock) {
        if (typeof subscriptionBlock[key] !== 'object') {
            keys.push(key);
        }
        // if (key == 'product') {
        //     keys.push('product.name');
        // }
    }
    if (keys.length === 0) return;

    console.log('stuffß');
    const renderField = (field: string, data: any) => {
        console.log(field);
        if (field === 'startDate')
            return Date(parseInt(data[field]) * 1000).toLocaleString('nl-NL');
        else if (field === 'status')
            return <SubscriptionStatusBadge subscriptionStatus={data[field]} />;
        else if (field === 'product.name')
            return <div>{data.product.name}</div>;
        return <div>{data[field]}</div>;
    };

    return (
        <>
            <EuiSpacer size={'m'}></EuiSpacer>
            <div>
                <div style={{ marginTop: 5 }}>
                    <EuiFlexGroup justifyContent="spaceBetween">
                        <EuiFlexItem>
                            <EuiText grow={false}>
                                <h3>{title}</h3>
                            </EuiText>
                        </EuiFlexItem>
                        <EuiFlexItem grow={false}>
                            <EuiButtonEmpty size={'s'} iconType={'starEmpty'}>
                                Add to favorites
                            </EuiButtonEmpty>
                        </EuiFlexItem>
                    </EuiFlexGroup>

                    <EuiSpacer size={'s'}></EuiSpacer>
                    <table width="100%">
                        <tr
                            key={0}
                            style={{
                                backgroundColor: '#F1F5F9',
                            }}
                        >
                            {/*<td*/}
                            {/*    valign={'top'}*/}
                            {/*    style={{*/}
                            {/*        width: 350,*/}
                            {/*        padding: 10,*/}
                            {/*        borderTopLeftRadius: 8,*/}
                            {/*        borderBottomLeftRadius: 8,*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    <b>Product</b>*/}
                            {/*</td>*/}
                            {/*<td*/}
                            {/*    style={{*/}
                            {/*        padding: 10,*/}
                            {/*        borderTopRightRadius: 8,*/}
                            {/*        borderBottomRightRadius: 8,*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    {data.product.name}*/}
                            {/*</td>*/}
                        </tr>
                        {keys
                            .filter((k) => k !== 'firewallEnabled')
                            .map((k, i) => (
                                <tr
                                    key={i}
                                    style={{
                                        backgroundColor:
                                            i % 2 ? '#F1F5F9' : '#FFF',
                                    }}
                                >
                                    <td
                                        valign={'top'}
                                        style={{
                                            width: 350,
                                            padding: 10,
                                            borderTopLeftRadius: 8,
                                            borderBottomLeftRadius: 8,
                                        }}
                                    >
                                        <b>{k}</b>
                                    </td>
                                    <td
                                        style={{
                                            padding: 10,
                                            borderTopRightRadius: 8,
                                            borderBottomRightRadius: 8,
                                        }}
                                    >
                                        {renderField(k, subscriptionBlock)}
                                    </td>
                                </tr>
                            ))}
                    </table>
                </div>
            </div>
        </>
    );
};
