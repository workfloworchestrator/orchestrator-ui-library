import React from 'react';

import {
    EuiButtonIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';
import { TreeContext, TreeContextType } from '../../contexts/TreeContext';
import { SubscriptionContext } from '../../contexts/SubscriptionContext';

// Todo: add data type?
export const ProductBlock = (title: string, data: object, id?: number) => {
    const { toggleSelectedId } = React.useContext(
        TreeContext,
    ) as TreeContextType;

    // Todo: extend this to use the subscription context to show external data.
    //  Bonus / Kudo's for a small rewrite so this component doesn't need the data prop.
    const { subscriptionData, loadingStatus } =
        React.useContext(SubscriptionContext);
    if (loadingStatus === 2) {
        console.log('Yeah external services are loaded');
    }

    // Todo: investigate -> for some reason I can't just use `keys()`
    const keys = [];
    for (const key in data) {
        if (typeof data[key] !== 'object') {
            keys.push(key);
        }
        if (key == 'product') {
            keys.push('product.name');
        }
    }
    if (keys.length === 0) return;

    return (
        <>
            <EuiSpacer size={'m'}></EuiSpacer>
            <EuiPanel>
                <div style={{ marginTop: 5 }}>
                    <EuiFlexGroup justifyContent="spaceBetween">
                        <EuiFlexItem>
                            <EuiText grow={false}>
                                <h3>{title}</h3>
                            </EuiText>
                        </EuiFlexItem>
                        <EuiFlexItem grow={false}>
                            {id && (
                                <EuiButtonIcon
                                    size={'m'}
                                    iconType={'cross'}
                                    onClick={() => toggleSelectedId(id)}
                                />
                            )}
                        </EuiFlexItem>
                    </EuiFlexGroup>

                    <EuiSpacer size={'xs'}></EuiSpacer>
                    <table
                        width="100%"
                        bgcolor={'#F1F5F9'}
                        style={{ borderCollapse: 'separate', borderRadius: 8 }}
                    >
                        {keys.map((k, i) => (
                            <tr key={i}>
                                <td
                                    valign={'top'}
                                    style={{
                                        width: 250,
                                        padding: 10,
                                        borderBottom: `solid ${
                                            i === keys.length - 1 ? 0 : 1
                                        }px #ddd`,
                                    }}
                                >
                                    <b>
                                        {k.includes('.') ? k.split('.')[0] : k}
                                    </b>
                                </td>
                                <td
                                    style={{
                                        padding: 10,
                                        borderBottom: `solid ${
                                            i === keys.length - 1 ? 0 : 1
                                        }px #ddd`,
                                    }}
                                >
                                    {k.includes('.')
                                        ? data[k.split('.')[0]][k.split('.')[1]]
                                        : data[k]}
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>
            </EuiPanel>
        </>
    );
};
