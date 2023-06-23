import { SubscriptionsOverviewPage } from '../../components/SubscriptionsPage/SubscriptionsPage';

export default function ActiveSubscriptionsPage() {
    return (
        <SubscriptionsOverviewPage
            alwaysOnFilter={['status', 'active']}
            activeTab="active"
        />
    );
}
