import { useEffect, useState } from 'react';
import { useQueryWithGraphql } from './useQueryWithGraphql';
import { SubscriptionListItem } from '../components/WfoSubscriptionsList';
import { getSubscriptionsListGraphQlQuery } from '../graphqlQueries';


export const useGetSubscriptions = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
      const { data, isFetching } = useQueryWithGraphql(
          getSubscriptionsListGraphQlQuery<SubscriptionListItem>(),
          {
first:
          },
          'subscriptionIdField'
      )
        
  }, [trigger])


  return {
    isLoading,

  }
}