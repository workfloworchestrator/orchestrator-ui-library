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
    create: SubscriptionAction[];
    modify: SubscriptionAction[];
    terminate: SubscriptionAction[];
    system: SubscriptionAction[];
}

export const useSubscriptionActions = (subscriptionId: string) => {
    const { subscriptionActionsEndpoint } = useContext(
        OrchestratorConfigContext,
    );
    //https://orchestrator.dev.automation.surf.net/api/subscriptions/workflows/77466b50-951f-4362-a817-96ee66e63574
    const fetchSubscriptionActions = async () => {
        const response = await fetch(
            `${subscriptionActionsEndpoint}/${subscriptionId}`,
            {
                method: 'GET',
            },
        );
        return (await response.json()) as SubscriptionActions;
    };

    return useQuery('subscriptionActions', fetchSubscriptionActions);
};
