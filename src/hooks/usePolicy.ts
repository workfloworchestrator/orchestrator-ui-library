import { useContext } from 'react';

import { useRouter } from 'next/router';

import { PolicyContext } from '@/contexts';

export const usePolicy = () => {
  const { isAllowedHandler } = useContext(PolicyContext);
  const router = useRouter();

  return {
    isAllowed: (resource?: string) => isAllowedHandler(router.asPath, resource),
  };
};
