import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { PATH_WORKFLOWS } from '@orchestrator-ui/orchestrator-ui-components';

const IndexPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.push(PATH_WORKFLOWS);
    }, [router]);

    return null;
};

export default IndexPage;
