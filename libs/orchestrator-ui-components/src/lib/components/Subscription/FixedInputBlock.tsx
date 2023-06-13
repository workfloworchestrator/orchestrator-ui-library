import React from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';
import { RenderField } from './SubscriptionBlock';
import {
    subscriptionDefinitionCellStyle,
    subscriptionValueCellStyle,
} from './styles';

export const FixedInputBlock = (title: string, data: object) => {
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
                                        css={subscriptionDefinitionCellStyle}
                                    >
                                        <b>{k}</b>
                                    </td>
                                    <td css={subscriptionValueCellStyle}>
                                        {RenderField(k, data)}
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
