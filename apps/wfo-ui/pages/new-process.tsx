import { EuiHorizontalRule, EuiPageHeader, EuiSpacer } from '@elastic/eui';
import React from 'react';
import WFONewProcess from '@orchestrator-ui/orchestrator-ui-components/src/pages/processes/WFONewProcess';
import {apiClient} from "@orchestrator-ui/orchestrator-ui-components";
import {useQuery} from "react-query";

export function NewProcessPage() {
    /* eslint-disable  @typescript-eslint/no-explicit-any */

    const { isLoading, error, data } = useQuery(
        ["products"],
        apiClient.products,
    );

    return (
        <>
            <EuiPageHeader pageTitle="New process" />
            <EuiHorizontalRule />
            <EuiSpacer />
            {!isLoading && !error &&
                <WFONewProcess preselectedInput={{}} products={data} />
            }

            <EuiSpacer />
        </>
    );
}

export default NewProcessPage;
