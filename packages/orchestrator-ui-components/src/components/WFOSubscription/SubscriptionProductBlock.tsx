import React from 'react';
import { EuiAccordion } from '@elastic/eui';

import {
    EuiButtonIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';
import { TreeContext, TreeContextType } from '../../contexts';
import { FieldValue } from '../../types';
import { getProductBlockTitle } from './utils';

interface SubscriptionProductBlock {
    productBlockInstanceValues: FieldValue[];
    id: number;
}

export const SubscriptionProductBlock = ({
    productBlockInstanceValues,
    id,
}: SubscriptionProductBlock) => {
    const { toggleSelectedId } = React.useContext(
        TreeContext,
    ) as TreeContextType;

    const isLastCell = (index: number): number => {
        return index === productBlockInstanceValues.length - 1 ? 0 : 1;
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
                                    {getProductBlockTitle(
                                        productBlockInstanceValues,
                                    )}
                                </h3>
                            </EuiText>
                        </EuiFlexItem>
                        <EuiFlexItem grow={false}>
                            <EuiButtonIcon
                                aria-label="Close"
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
                            {productBlockInstanceValues.map(
                                (productBlockInstanceValue, index) =>
                                    !productBlockInstanceValue.field.startsWith(
                                        'ims_ci',
                                    ) ? (
                                        <tr key={index}>
                                            <td
                                                valign={'top'}
                                                style={{
                                                    width: 250,
                                                    padding: 10,
                                                    borderBottom: `solid ${isLastCell(
                                                        index,
                                                    )}px #ddd`,
                                                }}
                                            >
                                                <b>
                                                    {
                                                        productBlockInstanceValue.field
                                                    }
                                                </b>
                                            </td>
                                            <td
                                                style={{
                                                    padding: 10,
                                                    borderBottom: `solid ${isLastCell(
                                                        index,
                                                    )}px #ddd`,
                                                }}
                                            >
                                                {
                                                    productBlockInstanceValue.value
                                                }
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr key={index}>
                                            <td
                                                colSpan={3}
                                                style={{
                                                    padding: 10,
                                                    borderBottom: `solid ${isLastCell(
                                                        index,
                                                    )}px #ddd`,
                                                }}
                                            >
                                                <EuiAccordion
                                                    id={
                                                        productBlockInstanceValue.field
                                                    }
                                                    arrowDisplay="left"
                                                    buttonContent={
                                                        <div>
                                                            <td
                                                                valign={'top'}
                                                                style={{
                                                                    width: 222,
                                                                }}
                                                            >
                                                                <b>
                                                                    {
                                                                        productBlockInstanceValue.field
                                                                    }
                                                                </b>
                                                            </td>
                                                            <td>
                                                                {
                                                                    productBlockInstanceValue.value
                                                                }
                                                            </td>
                                                        </div>
                                                    }
                                                ></EuiAccordion>
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
