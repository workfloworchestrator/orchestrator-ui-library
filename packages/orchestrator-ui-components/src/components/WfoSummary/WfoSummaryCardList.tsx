import React, { FC, ReactNode, useState } from 'react';

import Link from 'next/link';
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
    useEuiScrollBar,
} from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

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
    const { theme } = useOrchestratorTheme();

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
                    <div
                        css={[
                            {
                                height: theme.base * 20,
                                overflow: 'auto',
                            },
                            useEuiScrollBar(),
                        ]}
                    >
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
                    </div>
                </div>
                <EuiSpacer size="m" />
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
    url: string;
};

export const WfoSummaryListItem: FC<WfoSummaryListItemProps> = ({
    title,
    value,
    url,
}) => {
    const [hoverState, setHoverState] = useState(false);

    return (
        <Link href={url}>
            <EuiFlexGroup
                style={{ cursor: 'pointer', paddingBlock: 10 }}
                onMouseOver={() => setHoverState(true)}
                onMouseLeave={() => setHoverState(false)}
                gutterSize="none"
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
                    css={{ visibility: hoverState ? 'visible' : 'hidden' }}
                >
                    <EuiIcon type="sortRight" color="primary" />
                </EuiFlexItem>
            </EuiFlexGroup>
        </Link>
    );
};
