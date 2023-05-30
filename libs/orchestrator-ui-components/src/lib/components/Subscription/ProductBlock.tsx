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
import { TreeContext, TreeContextType } from '../../contexts/TreeContext';
import { SubscriptionContext } from '../../contexts/SubscriptionContext';
import { externalServiceField } from '../../types';

// this is for testing purposes here
//  tried to make it generic by mapping the externalService key to the one in table
const externalServicesFields: externalServiceField[] = [
    {
        externalServiceKey: 'ims',
        dataKey: 'ims_circuit_id',
    },
];

// Todo: add data type?
export const ProductBlock = (title: string, data: object, id?: number) => {
    const { toggleSelectedId } = React.useContext(
        TreeContext,
    ) as TreeContextType;

    // Todo: rewrite this to use the subscription context, tiwthout relying on "data" prop
    const { subscriptionData } = React.useContext(SubscriptionContext);

    // Todo: investigate -> for some reason I can't just use `keys()`
    const keys = [];
    for (const key in data) {
        if (typeof data[key] !== 'object') {
            keys.push(key);
        }
    }
    if (keys.length === 0) return;

    const getExternalData = (
        externalServiceId: string,
        externalServiceKey: string,
    ) => {
        if (subscriptionData.externalServices) {
            const foundObject = subscriptionData.externalServices.find(
                (item) =>
                    item.externalServiceId === externalServiceId &&
                    item.externalServiceKey === externalServiceKey,
            ).externalServiceData;
            return JSON.stringify(foundObject, null, 2);
        } else return '';
    };
    const getExternalServiceKey = (
        dataKey: string,
        externalServicesFields: externalServiceField[],
    ) => {
        const foundObject = externalServicesFields.find(
            (obj) => obj.dataKey === dataKey,
        );
        return foundObject ? foundObject.externalServiceKey : null;
    };

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
                            {id !== undefined && (
                                <EuiButtonIcon
                                    size={'m'}
                                    iconType={'cross'}
                                    onClick={() => toggleSelectedId(id)}
                                />
                            )}
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
                                !getExternalServiceKey(
                                    k.includes('.') ? k.split('.')[0] : k,
                                    externalServicesFields,
                                ) ? (
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
                                            <b>
                                                {k.includes('.')
                                                    ? k.split('.')[0]
                                                    : k}
                                            </b>
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
                                            {k.includes('.')
                                                ? data[k.split('.')[0]][
                                                      k.split('.')[1]
                                                  ]
                                                : data[k]}
                                        </td>
                                    </tr>
                                ) : (
                                    <tr>
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
                                                        <td>{data[k]}</td>
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
                                                            data[k],
                                                            getExternalServiceKey(
                                                                k,
                                                                externalServicesFields,
                                                            ),
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
