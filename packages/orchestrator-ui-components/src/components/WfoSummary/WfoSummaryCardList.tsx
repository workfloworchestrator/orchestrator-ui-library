import React, { FC, ReactNode, useState } from 'react';

import { useRouter } from 'next/router';

import {
    EuiButton,
    EuiFlexGroup,
    EuiFlexItem,
    EuiHorizontalRule,
    EuiIcon,
    EuiPanel,
    EuiSpacer,
    EuiTextColor,
} from '@elastic/eui';

export type SummaryCardListItem = {
    title: string;
    value: ReactNode;
    url: string;
};

export type WfoSummaryCardListProps = {
    title: string;
    items: SummaryCardListItem[];
    buttonName: string;
    buttonUrl: string;
};

export const WfoSummaryCardList: FC<WfoSummaryCardListProps> = ({
    title,
    items,
    buttonName,
    buttonUrl,
}) => {
    const router = useRouter();

    return (
        <EuiFlexItem style={{ minWidth: 300 }}>
            <EuiPanel
                css={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    flexGrow: 1,
                }}
                hasShadow={false}
                hasBorder={true}
                paddingSize="l"
            >
                <div>
                    <p style={{ fontWeight: 600 }}>{title}</p>
                    <EuiSpacer size="m" />
                    {items?.map((item, index) => (
                        <div key={index}>
                            <WfoSummaryListItem
                                title={item.title}
                                value={item.value}
                                url={item.url}
                            />
                            {index === items.length - 1 ? null : (
                                <EuiHorizontalRule margin="none" />
                            )}
                        </div>
                    ))}
                    <EuiSpacer size="m" />
                </div>
                <div>
                    <EuiButton fullWidth onClick={() => router.push(buttonUrl)}>
                        {buttonName}
                    </EuiButton>
                </div>
            </EuiPanel>
        </EuiFlexItem>
    );
};

export type WfoSummaryListItemProps = {
    title: string;
    value: ReactNode;
    url: string; // todo verify if this can be undefined
};

export const WfoSummaryListItem: FC<WfoSummaryListItemProps> = ({
    title,
    value,
    url,
}) => {
    // Todo: remove state from this component --> CSS
    const [hoverState, setHoverState] = useState(false);

    return (
        <a href={url}>
            <EuiFlexGroup
                style={{ cursor: 'pointer', paddingBlock: 10 }}
                onMouseOver={() => setHoverState(true)}
                onMouseLeave={() => setHoverState(false)}
            >
                <EuiFlexItem>
                    <EuiTextColor
                        color={hoverState ? '#397dc2' : 'black'}
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
                    style={{ display: hoverState ? 'block' : 'none' }}
                >
                    <EuiIcon type="sortRight" color="primary" />
                </EuiFlexItem>
            </EuiFlexGroup>
        </a>
    );
};
