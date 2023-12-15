import React, { FC, ReactNode, useState } from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiTextColor } from '@elastic/eui';

import { WfoOptionalLink } from '@/components/WfoOptionalLink';

export type SummaryCardListItem = {
    title: string;
    value: ReactNode;
    url?: string;
};

export type WfoSummaryCardListItemProps = {
    title: string;
    value: ReactNode;
    url?: string;
};

export const WfoSummaryCardListItem: FC<WfoSummaryCardListItemProps> = ({
    title,
    value,
    url,
}) => {
    const [hoverState, setHoverState] = useState(false);

    return (
        <WfoOptionalLink href={url}>
            <EuiFlexGroup
                style={{ paddingBlock: 10 }}
                onMouseOver={() => setHoverState(true)}
                onMouseLeave={() => setHoverState(false)}
                gutterSize="none"
            >
                <EuiFlexItem>
                    <EuiTextColor
                        color={url ? '#397dc2' : 'black'}
                        style={{ fontWeight: 500 }}
                    >
                        {title}
                    </EuiTextColor>
                    <EuiTextColor style={{ fontWeight: 400 }}>
                        {value}
                    </EuiTextColor>
                </EuiFlexItem>
                <EuiFlexItem
                    grow={false}
                    css={{
                        visibility: hoverState && url ? 'visible' : 'hidden',
                    }}
                >
                    <EuiIcon type="sortRight" color="primary" />
                </EuiFlexItem>
            </EuiFlexGroup>
        </WfoOptionalLink>
    );
};
