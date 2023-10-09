import { useQuery } from 'react-query';
import { useContext } from 'react';
import { OrchestratorConfigContext } from '../contexts/OrchestratorConfigContext';

export interface SubscriptionAction {
    name: string;
    description: string;
    reason?: string;
    usable_when?: string[];
    locked_relations?: string[];
    unterminated_parents?: string[];
    unterminated_in_use_by_subscriptions?: string[];
    status?: string;
    action?: string;
}

interface SubscriptionActions {
    reason?: string;
    locked_relations?: string[];
    modify: SubscriptionAction[];
    terminate: SubscriptionAction[];
    system: SubscriptionAction[];
}

export const useSubscriptionActions = (subscriptionId: string) => {
    const { subscriptionActionsEndpoint } = useContext(
        OrchestratorConfigContext,
    );

    const fetchSubscriptionActions = async () => {
        const response = await fetch(
            `${subscriptionActionsEndpoint}/${subscriptionId}`,
            {
                method: 'GET',
            },
        );
        const actions = (await response.json()) as SubscriptionActions;
        return actions;
    };

    return useQuery('subscriptionActions', fetchSubscriptionActions);
};
