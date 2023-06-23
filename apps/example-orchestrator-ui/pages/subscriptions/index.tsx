import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SubscriptionsPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/subscriptions/active');
    });
}
