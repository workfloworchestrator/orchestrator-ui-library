import React from 'react';
import {
    EuiButton,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPageHeader,
    EuiSpacer,
    EuiText,
    EuiPanel,
} from '@elastic/eui';
import { useTranslations } from 'next-intl';
import { ProcessDetailStep, ProcessStatus } from '../../types';
import {
    parseDateRelativeToToday,
    getProductNamesFromProcess,
} from '../../utils';
import { useOrchestratorTheme, useQueryWithGraphql } from '../../hooks';
import { GET_PROCESS_DETAIL_GRAPHQL_QUERY } from '../../graphqlQueries';
import { WFOLoading } from '../../components';
import {
    WFOProcessListSubscriptionsCell,
    RenderDirection,
} from './WFOProcessListSubscriptionsCell';

interface WFOProcessDetailPageProps {
    processId: string;
}

interface ProcessHeaderValueProps {
    translationKey: string;
    value: string | ProcessStatus | undefined;
}

const ProcessHeaderValue = ({
    translationKey,
    value = '',
}: ProcessHeaderValueProps) => {
    const t = useTranslations('processes.detail');
    const { theme } = useOrchestratorTheme();
    return (
        <EuiFlexGroup
            direction="column"
            gutterSize="xs"
            css={{
                flex: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
            }}
        >
            <EuiText size="xs">{t(translationKey)}</EuiText>
            <EuiText
                css={{
                    fontWeight: theme.font.weight.bold,
                    fontSize: theme.size.m,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {value}
            </EuiText>
        </EuiFlexGroup>
    );
};

export const WFOProcessDetailPage = ({
    processId,
}: WFOProcessDetailPageProps) => {
    const t = useTranslations('processes.detail');
    const { theme } = useOrchestratorTheme();
    const { data, isFetching } = useQueryWithGraphql(
        GET_PROCESS_DETAIL_GRAPHQL_QUERY,
        {
            processId,
        },
        'processDetail',
        true,
    );

    const process = data?.processes.page[0];

    const getCurrentStep = (
        steps: ProcessDetailStep[] = [],
        lastCompletedStepName: string = '',
    ) => {
        const lastCompletedStep = steps.find(
            (step) => step.name === lastCompletedStepName,
        );

        if (lastCompletedStep) {
            const currentStepIndex = steps.indexOf(lastCompletedStep);
            return steps[currentStepIndex + 1]
                ? steps[currentStepIndex + 1].name
                : steps[currentStepIndex].name;
        }

        return steps[0] ? steps[0].name : '';
    };
    console.log(process);
    if (process) {
        process.subscriptions.page = [
            ...process.subscriptions.page,
            ...process.subscriptions.page,
        ];
        process.lastModified = '2023-09-06T12:33:47.589561+00:00';
    }
    return (
        <>
            <EuiFlexGroup>
                <EuiFlexItem>
                    <EuiPageHeader
                        pageTitle={isFetching ? '...' : 'TODO: WORKFLOW NAME'}
                    />
                    <EuiSpacer />
                    <EuiText size="s">
                        {getProductNamesFromProcess(process)}
                    </EuiText>
                </EuiFlexItem>
                <EuiFlexGroup
                    justifyContent="flexEnd"
                    direction="row"
                    css={{ flexGrow: 0 }}
                    gutterSize="s"
                >
                    <EuiButton
                        onClick={(
                            e: React.MouseEvent<
                                HTMLButtonElement | HTMLElement,
                                MouseEvent
                            >,
                        ) => {
                            e.preventDefault();
                            alert('TODO: Implement retry');
                        }}
                        iconType="refresh"
                        isDisabled={isFetching}
                    >
                        {t('retry')}
                    </EuiButton>
                    <EuiButton
                        onClick={(
                            e: React.MouseEvent<
                                HTMLButtonElement | HTMLElement,
                                MouseEvent
                            >,
                        ) => {
                            e.preventDefault();
                            alert('TODO: Implement resume');
                        }}
                        iconType="play"
                        isDisabled={isFetching}
                    >
                        {t('resume')}
                    </EuiButton>
                    <EuiButton
                        onClick={(
                            e: React.MouseEvent<
                                HTMLButtonElement | HTMLElement,
                                MouseEvent
                            >,
                        ) => {
                            e.preventDefault();
                            alert('TODO: Implement abort');
                        }}
                        iconType="cross"
                        color="danger"
                        isDisabled={isFetching}
                    >
                        {t('abort')}
                    </EuiButton>
                </EuiFlexGroup>
            </EuiFlexGroup>
            <EuiSpacer />

            <EuiPanel
                hasShadow={false}
                hasBorder={false}
                color="subdued"
                element="div"
            >
                {(isFetching && <WFOLoading />) || (
                    <EuiFlexGroup direction="row" gutterSize="m">
                        <ProcessHeaderValue
                            translationKey="status"
                            value={process?.status}
                        />
                        <ProcessHeaderValue
                            translationKey="startedBy"
                            value={process?.createdBy}
                        />
                        {process?.customer && (
                            <ProcessHeaderValue
                                translationKey="customer"
                                value={process?.customer}
                            />
                        )}
                        <ProcessHeaderValue
                            translationKey="currentStep"
                            value={getCurrentStep(
                                process?.steps,
                                process?.step,
                            )}
                        />
                        <ProcessHeaderValue
                            translationKey="startedOn"
                            value={parseDateRelativeToToday(process?.started)}
                        />
                        <ProcessHeaderValue
                            translationKey="lastUpdate"
                            value={parseDateRelativeToToday(
                                process?.lastModified,
                            )}
                        />

                        <EuiFlexGroup
                            gutterSize="xs"
                            direction="column"
                            css={{
                                flex: 1,
                                overflow: 'hidden',
                            }}
                        >
                            <EuiText size="xs">
                                {t('relatedSubscriptions')}
                            </EuiText>
                            <EuiText
                                css={{
                                    flex: 1,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontSize: theme.size.m,
                                }}
                            >
                                <WFOProcessListSubscriptionsCell
                                    subscriptions={
                                        (process &&
                                            process?.subscriptions.page.map(
                                                (subscription) => ({
                                                    subscriptionId:
                                                        subscription.subscriptionId,
                                                    description:
                                                        subscription.description,
                                                }),
                                            )) ||
                                        []
                                    }
                                    renderDirection={RenderDirection.VERTICAL}
                                />
                            </EuiText>
                        </EuiFlexGroup>
                    </EuiFlexGroup>
                )}
            </EuiPanel>
        </>
    );
};
