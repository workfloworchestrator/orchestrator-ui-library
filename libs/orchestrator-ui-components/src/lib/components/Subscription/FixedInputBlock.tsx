import React from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';
import { renderField } from './SubscriptionBlock';

// Todo: add data type?
export const FixedInputBlock = (title: string, data: object) => {
    // Todo: investigate -> for some reason I can't just use `keys()`
    const keys = [];
    for (const key in data) {
        keys.push(key);
    }
    if (keys.length === 0) return;

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
                    </EuiFlexGroup>

                    <EuiSpacer size={'s'}></EuiSpacer>
                    <table width="100%">
                        <tbody>
                            {keys.map((k, i) => (
                                <tr
                                    key={i}
                                    style={{
                                        backgroundColor:
                                            i % 2 ? '#FFF' : '#F1F5F9',
                                    }}
                                >
                                    <td
                                        valign={'top'}
                                        style={{
                                            // Todo: share styles with SubscriptionBlock.tsx
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
                                            padding: 0,
                                            borderTopRightRadius: 8,
                                            borderBottomRightRadius: 8,
                                        }}
                                    >
                                        {renderField(k, data)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};
