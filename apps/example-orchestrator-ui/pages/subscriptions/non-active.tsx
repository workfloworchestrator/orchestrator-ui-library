import {
    SubscriptionsOverviewPage,
    SubscriptionsTabType,
} from '../../components/SubscriptionsPage/SubscriptionsPage';

export default function ActiveSubscriptionsPage() {
    return (
        <SubscriptionsOverviewPage
            activeTab={SubscriptionsTabType.NON_ACTIVE}
        />
    );
}
