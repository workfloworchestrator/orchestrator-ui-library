import React, { LegacyRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiComboBox,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';
import { EuiComboBoxOptionOption } from '@elastic/eui/src/components/combo_box/types';
import {
    WfoChevronDown,
    WfoChevronUp,
    WfoContactEnvelopeFill,
    WfoJsonCodeBlock,
    calculateTimeDifference,
    formatDate,
    getStepContent,
    upperCaseFirstChar,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import { WfoAvatar } from '@/components/WfoAvatar/WfoAvatar';
import { getStyles } from '@/components/WfoEmailList/styles';
import { EmailListItem } from '@/types';

export interface WfoStepProps {
    emailListItem: EmailListItem;
    showHiddenKeys: boolean;
    onToggleStepDetail: () => void;
}

export const WfoEmailStep = React.forwardRef(
    (
        { emailListItem, onToggleStepDetail, showHiddenKeys }: WfoStepProps,
        ref: LegacyRef<HTMLDivElement>,
    ) => {
        const t = useTranslations(
            'cim.serviceTickets.detail.tabDetails.sentEmails',
        );
        const { theme } = useOrchestratorTheme();
        const { isExpanded, step } = emailListItem;

        const options: EuiComboBoxOptionOption[] = step.emails.map((email) => ({
            label: email.customer.customer_name,
            value: email.message,
        }));

        const [selectedOptions, setSelected] = useState<
            EuiComboBoxOptionOption[]
        >([options[0]]);

        const onChange = (selectedOptions: EuiComboBoxOptionOption[]) => {
            setSelected(selectedOptions);
        };

        const {
            getStepHeaderStyle,
            stepHeaderRightStyle,
            stepListContentBoldTextStyle,
            stepDurationStyle,
            stepRowStyle,
            getStepToggleExpandStyle,
        } = getStyles(theme);

        const stepContent = step.emails
            ? getStepContent(step.emails, showHiddenKeys)
            : {};

        const hasStepContent = Object.keys(stepContent).length > 0;

        const sentOn = `${t('sentOn')} ${formatDate(step.executed)} ${t('by')}`;

        return (
            <div ref={ref}>
                <EuiPanel>
                    <EuiFlexGroup
                        css={getStepHeaderStyle(hasStepContent)}
                        onClick={() => hasStepContent && onToggleStepDetail()}
                    >
                        <WfoAvatar
                            stepStatus={step.status}
                            icon={<WfoContactEnvelopeFill />}
                            hasCheckmark={true}
                        />

                        <EuiFlexItem grow={0}>
                            <EuiText css={stepListContentBoldTextStyle}>
                                {step.name}
                            </EuiText>
                            <EuiText color={'subdued'}>{sentOn}</EuiText>
                        </EuiFlexItem>

                        <EuiFlexGroup css={stepRowStyle}>
                            {step.executed && (
                                <>
                                    <EuiFlexItem
                                        grow={0}
                                        css={stepHeaderRightStyle}
                                    >
                                        <EuiText css={stepDurationStyle}>
                                            {t('showMore')}
                                        </EuiText>
                                    </EuiFlexItem>
                                    <EuiFlexItem
                                        grow={0}
                                        css={getStepToggleExpandStyle(
                                            hasStepContent,
                                        )}
                                    >
                                        {(isExpanded && <WfoChevronUp />) || (
                                            <WfoChevronDown />
                                        )}
                                    </EuiFlexItem>
                                </>
                            )}
                        </EuiFlexGroup>
                    </EuiFlexGroup>
                    {hasStepContent && isExpanded && (
                        <EuiPanel
                            color="subdued"
                            paddingSize="xl"
                            css={{ marginTop: theme.size.m }}
                        >
                            <EuiFlexGroup wrap={true}>
                                <EuiFlexItem
                                    grow={2}
                                    css={{ minWidth: theme.breakpoint.s / 2 }}
                                >
                                    <EuiText>
                                        <b>{t('customer')}</b>
                                    </EuiText>
                                    <EuiSpacer size="s" />
                                    <EuiComboBox
                                        options={options}
                                        selectedOptions={selectedOptions}
                                        onChange={onChange}
                                        singleSelection={{ asPlainText: true }}
                                    />
                                </EuiFlexItem>
                                <EuiFlexItem
                                    grow={5}
                                    dangerouslySetInnerHTML={{
                                        __html: selectedOptions[0].value ?? '',
                                    }}
                                />
                            </EuiFlexGroup>
                        </EuiPanel>
                    )}
                </EuiPanel>
            </div>
        );
    },
);

WfoEmailStep.displayName = 'WfoEmailStep';
