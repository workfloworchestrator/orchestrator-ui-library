import React from 'react';

import {
    EuiButtonEmpty,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';
import { CheckmarkCircleFill, MinusCircleOutline } from '../../icons';
import { WFOStatusBadge } from '../Badges';
import {
    subscriptionDefinitionCellStyle,
    subscriptionTableRowStyle,
    subscriptionValueCellStyle,
} from './styles';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RenderField = (field: string, data: any) => {
    if (field === 'status') return <WFOStatusBadge status={data[field]} />;
    else if (field === 'insync')
        return (
            <div style={{ position: 'relative', top: 5 }}>
                {data[field] ? (
                    <CheckmarkCircleFill color="#007832" />
                ) : (
                    <MinusCircleOutline color="#BD271F" />
                )}
            </div>
        );
    else if (field === 'product.name') return <div>{data.product.name}</div>;
    return <div>{data[field]}</div>;
};

export const SubscriptionBlock = (title: string, data: object) => {
    const keys = [];
    for (const key in data) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (typeof data[key] !== 'object') {
            keys.push(key);
        }
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
                        <EuiFlexItem grow={false}>
                            <EuiButtonEmpty size={'s'} iconType={'starEmpty'}>
                                Add to favorites
                            </EuiButtonEmpty>
                        </EuiFlexItem>
                    </EuiFlexGroup>

                    <EuiSpacer size={'s'}></EuiSpacer>
                    <table width="100%">
                        <tbody>
                            <tr key={0} css={subscriptionTableRowStyle}>
                                <td
                                    valign={'top'}
                                    css={subscriptionDefinitionCellStyle}
                                >
                                    <b>Product</b>
                                </td>
                                <td css={subscriptionValueCellStyle}>
                                    {/*
                                    @typescript-eslint/ban-ts-comment
                                    @ts-ignore */}
                                    {data.product.name}
                                </td>
                            </tr>
                            {keys.map((k, i) => (
                                <tr
                                    key={i}
                                    style={{
                                        backgroundColor:
                                            i % 2 ? '#F1F5F9' : '#FFF',
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
