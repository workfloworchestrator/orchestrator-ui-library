import {gql} from "@apollo/client";

const GET_SUBSCRIPTION_DETAIL_BASIC = gql`
  query GetSubscriptions {
subscription(id: "42d8c715-4610-4752-ae5d-3d3b156b1f4e") {
        subscriptionType: __typename
    ... on MyBaseSubscription {
            customerId
            description
            product {
                type
            }
        }
    }
  }
`;


export function Subscription() {

    return (
        <>
            Yo
        </>
    );
}

export default Subscription;
