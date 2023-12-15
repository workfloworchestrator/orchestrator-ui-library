import React, { FC } from 'react';

import { useRouter } from 'next/router';

import {
    EuiButton,
    EuiFlexItem,
    EuiHorizontalRule,
    EuiPanel,
    EuiSpacer,
    useEuiScrollBar,
} from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

import {
    SummaryCardListItem,
    WfoSummaryCardListItem,
} from './WfoSummaryCardListItem';

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
                                <WfoSummaryCardListItem
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
