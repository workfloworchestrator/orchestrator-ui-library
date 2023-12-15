import React, { FC, ReactNode, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import type { UrlObject } from 'url';

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
    url?: string;
};

export type SummaryCardButtonConfig = {
    name: string;
    url: string;
};

export type WfoSummaryCardListProps = {
    title: string;
    items: SummaryCardListItem[];
    button?: SummaryCardButtonConfig;
};

export const WfoSummaryCardList: FC<WfoSummaryCardListProps> = ({
    title,
    items,
    button,
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
                {button && (
                    <div>
                        <EuiButton
                            fullWidth
                            onClick={() => router.push(button.url)}
                        >
                            {button.name}
                        </EuiButton>
                    </div>
                )}
            </EuiPanel>
        </EuiFlexItem>
    );
};

export type WfoSummaryListItemProps = {
    title: string;
    value: ReactNode;
    url?: string;
};

export type WfoOptionalLinkProps = {
    children: ReactNode;
    href?: UrlObject | string;
};

export const WfoOptionalLink: FC<WfoOptionalLinkProps> = ({
    children,
    href,
}) => {
    if (!href) {
        return <span>{children}</span>;
    }

    return <Link href={href}>{children}</Link>;
};

export const WfoSummaryListItem: FC<WfoSummaryListItemProps> = ({
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
