import React, { ReactElement } from 'react';
import {
    EuiButton,
    EuiFlexItem,
    EuiHorizontalRule,
    EuiPanel,
    EuiSpacer,
} from '@elastic/eui';
import { ItemsList } from './ListsRowStartPage';
import ListItemStartPage from './ListItemStartPage';

interface IProps {
    list: ItemsList;
}

export default function ListStartPage({ list }: IProps): ReactElement {
    return (
        list && (
            <EuiFlexItem>
                <EuiPanel hasShadow={false} hasBorder={true} paddingSize="l">
                    <p style={{ fontWeight: 600 }}>{list.title}</p>
                    <EuiSpacer size="m" />
                    {list.items.map((item, index) => (
                        <>
                            <ListItemStartPage item={item} type={list.type} />
                            {index === list.items.length - 1 ? null : (
                                <EuiHorizontalRule margin="none" />
                            )}
                        </>
                    ))}
                    <EuiSpacer size="m" />
                    <EuiButton fullWidth={true}>{list.buttonName}</EuiButton>
                </EuiPanel>
            </EuiFlexItem>
        )
    );
}
