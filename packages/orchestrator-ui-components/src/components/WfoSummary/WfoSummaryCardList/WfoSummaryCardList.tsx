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

import { useWithOrchestratorTheme } from '@/hooks';

import {
    SummaryCardListItem,
    WfoSummaryCardListItem,
} from './WfoSummaryCardListItem';
import { getWfoSummaryCardListStyles } from './styles';

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
    const { listContainerStyle, listHeaderStyle, listStyle } =
        useWithOrchestratorTheme(getWfoSummaryCardListStyles);

    return (
        <EuiFlexItem>
            <EuiPanel
                css={listContainerStyle}
                hasShadow={false}
                hasBorder={true}
                paddingSize="l"
            >
                <div>
                    <p css={listHeaderStyle}>{title}</p>
                    <EuiSpacer size="m" />
                    <div css={[listStyle, useEuiScrollBar()]}>
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
                    <EuiButton
                        fullWidth
                        onClick={() => router.push(button.url)}
                    >
                        {button.name}
                    </EuiButton>
                )}
            </EuiPanel>
        </EuiFlexItem>
    );
};
