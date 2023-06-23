import { SubscriptionsOverviewPage } from '../../components/SubscriptionsPage/SubscriptionsPage';

export default function ActiveSubscriptionsPage() {
    return (
        <SubscriptionsOverviewPage
            alwaysOnFilter={['status', 'initial-provisioning-terminated']}
            activeTab="non-active"
        />
    );
}
