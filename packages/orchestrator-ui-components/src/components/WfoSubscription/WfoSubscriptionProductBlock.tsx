import React, { useState } from 'react';
import { EuiAccordion } from '@elastic/eui';

import {
    EuiButtonIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';
import { FieldValue } from '../../types';
import { getProductBlockTitle } from './utils';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '../../hooks';
import { getStyles } from './styles';

interface WfoSubscriptionProductBlockProps {
    ownerSubscriptionId: string;
    subscriptionInstanceId: string;
    productBlockInstanceValues: FieldValue[];
    id: number;
}

export const ALWAYS_HIDDEN_KEYS = ['title', 'name', 'label'];
export const HIDDEN_KEYS = [
    'name', // Todo: remove this, it's only here to test
    // 'subscription_instance_id',
    // 'owner_subscription_id',
];
export const WfoSubscriptionProductBlock = ({
    ownerSubscriptionId,
    subscriptionInstanceId,
    productBlockInstanceValues,
}: WfoSubscriptionProductBlockProps) => {
    const { productBlockPanelStyle } = useWithOrchestratorTheme(getStyles);

    const [showAllKeys, setShowAllKeys] = useState(false);

    const isLastCell = (index: number): number => {
        return index === productBlockInstanceValues.length - 1 ? 0 : 1;
    };
    console.log(productBlockInstanceValues);

    return (
        <>
            <EuiSpacer size={'m'}></EuiSpacer>
            <EuiPanel
                color="transparent"
                hasShadow={false}
                css={productBlockPanelStyle}
            >
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
                            <EuiText>
                                Instance ID: {subscriptionInstanceId}
                            </EuiText>
                        </EuiFlexItem>
                        <EuiFlexItem grow={false}>
                            <EuiButtonIcon
                                aria-label="Close"
                                size={'m'}
                                iconType={'cross'}
                                onClick={() => setShowAllKeys(!showAllKeys)}
                            />
                        </EuiFlexItem>
                    </EuiFlexGroup>

                    <EuiSpacer size={'xs'}></EuiSpacer>
                    {
                        <table
                            width="100%"
                            // bgcolor={theme.colors.lightestShade}
                            // style={tableStyle}
                        >
                            {productBlockInstanceValues
                                .filter(
                                    (productBlockInstanceValue) =>
                                        !HIDDEN_KEYS.includes(
                                            productBlockInstanceValue.field,
                                        ) || showAllKeys,
                                )
                                .map((productBlockInstanceValue, index) =>
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
