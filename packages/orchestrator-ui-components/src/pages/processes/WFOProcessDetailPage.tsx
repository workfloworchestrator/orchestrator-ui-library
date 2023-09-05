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

import { ProcessDetailStep } from '../../types';
import { useTranslations } from 'next-intl';
import { useQueryWithGraphql } from '../../hooks';
import { GET_PROCESS_DETAIL_GRAPHQL_QUERY } from '../../graphqlQueries';
import { WFOLoading } from '../../components';

interface WFOProcessDetailPageProps {
    processId: string;
}

export const WFOProcessDetailPage = ({
    processId,
}: WFOProcessDetailPageProps) => {
    const t = useTranslations('processes.detail');
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

    return (
        <>
            <EuiFlexGroup>
                <EuiFlexItem>
                    <EuiPageHeader
                        pageTitle={isFetching ? '...' : 'NAMEOFPROCESS'}
                    />
                </EuiFlexItem>
                <EuiFlexGroup
                    justifyContent="flexEnd"
                    direction="row"
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
                grow={false}
                element="div"
            >
                {(isFetching && <WFOLoading />) || (
                    <EuiFlexGroup direction="row" gutterSize="xs">
                        <EuiFlexGroup direction="column" gutterSize="xs">
                            <EuiText size="xs">{t('status')}</EuiText>
                            <EuiText size="s">
                                <h4>{process?.status}</h4>
                            </EuiText>
                        </EuiFlexGroup>
                        <EuiFlexGroup direction="column" gutterSize="xs">
                            <EuiText size="xs">{t('startedBy')}</EuiText>
                            <EuiText size="s">
                                <h4>{process?.createdBy}</h4>
                            </EuiText>
                        </EuiFlexGroup>
                        <EuiFlexGroup direction="column" gutterSize="xs">
                            <EuiText size="xs">{t('currentStep')}</EuiText>
                            <EuiText size="s">
                                <h4>
                                    {getCurrentStep(
                                        process?.steps,
                                        process?.step,
                                    )}
                                </h4>
                            </EuiText>
                        </EuiFlexGroup>
                        <EuiFlexGroup direction="column" gutterSize="xs">
                            <EuiText size="xs">{t('startedOn')}</EuiText>
                            <EuiText size="s">
                                <h4>{process?.started}</h4>
                            </EuiText>
                        </EuiFlexGroup>
                        <EuiFlexGroup direction="column" gutterSize="xs">
                            <EuiText size="xs">{t('lastUpdate')}</EuiText>
                            <EuiText size="s">
                                <h4>{process?.lastModified}</h4>
                            </EuiText>
                        </EuiFlexGroup>
                        <EuiFlexGroup direction="column" gutterSize="xs">
                            <EuiText size="xs">
                                {t('relatedSubscriptions')}
                            </EuiText>
                            <EuiText size="s">
                                <h4>
                                    {t('subscriptions', {
                                        count:
                                            process?.subscriptions.page
                                                .length || 0,
                                    })}
                                </h4>
                            </EuiText>
                        </EuiFlexGroup>
                    </EuiFlexGroup>
                )}
            </EuiPanel>
        </>
    );
};
