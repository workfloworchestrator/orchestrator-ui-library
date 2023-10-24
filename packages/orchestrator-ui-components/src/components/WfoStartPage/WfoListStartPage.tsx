import React, { ReactElement } from 'react';
import {
    EuiButton,
    EuiFlexItem,
    EuiHorizontalRule,
    EuiPanel,
    EuiSpacer,
} from '@elastic/eui';
import { WFOListItemStartPage } from './WFOListItemStartPage';
import { ItemsList } from '../../types';

interface WFOListStartPage {
    list: ItemsList;
}

export default function WFOListStartPage({
    list,
}: WFOListStartPage): ReactElement {
    return (
        list?.items && (
            <EuiFlexItem style={{ minWidth: 300 }}>
                <EuiPanel hasShadow={false} hasBorder={true} paddingSize="l">
                    <p style={{ fontWeight: 600 }}>{list.title}</p>
                    <EuiSpacer size="m" />
                    {list.items.map((item, index) => (
                        <div key={index}>
                            <WFOListItemStartPage
                                item={item}
                                type={list.type}
                            />
                            {index === list.items.length - 1 ? null : (
                                <EuiHorizontalRule margin="none" />
                            )}
                        </div>
                    ))}
                    <EuiSpacer size="m" />
                    <EuiButton fullWidth={true}>{list.buttonName}</EuiButton>
                </EuiPanel>
            </EuiFlexItem>
        )
    );
}
