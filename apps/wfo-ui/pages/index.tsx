import { SortOrder } from "@orchestrator-ui/orchestrator-ui-components";

export function Index() {
    return (
        <>
            <h1>POC: enum from lib</h1>
            <p>{SortOrder.ASC}</p>
        </>
    );
}

export default Index;
