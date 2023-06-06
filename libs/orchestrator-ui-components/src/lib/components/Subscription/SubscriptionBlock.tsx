import React from 'react';

import {
    EuiButtonEmpty,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';
import { CheckmarkCircleFill, MinusCircleOutline } from '../../icons';
import { useOrchestratorTheme } from '../../hooks';
import { SubscriptionStatusBadge } from '../Badges';

// Todo: add render cell functions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RenderField = (field: string, data: any) => {
    const { theme } = useOrchestratorTheme();
    if (['startDate', 'endDate'].includes(field)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return Date(parseInt(data[field]) * 1000).toLocaleString('nl-NL');
    } else if (field === 'status')
        return <SubscriptionStatusBadge subscriptionStatus={data[field]} />;
    else if (field === 'insync')
        return (
            <div style={{ position: 'relative', top: 5 }}>
                {data[field] ? (
                    <CheckmarkCircleFill color={theme.colors.primary} />
                ) : (
                    <MinusCircleOutline color={theme.colors.mediumShade} />
                )}
            </div>
        );
    else if (field === 'product.name') return <div>{data.product.name}</div>;
    return <div>{data[field]}</div>;
};

// Todo: add data type?
export const SubscriptionBlock = (title: string, data: object, id?: number) => {
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
                            <tr
                                key={0}
                                style={{
                                    backgroundColor: '#F1F5F9',
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
                                    <b>Product</b>
                                </td>
                                <td
                                    style={{
                                        padding: 0,
                                        borderTopRightRadius: 8,
                                        borderBottomRightRadius: 8,
                                    }}
                                >
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
                                            padding: 0,
                                            borderTopRightRadius: 8,
                                            borderBottomRightRadius: 8,
                                        }}
                                    >
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
