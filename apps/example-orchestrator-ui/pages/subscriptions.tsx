import React, {ReactElement, useState} from 'react';
import {
    EuiPageTemplate,
    EuiButton, EuiButtonIcon, EuiDescriptionList, EuiDescriptionListTitle, EuiDescriptionListDescription
} from '@elastic/eui';
import {useQuery, gql} from '@apollo/client';


const GET_SUBSCRIPTIONS = gql`
  query GetSubscriptions {
    subscriptions(first: 1000) {
    edges {
      node {
        note
        name
        startDate
        endDate
        tag
        productId
        portSubscriptionInstanceId
        vlanRange
        description
        product {
          name
          type
          tag
        }
        insync
        status
        subscriptionId
      }
    }
    }
  }
`;


export function Subscriptions() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isPanelled, setIsPanelled] = useState(false);
    const [isFluid, setIsFluid] = useState(true);
    const {loading, error, data} = useQuery(GET_SUBSCRIPTIONS);

    const button = () => <EuiButtonIcon iconType={"refresh"}></EuiButtonIcon>
    return (
        <EuiPageTemplate
            panelled={isPanelled}
            restrictWidth={!isFluid}
            bottomBorder={true}
            offset={0}
            grow={false}
        >
            <EuiPageTemplate.Section
                grow={false}
                color="subdued"
                bottomBorder="extended"
            >
                SUPER SURF NAVIGATION
            </EuiPageTemplate.Section>
            <EuiPageTemplate.Header rightSideItems={[button()]}>
                <EuiButton onClick={() => setIsFluid(!isFluid)}
                           iconType={isFluid ? "minimize" : "fullScreen"}>{isFluid ? "Shrink" : "Grow"}</EuiButton>
                <EuiButton onClick={() => setIsPanelled(!isPanelled)}
                           iconType={isPanelled ? "inputOutput" : "container"}
                           style={{marginLeft: "5px"}}>{isPanelled ? "Un panel" : "Panel"}</EuiButton>
                <EuiButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                           iconType={isSidebarOpen ? "arrowLeft" : "arrowRight"}
                           style={{marginLeft: "5px"}}>{isSidebarOpen ? "Un panel" : "Panel"}</EuiButton>
            </EuiPageTemplate.Header>
            {isSidebarOpen && <EuiPageTemplate.Sidebar>
                Cool
            </EuiPageTemplate.Sidebar>}
            {loading && <EuiPageTemplate.EmptyPrompt
                title={<span>Loading data</span>}
            >
                No data yet
            </EuiPageTemplate.EmptyPrompt>}
            {!loading && data &&
                <EuiPageTemplate.Section>
                    <EuiDescriptionList>
                        {data.subscriptions.edges.map((item) => <>
                            <EuiDescriptionListTitle>{item.node.description}</EuiDescriptionListTitle></>)}
                    </EuiDescriptionList>
                </EuiPageTemplate.Section>
            }
        </EuiPageTemplate>
    );
}

export default Subscriptions;
