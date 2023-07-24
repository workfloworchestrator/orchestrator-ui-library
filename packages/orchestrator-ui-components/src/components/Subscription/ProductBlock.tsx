import React from 'react';
import { EuiAccordion, EuiCodeBlock } from '@elastic/eui';

import {
    EuiButtonIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';
import {
    TreeContext,
    TreeContextType,
    SubscriptionContext,
} from '../../contexts';
import { ResourceTypeBase } from '../../types';

export const ProductBlock = (resourceTypes: ResourceTypeBase, id: number) => {
    const { toggleSelectedId } = React.useContext(
        TreeContext,
    ) as TreeContextType;
    const { subscriptionData } = React.useContext(SubscriptionContext);

    const keys = [];
    for (const key in resourceTypes) {
        if (typeof resourceTypes[key] !== 'object') {
            keys.push(key);
        }
    }
    if (keys.length === 0) return;

    const getExternalData = (
        externalServiceId: string | number,
        externalServiceKey: string,
    ) => {
        // Todo #102: Remove or refactor when Federative GraphQL is ready
        if (subscriptionData.externalServices !== undefined) {
            console.log(
                'externalId: ',
                externalServiceId,
                'externalKey: ',
                externalServiceKey,
            );
            const foundObject = subscriptionData.externalServices.find(
                (item) =>
                    item.externalServiceId === externalServiceId.toString() &&
                    item.externalServiceKey === externalServiceKey,
            );
            if (foundObject) {
                return JSON.stringify(
                    foundObject?.externalServiceData,
                    null,
                    2,
                );
            } else {
                return '';
            }
        } else return '';
    };

    return (
        <>
            <EuiSpacer size={'m'}></EuiSpacer>
            <EuiPanel>
                <div style={{ marginTop: 5 }}>
                    <EuiFlexGroup justifyContent="spaceBetween">
                        <EuiFlexItem>
                            <EuiText grow={false}>
                                <h3>
                                    {resourceTypes.title ?? resourceTypes.name}
                                </h3>
                            </EuiText>
                        </EuiFlexItem>
                        <EuiFlexItem grow={false}>
                            <EuiButtonIcon
                                size={'m'}
                                iconType={'cross'}
                                onClick={() => toggleSelectedId(id)}
                            />
                        </EuiFlexItem>
                    </EuiFlexGroup>

                    <EuiSpacer size={'xs'}></EuiSpacer>
                    {
                        <table
                            width="100%"
                            bgcolor={'#F1F5F9'}
                            style={{
                                borderCollapse: 'separate',
                                borderRadius: 8,
                            }}
                        >
                            {keys.map((k, i) =>
                                !k.startsWith('ims_ci') ? (
                                    <tr key={i}>
                                        <td
                                            valign={'top'}
                                            style={{
                                                width: 250,
                                                padding: 10,
                                                borderBottom: `solid ${
                                                    i === keys.length - 1
                                                        ? 0
                                                        : 1
                                                }px #ddd`,
                                            }}
                                        >
                                            <b>{k}</b>
                                        </td>
                                        <td
                                            style={{
                                                padding: 10,
                                                borderBottom: `solid ${
                                                    i === keys.length - 1
                                                        ? 0
                                                        : 1
                                                }px #ddd`,
                                            }}
                                        >
                                            {resourceTypes[k]}
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={i}>
                                        <td
                                            colSpan={3}
                                            style={{
                                                padding: 10,
                                                borderBottom: `solid ${
                                                    i === keys.length - 1
                                                        ? 0
                                                        : 1
                                                }px #ddd`,
                                            }}
                                        >
                                            <EuiAccordion
                                                id={k}
                                                arrowDisplay="left"
                                                buttonContent={
                                                    <div>
                                                        <td
                                                            valign={'top'}
                                                            style={{
                                                                width: 222,
                                                            }}
                                                        >
                                                            <b>{k}</b>
                                                        </td>
                                                        <td>
                                                            {resourceTypes[k]}
                                                        </td>
                                                    </div>
                                                }
                                            >
                                                <EuiPanel color="subdued">
                                                    <EuiCodeBlock
                                                        language="json"
                                                        fontSize="m"
                                                        lineNumbers
                                                        isCopyable
                                                    >
                                                        {getExternalData(
                                                            resourceTypes[
                                                                k
                                                            ] as string,
                                                            'ims', // Todo #102: Federative GraphQL
                                                        )}
                                                    </EuiCodeBlock>
                                                </EuiPanel>
                                            </EuiAccordion>
                                        </td>
                                    </tr>
                                ),
                            )}
                        </table>
                    }
                </div>
            </EuiPanel>
        </>
    );
};
